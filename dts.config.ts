import { DtsOptions, RollupOptions } from 'dts-cli';

const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const copy = require('rollup-plugin-copy');

export default {
  rollup(config: RollupOptions, options: DtsOptions) {
    config.plugins?.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta ? 'style.css' : false,
      }),
    );

    config.plugins?.push(
      copy({
        targets: [
          {
            src: 'src/style.scss',
            dest: 'dist',
          },
        ],
      }),
    );

    return config;
  }
}
