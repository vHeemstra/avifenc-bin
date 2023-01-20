import fs from 'node:fs';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import BinWrapper from 'bin-wrapper';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));

// TODO: set-up releases structure
// const url = `https://raw.githubusercontent.com/vheemstra/avifenc-bin/v${pkg.version}/vendor/`;
const url = `https://raw.githubusercontent.com/vheemstra/avifenc-bin/master/vendor/`;

// TODO: auto get latest avifenc.exe from:
// https://github.com/AOMediaCodec/libavif/releases/download/v${pkg.libavif_version}/avifenc.exe
// https://github.com/AOMediaCodec/libavif/archive/refs/tags/v${pkg.libavif_version}.tar.gz

const binWrapper = new BinWrapper()
	// TODO? binaries for older OSs
	// .src(`${url}macos/x86/avifenc`, 'darwin', 'x86')
	// .src(`${url}linux/x86/avifenc`, 'linux', 'x86')
	// .src(`${url}win/x86/avifenc.exe`, 'win32', 'x86')
	.src(`${url}macos/x64/avifenc`, 'darwin', 'x64')
	.src(`${url}linux/x64/avifenc`, 'linux', 'x64')
	.src(`${url}win/x64/avifenc.exe`, 'win32', 'x64')
	.dest(fileURLToPath(new URL('../vendor', import.meta.url)))
	.use(process.platform === 'win32' ? 'avifenc.exe' : 'avifenc');

export default binWrapper;
