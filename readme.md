# avifenc-bin

> This is a bin wrapper for the AVIF encoder from [AOMedia's libavif](https://github.com/AOMediaCodec/libavif) for use with [`imagemin`](https://github.com/imagemin/imagemin) and the [`imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc) plugin.

You probably want the [`imagemin-avifenc`](https://github.com/vheemstra/imagemin-avifenc) plugin instead.

## Install

```shell
npm install --save @vheemstra/avifenc-bin
```


## Use as package

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


## Use as CLI command

```shell
npm install --global @vheemstra/avifenc-bin
```

```shell
avifenc --help
```


## License & Info

MIT © [Imagemin](https://github.com/imagemin)<br>
[libavif](https://github.com/AOMediaCodec/libavif) © 2019 Joe Drago (Released under the BSD License.)<br>
This package is made by [Philip van Heemstra](https://github.com/vHeemstra)<br>
Based on [jpegtran-bin](https://github.com/imagemin/jpegtran-bin) by [Sindre Sorhus](https://github.com/sindresorhus)<br>
<br>
This package uses libavif's official released binaries. Current version: 1.3.0
