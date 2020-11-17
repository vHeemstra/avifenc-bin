'use strict';
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

const args = [
	// TODO? other options
	path.join(__dirname, '../test/fixtures/test.jpg'),
	'--output',
	path.join(__dirname, '../test/fixtures/test.avif')
];

bin.run(args).then(() => {
	log.success('avifenc pre-build test passed successfully');
}).catch(async error => {
	log.warn(error.message);
	log.warn('avifenc pre-build test failed');
	// TODO: make binary building
	// log.info('compiling from source');

	// const cfg = [
	// 	'./configure --disable-shared',
	// 	`--prefix="${bin.dest()}" --bindir="${bin.dest()}"`
	// ].join(' ');

	// try {
	// 	await binBuild.file(path.resolve(__dirname, '../vendor/source/libjpeg-turbo-1.5.1.tar.gz'), [
	// 		'touch configure.ac aclocal.m4 configure Makefile.am Makefile.in',
	// 		cfg,
	// 		'make install'
	// 	]);

	// 	log.success('avifenc built successfully');
	// } catch (error) {
	// 	log.error(error.stack);

	// 	// eslint-disable-next-line unicorn/no-process-exit
	// 	process.exit(1);
	// }
});
