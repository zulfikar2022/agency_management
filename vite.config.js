import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';


export default defineConfig({
    plugins: [
        // tailwindcss(),
        // laravel({
        //     input: ['resources/js/app.jsx', 'resources/css/app.css'],
        //     input: 'resources/js/app.jsx', 
        //     refresh: true,
        // }),
        // react(),


          laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            // ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
         react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),

        tailwindcss(),
        // wayfinder({
        //     formVariants: true,
        // }),
    ],
});
