import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'

const dev = process.env.ENV === 'dev'
const prod = !dev

export default {
  input: 'src/main.js',
  watch: prod ? false : {
    exclude: 'node_modules/**'
  },
  plugins: [
    nodeResolve(),
    postcss({
      extract: 'bundle.css',
      minimize: prod
    }),
    prod && terser()
  ],
  output: [
    {
      file: 'dist/bundle.js',
      compact: prod,
      format: 'iife'
    }
  ]
}
