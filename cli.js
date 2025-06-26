#!/usr/bin/env node
import process from "node:process";
import { spawn } from "node:child_process";
import getBinaryPathOrCommand from "./lib/index.js";

spawn(getBinaryPathOrCommand(false), process.argv.slice(2), {
  stdio: "inherit",
}).on("exit", process.exit);
