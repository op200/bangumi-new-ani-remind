import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.tsx',
            userscript: {
                name: "Bangumi 新番提醒",
                namespace: 'https://github.com/op200/bangumi-new-ani-remind',
                match: [
                    '*://bgm.tv/',
                    '*://bangumi.tv/',
                    '*://chii.in/',
                ],
                grant: "none",
                "run-at": 'document-end',
            },
        })
    ],
    build: {
        target: 'es2024',
        outDir: 'dist',
        emptyOutDir: true,
        minify: process.env.NODE_ENV === 'production' ? 'terser' : 'esbuild',
    },
    esbuild: {
        jsx: 'automatic', // JSX 运行时
    }
});