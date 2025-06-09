import {readFileSync} from 'node:fs';
import {symlink, mkdir} from 'node:fs/promises';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import binBuild from '@localnerve/bin-build';
import bin from './index.js';
import binVersionCheck from 'bin-version-check';
import which from 'which';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const install = async () => {
  try {
    await bin.run(['--version']);
    console.log('avifenc pre-build test passed successfully');
  } catch (error) {
    console.warn(error.message);
    console.warn('avifenc pre-build test failed');
    console.info('compiling from source');

    try {
      await binBuild.url(`https://github.com/AOMediaCodec/libavif/archive/refs/tags/v${pkg.libavif_version}.tar.gz`, [
        `./configure --disable-shared --prefix="${bin.dest()}" --bindir="${bin.dest()}"`,
        'make && make install',
      ]);
      console.log('avifenc built successfully');
    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  }
};

(async () => {
  try {
    const use = process.platform === 'win32' ? 'avifenc.exe' : 'avifenc';
    const systemBin = await which(use).catch(error => {
      throw error;
    });
    const version = '>=' + pkg.libavif_version;
    await binVersionCheck(systemBin, version, {args: ['-version']}).catch(error => {
      console.warn(`The \`${systemBin}\` binary doesn't seem to work correctly or doesn't satisfy version \`${version}\``);
      throw error;
    });
    const vendor = path.join(__dirname, '../vendor');
    await mkdir(vendor).catch(error => {
      if (error.code === 'EEXIST') {
        return;
      }

      console.warn(error.message);
      throw error;
    });
    const target = path.join(vendor, use);
    await symlink(systemBin, target).catch(error => {
      if (error.code === 'EEXIST') {
        return;
      }

      console.warn(error.message);
      throw error;
    });
    console.log(`create avifenc symlink \`${target}\``);
  } catch {
    await install().catch(() => {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    });
  }
})();
