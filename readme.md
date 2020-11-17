# avifenc-bin

> This is a **unofficial** bin wrapper for the AVIF encoder from [AOMedia's libavif](https://github.com/AOMediaCodec/libavif) for use with [`imagemin`](https://github.com/imagemin/imagemin) and the [unofficial `imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc)

You probably want the [unofficial `imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc) instead.

***Note: This is for Windows only (for now).***


## Install

```
$ npm install --save git+https://github.com/vHeemstra/avifenc-bin.git
```


## Usage

```js
const {execFile} = require('child_process');
const avifenc = require('avifenc-bin');

execFile(avifenc, ['--output', 'output.avif', 'input.jpg'], error => {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global git+https://github.com/vHeemstra/avifenc-bin.git
```

```
$ avifenc --help
```


## License

MIT © [Imagemin](https://github.com/imagemin)<br>
[libavif](https://github.com/AOMediaCodec/libavif) © 2019 Joe Drago (Released under the BSD License.)<br>
This package is made by [Philip van Heemstra](https://github.com/vHeemstra)<br>
Based on [jpegtran-bin](https://github.com/imagemin/jpegtran-bin) by [Sindre Sorhus](https://github.com/sindresorhus)
