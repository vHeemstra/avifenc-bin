'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const binBuild = require('bin-build');
const compareSize = require('compare-size');
const avifenc = require('..');

// TODO: make binary building
// test('rebuild the avifenc binaries', async t => {
// 	const temporary = tempy.directory();
// 	const cfg = [
// 		'./configure --disable-shared',
// 		`--prefix="${temporary}" --bindir="${temporary}"`
// 	].join(' ');

// 	await binBuild.file(path.resolve(__dirname, '../vendor/source/libjpeg-turbo-1.5.1.tar.gz'), [
// 		cfg,
// 		'make install'
// 	]);

// 	t.true(fs.existsSync(path.join(temporary, 'avifenc')));
// });

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(avifenc, ['--version']));
});

test('convert a JPG', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(temporary, 'test.avif');
	const args = [
		'--output',
		dest,
		src
	];

	await execa(avifenc, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] > 0);
	// t.true(result[dest] < result[src]);
});
