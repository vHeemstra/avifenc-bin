# avifenc-bin

> This is a **unofficial**, **experimental** bin wrapper for the AVIF encoder from [AOMedia](https://github.com/AOMediaCodec/libavif) for use with [`imagemin`](https://github.com/imagemin/imagemin) and the [unofficial `imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc)

You probably want the [unofficial `imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc) instead.


## Install

```
$ npm install --save avifenc-bin
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
$ npm install --global avifenc-bin
```

```
$ avifenc --help
```


## License

MIT © [Imagemin](https://github.com/imagemin)
[libavif](https://github.com/AOMediaCodec/libavif) © 2019 Joe Drago (Released under the BSD License.)
