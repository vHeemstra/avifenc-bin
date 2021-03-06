'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

// TODO: set-up releases structure
// const url = `https://raw.githubusercontent.com/vheemstra/avifenc-bin/v${pkg.version}/vendor/`;
const url = `https://raw.githubusercontent.com/vheemstra/avifenc-bin/master/vendor/`;

// TODO: auto get latest avifenc.exe from:
// https://github.com/AOMediaCodec/libavif/releases/download/v${pkg.libavif_version}/avifenc.exe

module.exports = new BinWrapper()
	// TODO: binaries for all other OSs
	// .src(`${url}macos/jpegtran`, 'darwin')
	// .src(`${url}linux/x86/jpegtran`, 'linux', 'x86')
	// .src(`${url}linux/x64/jpegtran`, 'linux', 'x64')
	// .src(`${url}freebsd/x86/jpegtran`, 'freebsd', 'x86')
	// .src(`${url}freebsd/x64/jpegtran`, 'freebsd', 'x64')
	// .src(`${url}sunos/x86/jpegtran`, 'sunos', 'x86')
	// .src(`${url}sunos/x64/jpegtran`, 'sunos', 'x64')
	// .src(`${url}win/x86/jpegtran.exe`, 'win32', 'x86')
	// .src(`${url}win/x64/jpegtran.exe`, 'win32', 'x64')
	// .src(`${url}win/x86/libjpeg-62.dll`, 'win32', 'x86')
	// .src(`${url}win/x64/libjpeg-62.dll`, 'win32', 'x64')
	.src(`${url}win/x64/avifenc.exe`, 'win32', 'x64')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'avifenc.exe' : 'avifenc');
