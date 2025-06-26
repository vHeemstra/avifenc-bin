import { readFileSync } from "node:fs";
import { platform } from "node:process";
import arch from "arch";
import { fileURLToPath } from "node:url";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url))
);
export const libavif_version = pkg.libavif_version;

const architecture = arch();

// Official sources for binaries
const sourceBaseUrl = `https://github.com/AOMediaCodec/libavif/releases/download/v${libavif_version}`;
export const sources = [
  ["x64", "linux", `${sourceBaseUrl}/linux-artifacts.zip`],
  ["x64", "darwin", `${sourceBaseUrl}/macOS-artifacts.zip`],
  ["x64", "win32", `${sourceBaseUrl}/windows-artifacts.zip`],
]
  .filter((s) => s[0] === architecture && s[1] === platform)
  .map((s) => ({
    src: s[2],
    dest: `${fileURLToPath(new URL("../vendor", import.meta.url))}/${s[1]}_${
      s[0]
    }/`,
    file: s[1] === "win32" ? "avifenc.exe" : "avifenc",
  }));

function getBinaryPathOrCommand(use_global_command = true) {
  if (sources.length === 0) {
    throw new Error(
      `No binary found for this system [platform: ${platform}, architecture: ${architecture}]`
    );
  }

  /**
   * NOTE:
   * This variable can be overwritten by the install script
   * if the global command is or is not found working.
   */
  const use_command = false;

  return `${use_global_command && use_command ? "" : sources[0].dest}${
    sources[0].file
  }`;
}

export default getBinaryPathOrCommand;
