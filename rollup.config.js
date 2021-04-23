import { terser } from 'rollup-plugin-terser'
import devServer from 'rollup-plugin-dev'
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'

const development = process.env.ENV === 'dev'
const production = !development

export default {
  input: 'renderer/main.ts',
  watch: {
    exclude: 'node_modules/**'
  },
  plugins: [
    typescript(),
    postcss({
      extract: 'bundle.css',
      minimize: production
    }),
    development && devServer(),
    production && terser()
  ],
  output: [
    {
      file: 'dist/bundle.js',
      compact: production,
      format: 'iife'
    }
  ]
}
