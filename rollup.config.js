import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss';
import svg from 'rollup-plugin-svg-import';

export default {
  input: 'src/index.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    nodeResolve({browser: true}),
    commonjs(),
    scss({ output: 'style.css', sass: require('sass') }),
    svg({stringify:true})
  ]
};