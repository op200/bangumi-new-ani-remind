import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.tsx',
            userscript: {
                name: 'bangumi-new-ani-remind',
                namespace: 'https://github.com/op200/bangumi-new-ani-remind',
                version: '1.0.0',
                description: '',
                author: 'op200',
                license: 'Copyright op200',
                match: ['https://bgm.tv/*', 'https://bangumi.tv/*', 'https://chii.in/*'],
                "run-at": 'document-end',
            },
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'terser',
    },
    esbuild: {
        jsx: 'automatic', // JSX 运行时
    }
});