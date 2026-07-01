import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['icon-192x192.png', 'icon-512x512.png', 'apple-touch-icon.png'],
            manifest: {
                name: 'Sanket\'s Green Kitchen',
                short_name: 'Sanket\'s Green',
                description: 'Order delicious vegetarian food from Sanket\'s Green Kitchen',
                theme_color: '#2ecc71',
                background_color: '#1a1a1a',
                display: 'standalone',
                icons: [
                    {
                        src: '/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'unsplash-images',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
})
