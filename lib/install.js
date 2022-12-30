import fs from 'node:fs';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import binBuild from 'bin-build';
import bin from './index.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));

bin.run(['--version']).then(() => {
	console.log('avifenc pre-build test passed successfully');
}).catch(error => {
	console.warn(error.message);
	console.warn('avifenc pre-build test failed');

	// TODO: make binary building
	// console.info('compiling from source');

	// try {
	// 	const source = fileURLToPath(new URL(`../vendor/source/libavif-${pkg.libavif_version}.tar.gz`, import.meta.url));

	// 	binBuild.file(source, [
	// 		`./configure --disable-shared --prefix="${bin.dest()}" --bindir="${bin.dest()}"`,
	// 		'make && make install',
	// 	]);

	// 	console.log('avifenc built successfully');
	// } catch (error) {
	// 	console.error(error.stack);

	// 	// eslint-disable-next-line unicorn/no-process-exit
	// 	process.exit(1);
	// }
});
