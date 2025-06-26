import { execFile as execFileCB } from "node:child_process";
import { readFileSync, constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "ava";
import { temporaryDirectory } from "tempy";
import getBinaryPathOrCommand from "../lib/index.js";

const execFile = promisify(execFileCB);
const avifenc = getBinaryPathOrCommand(false);

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url))
);

test("return path to binary and verify that it is working", async (t) => {
  let binaryInstalled = false;
  try {
    const { stdout } = await execFile(avifenc, ["--version"]);

    if (stdout.startsWith(`Version: ${pkg.libavif_version} `)) {
      binaryInstalled = true;
    }
  } catch (err) {}

  t.true(binaryInstalled);
});

test("minify and convert a JPG to AVIF", async (t) => {
  const temporary = temporaryDirectory();
  const src = fileURLToPath(new URL("fixtures/test.jpg", import.meta.url));
  const dest = join(temporary, "test.avif");
  const args = ["--output", dest, src];

  await execFile(avifenc, args);

  let fileExists = false;
  try {
    await access(dest, fsConstants.F_OK);
    fileExists = true;
  } catch {}

  t.true(fileExists);
});
