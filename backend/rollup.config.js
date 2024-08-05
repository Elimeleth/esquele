import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
export default {
    input: ['src/index.ts'],
    output: [
        {
            dir: 'dist',
            entryFileNames: '[name].js',
            format: 'esm',
            exports: 'named',
        },
    ],
    onwarn: (warning) => {
        if (warning.code === 'UNRESOLVED_IMPORT') return
    },
    plugins: [
        commonjs(),
        typescript(),
    ],
}
