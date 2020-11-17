#!/usr/bin/env node
'use strict';
const {spawn} = require('child_process');
const avifenc = require('.');

const input = process.argv.slice(2);

spawn(avifenc, input, {stdio: 'inherit'})
	.on('exit', process.exit);
