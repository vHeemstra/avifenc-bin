import {
  access as accessCB,
  createWriteStream,
  unlink as unlinkCB,
} from "node:fs";
import {
  access,
  chmod,
  constants as fsConstants,
  mkdir,
  readFile,
  unlink,
  writeFile,
} from "node:fs/promises";
import { get } from "node:https";
import { basename } from "node:path";
import { exec as execCB, execFile as execFileCB } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import decompress from "decompress";
import getBinaryPathOrCommand, { libavif_version, sources } from "./index.js";

const exec = promisify(execCB);
const execFile = promisify(execFileCB);

/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path/filename to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 * @source https://stackoverflow.com/a/62786397/2142071
 */
function download(url, dest) {
  // console.log(`Try downloading: ${url}`);
  // console.log(`To: ${dest}`);

  return new Promise((resolve, reject) => {
    // Check file does not exist yet before hitting network
    accessCB(dest, fsConstants.F_OK, (err) => {
      if (err === null) reject("File already exists");

      get(url, (response) => {
        if (response.statusCode === 200) {
          const file = createWriteStream(dest, { flags: "wx" });
          file.on("finish", () => resolve());
          file.on("error", (err) => {
            file.close();
            if (err.code === "EEXIST") {
              reject("File already exists");
            } else {
              // Delete temp file
              unlinkCB(dest, () => reject(err.message));
            }
          });
          response.pipe(file);
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          // Recursively follow redirects, only a 200 will resolve.
          download(response.headers.location, dest).then(() => resolve());
        } else {
          reject(
            `Server responded with ${response.statusCode}: ${response.statusMessage}`
          );
        }
      }).on("error", (err) => {
        reject(err.message);
      });
    });
  });
}

const logPadding = "  ";

// Get first matching source
const source = {
  ...sources[0],
  cmd: getBinaryPathOrCommand(false),
};

// Try global command
let cmdInstalled = false;
try {
  const { stdout, stderr } = await exec(`${basename(source.cmd)} --version`);

  // if (stderr) {
  //   console.error(logPadding + "✘ Error checking command version:");
  //   console.error(stderr);
  // }

  if (stdout.startsWith(`Version: ${libavif_version} `)) {
    cmdInstalled = true;
  }
} catch (err) {
  // console.error(logPadding + "✘ Error executing command:");
  // console.error(err?.message || err);
}

// Overwrite CLI file to use command instead
const flagFile = `${fileURLToPath(new URL("./", import.meta.url))}/index.js`;
if (cmdInstalled) {
  cmdInstalled = false;
  // Set flag in ./cli.js
  try {
    const data = await readFile(flagFile, "utf8");
    await writeFile(
      flagFile,
      data.replace("const use_command = false;", "const use_command = true;"),
      "utf8"
    );
    cmdInstalled = true;
  } catch (err) {
    console.error(logPadding + "✘ Could not set use of global command:");
    console.error(err?.message || err);
  }
} else {
  // Unset flag in ./cli.js (to be sure)
  try {
    const data = await readFile(flagFile, "utf8");
    await writeFile(
      flagFile,
      data.replace("const use_command = true;", "const use_command = false;"),
      "utf8"
    );
  } catch (err) {
    console.error(logPadding + "✘ Could not unset use of global command:");
    console.error(err?.message || err);
  }
}

if (cmdInstalled) {
  console.log(
    `✔ Binary '${source.file}' is already installed as global command (libavif version ${libavif_version}).`
  );
}

// Check binary file exists
let fileExists = false;
try {
  await access(source.cmd, fsConstants.R_OK);
  fileExists = true;
  // console.log(logPadding + "✔ Binary file exists");
} catch {
  console.error(
    logPadding +
      "✘ Binary file doesn't exist. Trying to download from source..."
  );
}

// Check if destination folder exists
let folderExists = false;
if (!fileExists) {
  try {
    await access(source.dest);
    folderExists = true;
    console.log(logPadding + "✔ Destination folder exists");
  } catch {
    // console.error(logPadding + "✘ Destination folder doesn't exist");
  }

  // Create folder
  if (!folderExists) {
    try {
      await mkdir(source.dest, { recursive: true });
      folderExists = true;
      console.log(logPadding + "✔ Created destination folder");
    } catch (err) {
      console.error(logPadding + "✘ Could not create destination folder:");
      console.error(err.message);
    }
  }
}

// Download binary zip
const zipFilename = `${source.dest}${basename(source.src)}`;
let tryUnzip = false;
if (!fileExists && folderExists) {
  try {
    await download(source.src, zipFilename);
    tryUnzip = true;
    console.log(logPadding + "✔ Downloaded zip from source");
  } catch (errorMessage) {
    console.error(logPadding + "✘ Could not download zip from source:");
    console.error(errorMessage);
  }
}

// Unzip binary
if (tryUnzip) {
  try {
    const files = await decompress(zipFilename, source.dest, {
      filter: (file) => file.path === source.file,
    });
    fileExists = files.some((f) => f.type === "file" && f.path === source.file);
    if (fileExists) {
      console.log(logPadding + "✔ Unzipped binary from source");
    } else {
      console.error(logPadding + "✘ Source zip did not contain binary");
    }
  } catch (err) {
    console.error(logPadding + "✘ Could not unzip binary from source:");
    console.error(err.message);
  }

  // Cleanup zip
  try {
    await unlink(zipFilename);
    console.log(logPadding + "✔ Cleaned up zip");
  } catch (err) {
    console.error(logPadding + "✘ Could not clean up zip:");
    console.error(err.message);
  }
}

// Check file executable
let fileIsExecutable = false;
if (fileExists) {
  try {
    await access(source.cmd, fsConstants.X_OK);
    fileIsExecutable = true;
    // console.log(logPadding + "✔ Binary is executable");
  } catch {
    // console.error(logPadding + "✘ Binary is not executable");

    // Make executable
    try {
      await chmod(source.cmd, 0o755);
      fileIsExecutable = true;
      // console.log(logPadding + "✔ Binary made executable");
    } catch {
      console.error(logPadding + "✘ Could not make binary executable");
    }
  }
}

// Run binary with `--version`
let binaryInstalled = false;
if (fileIsExecutable) {
  try {
    const { stdout, stderr } = await execFile(source.cmd, ["--version"]);

    if (stderr) {
      console.error(logPadding + "✘ Error checking binary version:");
      console.error(stderr);
    }

    if (stdout.startsWith(`Version: ${libavif_version} `)) {
      binaryInstalled = true;
    }
  } catch (err) {
    console.error(logPadding + "✘ Error executing binary:");
    console.error(err?.message || err);
  }
}

// Final feedback
if (binaryInstalled) {
  console.log(
    `✔ Binary '${source.file}' is installed (libavif version ${libavif_version}).`
  );
} else {
  console.error("✘ Binary could not be installed.");
}
