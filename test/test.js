import fs from 'node:fs';
import path from 'node:path';
// import process from 'node:process';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execa} from 'execa';
import {temporaryDirectory} from 'tempy';
import binCheck from '@xhmikosr/bin-check';
// import binBuild from '@localnerve/bin-build';
import compareSize from 'compare-size';
import avifenc from '../index.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));

// TODO: make binary building
// test('rebuild the avifenc binaries', async t => {
// 	// Skip the test on Windows
// 	if (process.platform === 'win32') {
// 		t.pass();
// 		return;
// 	}

// 	const temporary = temporaryDirectory();
// 	const source = fileURLToPath(new URL(`../vendor/source/libavif-${pkg.libavif_version}.tar.gz`, import.meta.url));

// 	await binBuild.file(source, [
// 		`./configure --disable-shared --prefix="${temporary}" --bindir="${temporary}"`,
// 		'make && make install',
// 	]);

// 	t.true(fs.existsSync(path.join(temporary, 'avifenc')));
// });

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(avifenc, ['--version']));
});

test('minify and convert a JPG to AVIF', async t => {
	const temporary = temporaryDirectory();
	const src = fileURLToPath(new URL('fixtures/test.jpg', import.meta.url));
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
