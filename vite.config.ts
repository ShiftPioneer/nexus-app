import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['lovable-uploads/nexus-logo-orange.png', 'robots.txt'],
      manifest: {
        name: 'NEXUS - Life Operating System',
        short_name: 'NEXUS',
        description: 'The all-in-one Productivity and Personal Growth Platform',
        theme_color: '#FF6500',
        background_color: '#0B192C',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/lovable-uploads/nexus-logo-orange.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/nexus-logo-orange.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['productivity', 'lifestyle', 'utilities'],
        screenshots: [],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Go to your command center',
            url: '/',
            icons: [{ src: '/lovable-uploads/nexus-logo-orange.png', sizes: '192x192' }]
          },
          {
            name: 'Habits',
            short_name: 'Habits',
            description: 'Track your habits',
            url: '/habits',
            icons: [{ src: '/lovable-uploads/nexus-logo-orange.png', sizes: '192x192' }]
          },
          {
            name: 'Journal',
            short_name: 'Journal',
            description: 'Write in your journal',
            url: '/journal',
            icons: [{ src: '/lovable-uploads/nexus-logo-orange.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
