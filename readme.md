# avifenc-bin

> This is a bin wrapper for the AVIF encoder from [AOMedia's libavif](https://github.com/AOMediaCodec/libavif) for use with [`imagemin`](https://github.com/imagemin/imagemin) and the [`imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc) plugin.

You probably want the [`imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc) plugin instead.

***Note: At the moment, only Windows is supported.***

*But if you are more familiar with Cmake and building binaries, feel free to have a look at [AOMedia's libavif](https://github.com/AOMediaCodec/libavif) and send your binaries using pull requests to this repository!*


## Install

```
$ npm install --save @vheemstra/avifenc-bin
```


## Usage

```js
import {execFile} from 'node:child_process';
import avifenc from '@vheemstra/avifenc-bin';

execFile(avifenc, ['--output', 'output.avif', 'input.jpg'], err => {
	if (err) {
		throw err;
	}

	console.log('Image converted!');
});
```


## CLI

```
$ npm install --global @vheemstra/avifenc-bin
```

```
$ avifenc --help
```


## License & Info

MIT © [Imagemin](https://github.com/imagemin)<br>
[libavif](https://github.com/AOMediaCodec/libavif) © 2019 Joe Drago (Released under the BSD License.)<br>
This package is made by [Philip van Heemstra](https://github.com/vHeemstra)<br>
Based on [jpegtran-bin](https://github.com/imagemin/jpegtran-bin) by [Sindre Sorhus](https://github.com/sindresorhus)<br>
<br>
Linux binary from libavif 0.11.1-1 (`vendor/source/libavif-0.11.1-1-x86_64.pkg.tar.zst`):<br>
[https://archlinux.org/packages/community/x86_64/libavif/](https://archlinux.org/packages/community/x86_64/libavif/)<br>
<br>
Info on compiling avifenc for macOS:<br>
[https://www.reddit.com/r/AV1/comments/hdshcc/how_to_compile_avifenc_avifdec_and_avifdump_tools/](https://www.reddit.com/r/AV1/comments/hdshcc/how_to_compile_avifenc_avifdec_and_avifdump_tools/)
