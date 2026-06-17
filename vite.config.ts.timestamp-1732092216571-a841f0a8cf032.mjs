// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import tailwindcss from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/tailwindcss/lib/index.js";
import { createHtmlPlugin } from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/vite-plugin-html/dist/index.mjs";
import VueSetupExtend from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import pxtorem from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/postcss-pxtorem/index.js";
import fs from "fs";
import { VitePWA } from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/vite-plugin-pwa/dist/index.js";
import viteCompression from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/apple/\u8FB9\u754CProject/chat1v1-h5";
var getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};
var vite_config_default = defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue(),
      VueSetupExtend(),
      viteCompression({
        threshold: 1024e3
        // 对大于 1mb 的文件进行压缩
      }),
      createHtmlPlugin({
        inject: {
          data: {
            //将环境变量 VITE_APP_TITLE 赋值给 title 方便 html页面使用 title 获取系统标题
            title: getViteEnv(mode, "VITE_APP_TITLE")
          }
        }
      }),
      VitePWA({
        registerType: "autoUpdate",
        // 可选：autoUpdate | manual
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg"
        ],
        manifest: {
          name: "My PWA App",
          short_name: "MyApp",
          description: "A description of my PWA app.",
          theme_color: "#ffffff",
          icons: [
            {
              src: "./public/vite.svg",
              sizes: "192x192",
              type: "image/png"
            }
            // {
            //   src: "android-chrome-512x512.png",
            //   sizes: "512x512",
            //   type: "image/png",
            // },
          ]
        },
        workbox: {
          globPatterns: ["**/*.{ts,js,css,html,png,jpg,svg,webp,gif}"]
          // runtimeCaching: [
          //   {
          //     urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          //     handler: "StaleWhileRevalidate",
          //     options: {
          //       cacheName: "google-fonts-webfonts",
          //       cacheableResponse: {
          //         statuses: [0, 200],
          //       },
          //       expiration: {
          //         maxEntries: 10,
          //         maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
          //       },
          //     },
          //   },
          //   // Add more runtime caching rules as needed
          // ],
        }
        // devOptions: {
        //   enabled: true,
        // },
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
      }
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          pxtorem({
            // rootValue: 75, // 这里写设计稿的宽度/10即可，例如设计稿宽度是750px就写75
            // vant默认是37.5，如果是使用了vant的话可以像下面这样写
            rootValue(res) {
              return res.file.indexOf("vant") !== -1 ? 37.5 : 75;
            },
            propList: ["*"],
            // 需要转换的属性，默认转换所有属性
            selectorBlackList: [],
            // CSS选择器黑名单，防止部分选择器被转换
            exclude: /\/node_modules\//i
            // 忽略包文件转换rem
          })
        ]
      }
    },
    server: {
      port: 3e3,
      // 生成https方便本地调试，需要配置本地证书
      https: {
        key: fs.readFileSync("./localhost-key.pem"),
        cert: fs.readFileSync("./localhost.pem")
      },
      proxy: {
        "/api": {
          target: "http://hnybgz.asuscomm.com:6688/duome/api/v1",
          // 后端API的实际地址
          changeOrigin: true,
          // 是否改变源，开启后会对主机头进行修改， 默认false
          rewrite: (path2) => path2.replace(/^\/api/, "")
          // 重写路径，去除请求前缀
        },
        "/qqq": {
          target: "https://maps.googleapis.com/maps/api",
          // 后端API的实际地址
          changeOrigin: true,
          // 是否改变源，开启后会对主机头进行修改， 默认false
          secure: true,
          // 禁用 SSL 证书验证
          rewrite: (path2) => path2.replace(/^\/qqq/, "")
          // 重写路径，去除请求前缀
        }
      },
      hmr: true
    },
    build: {
      // sourcemap: isDevEnv(mode),
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("src/index.css")) {
              return "tailwindcss";
            }
            if (id.includes("node_modules")) {
              return "vendor";
            }
          }
        }
        // input: 'index.html'
      }
    },
    base: "./"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXBwbGUvXHU4RkI5XHU3NTRDUHJvamVjdC9jaGF0MXYxLWg1XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXBwbGUvXHU4RkI5XHU3NTRDUHJvamVjdC9jaGF0MXYxLWg1L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hcHBsZS8lRTglQkUlQjklRTclOTUlOENQcm9qZWN0L2NoYXQxdjEtaDUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmRcIjtcbmltcG9ydCBweHRvcmVtIGZyb20gXCJwb3N0Y3NzLXB4dG9yZW1cIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiO1xuXG4vL1x1OEZEOVx1NEUyQVx1OTE0RFx1N0Y2RSBcdTRFM0FcdTRFODZcdTU3MjhodG1sXHU0RTJEXHU0RjdGXHU3NTI4IFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuY29uc3QgZ2V0Vml0ZUVudiA9IChtb2RlLCB0YXJnZXQpID0+IHtcbiAgcmV0dXJuIGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlbdGFyZ2V0XTtcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICBWdWVTZXR1cEV4dGVuZCgpLFxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MDAwLCAvLyBcdTVCRjlcdTU5MjdcdTRFOEUgMW1iIFx1NzY4NFx1NjU4N1x1NEVGNlx1OEZEQlx1ODg0Q1x1NTM4Qlx1N0YyOVxuICAgICAgfSksXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLy9cdTVDMDZcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0YgVklURV9BUFBfVElUTEUgXHU4RDRCXHU1MDNDXHU3RUQ5IHRpdGxlIFx1NjVCOVx1NEZCRiBodG1sXHU5ODc1XHU5NzYyXHU0RjdGXHU3NTI4IHRpdGxlIFx1ODNCN1x1NTNENlx1N0NGQlx1N0VERlx1NjgwN1x1OTg5OFxuICAgICAgICAgICAgdGl0bGU6IGdldFZpdGVFbnYobW9kZSwgXCJWSVRFX0FQUF9USVRMRVwiKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBWaXRlUFdBKHtcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIiwgLy8gXHU1M0VGXHU5MDA5XHVGRjFBYXV0b1VwZGF0ZSB8IG1hbnVhbFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbXG4gICAgICAgICAgXCJmYXZpY29uLmljb1wiLFxuICAgICAgICAgIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIixcbiAgICAgICAgICBcIm1hc2tlZC1pY29uLnN2Z1wiLFxuICAgICAgICBdLFxuICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgIG5hbWU6IFwiTXkgUFdBIEFwcFwiLFxuICAgICAgICAgIHNob3J0X25hbWU6IFwiTXlBcHBcIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBIGRlc2NyaXB0aW9uIG9mIG15IFBXQSBhcHAuXCIsXG4gICAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogXCIuL3B1YmxpYy92aXRlLnN2Z1wiLFxuICAgICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICBzcmM6IFwiYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICAgICAgICAgIC8vICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgLy8gICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB3b3JrYm94OiB7XG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLnt0cyxqcyxjc3MsaHRtbCxwbmcsanBnLHN2Zyx3ZWJwLGdpZn1cIl0sXG4gICAgICAgICAgLy8gcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICAvLyAgIHtcbiAgICAgICAgICAvLyAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb20vLFxuICAgICAgICAgIC8vICAgICBoYW5kbGVyOiBcIlN0YWxlV2hpbGVSZXZhbGlkYXRlXCIsXG4gICAgICAgICAgLy8gICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAvLyAgICAgICBjYWNoZU5hbWU6IFwiZ29vZ2xlLWZvbnRzLXdlYmZvbnRzXCIsXG4gICAgICAgICAgLy8gICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAvLyAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAvLyAgICAgICB9LFxuICAgICAgICAgIC8vICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAvLyAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgIC8vICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzAsIC8vIDMwIERheXNcbiAgICAgICAgICAvLyAgICAgICB9LFxuICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAvLyAgIC8vIEFkZCBtb3JlIHJ1bnRpbWUgY2FjaGluZyBydWxlcyBhcyBuZWVkZWRcbiAgICAgICAgICAvLyBdLFxuICAgICAgICB9LFxuICAgICAgICAvLyBkZXZPcHRpb25zOiB7XG4gICAgICAgIC8vICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgLy8gfSxcbiAgICAgIH0pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgdGFpbHdpbmRjc3MsXG4gICAgICAgICAgcHh0b3JlbSh7XG4gICAgICAgICAgICAvLyByb290VmFsdWU6IDc1LCAvLyBcdThGRDlcdTkxQ0NcdTUxOTlcdThCQkVcdThCQTFcdTdBM0ZcdTc2ODRcdTVCQkRcdTVFQTYvMTBcdTUzNzNcdTUzRUZcdUZGMENcdTRGOEJcdTU5ODJcdThCQkVcdThCQTFcdTdBM0ZcdTVCQkRcdTVFQTZcdTY2MkY3NTBweFx1NUMzMVx1NTE5OTc1XG4gICAgICAgICAgICAvLyB2YW50XHU5RUQ4XHU4QkE0XHU2NjJGMzcuNVx1RkYwQ1x1NTk4Mlx1Njc5Q1x1NjYyRlx1NEY3Rlx1NzUyOFx1NEU4NnZhbnRcdTc2ODRcdThCRERcdTUzRUZcdTRFRTVcdTUwQ0ZcdTRFMEJcdTk3NjJcdThGRDlcdTY4MzdcdTUxOTlcbiAgICAgICAgICAgIHJvb3RWYWx1ZShyZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5maWxlLmluZGV4T2YoXCJ2YW50XCIpICE9PSAtMSA/IDM3LjUgOiA3NTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9wTGlzdDogW1wiKlwiXSwgLy8gXHU5NzAwXHU4OTgxXHU4RjZDXHU2MzYyXHU3Njg0XHU1QzVFXHU2MDI3XHVGRjBDXHU5RUQ4XHU4QkE0XHU4RjZDXHU2MzYyXHU2MjQwXHU2NzA5XHU1QzVFXHU2MDI3XG4gICAgICAgICAgICBzZWxlY3RvckJsYWNrTGlzdDogW10sIC8vIENTU1x1OTAwOVx1NjJFOVx1NTY2OFx1OUVEMVx1NTQwRFx1NTM1NVx1RkYwQ1x1OTYzMlx1NkI2Mlx1OTBFOFx1NTIwNlx1OTAwOVx1NjJFOVx1NTY2OFx1ODhBQlx1OEY2Q1x1NjM2MlxuICAgICAgICAgICAgZXhjbHVkZTogL1xcL25vZGVfbW9kdWxlc1xcLy9pLCAvLyBcdTVGRkRcdTc1NjVcdTUzMDVcdTY1ODdcdTRFRjZcdThGNkNcdTYzNjJyZW1cbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMzAwMCxcbiAgICAgIC8vIFx1NzUxRlx1NjIxMGh0dHBzXHU2NUI5XHU0RkJGXHU2NzJDXHU1NzMwXHU4QzAzXHU4QkQ1XHVGRjBDXHU5NzAwXHU4OTgxXHU5MTREXHU3RjZFXHU2NzJDXHU1NzMwXHU4QkMxXHU0RTY2XG4gICAgICBodHRwczoge1xuICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhcIi4vbG9jYWxob3N0LWtleS5wZW1cIiksXG4gICAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhcIi4vbG9jYWxob3N0LnBlbVwiKSxcbiAgICAgIH0sXG4gICAgICBwcm94eToge1xuICAgICAgICBcIi9hcGlcIjoge1xuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vaG55Ymd6LmFzdXNjb21tLmNvbTo2Njg4L2R1b21lL2FwaS92MVwiLCAvLyBcdTU0MEVcdTdBRUZBUElcdTc2ODRcdTVCOUVcdTk2NDVcdTU3MzBcdTU3NDBcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NjUzOVx1NTNEOFx1NkU5MFx1RkYwQ1x1NUYwMFx1NTQyRlx1NTQwRVx1NEYxQVx1NUJGOVx1NEUzQlx1NjczQVx1NTkzNFx1OEZEQlx1ODg0Q1x1NEZFRVx1NjUzOVx1RkYwQyBcdTlFRDhcdThCQTRmYWxzZVxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSwgLy8gXHU5MUNEXHU1MTk5XHU4REVGXHU1Rjg0XHVGRjBDXHU1M0JCXHU5NjY0XHU4QkY3XHU2QzQyXHU1MjREXHU3RjAwXG4gICAgICAgIH0sXG4gICAgICAgIFwiL3FxcVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaVwiLCAvLyBcdTU0MEVcdTdBRUZBUElcdTc2ODRcdTVCOUVcdTk2NDVcdTU3MzBcdTU3NDBcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NjUzOVx1NTNEOFx1NkU5MFx1RkYwQ1x1NUYwMFx1NTQyRlx1NTQwRVx1NEYxQVx1NUJGOVx1NEUzQlx1NjczQVx1NTkzNFx1OEZEQlx1ODg0Q1x1NEZFRVx1NjUzOVx1RkYwQyBcdTlFRDhcdThCQTRmYWxzZVxuICAgICAgICAgIHNlY3VyZTogdHJ1ZSwgLy8gXHU3OTgxXHU3NTI4IFNTTCBcdThCQzFcdTRFNjZcdTlBOENcdThCQzFcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvcXFxLywgXCJcIiksIC8vIFx1OTFDRFx1NTE5OVx1OERFRlx1NUY4NFx1RkYwQ1x1NTNCQlx1OTY2NFx1OEJGN1x1NkM0Mlx1NTI0RFx1N0YwMFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGhtcjogdHJ1ZSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAvLyBzb3VyY2VtYXA6IGlzRGV2RW52KG1vZGUpLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3MoaWQ6IGFueSkge1xuICAgICAgICAgICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2dGFpbHdpbmRjc3NcdTY1ODdcdTRFRjZcdUZGMENcdTY1M0VcdTUxNjVcdTgxRjNtYWluLnRzXHU0RTJEXHU4REVGXHU1Rjg0XHU0RTAwXHU4MUY0XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJzcmMvaW5kZXguY3NzXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcInRhaWx3aW5kY3NzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwidmVuZG9yXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gaW5wdXQ6ICdpbmRleC5odG1sJ1xuICAgICAgfSxcbiAgICB9LFxuICAgIGJhc2U6IFwiLi9cIixcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUyxTQUFTLGNBQWMsZUFBZTtBQUMzVSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVMsd0JBQXdCO0FBQ2pDLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFFBQVE7QUFDZixTQUFTLGVBQWU7QUFDeEIsT0FBTyxxQkFBcUI7QUFUNUIsSUFBTSxtQ0FBbUM7QUFZekMsSUFBTSxhQUFhLENBQUMsTUFBTSxXQUFXO0FBQ25DLFNBQU8sUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTTtBQUM1QztBQUdBLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDakQsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osZUFBZTtBQUFBLE1BQ2YsZ0JBQWdCO0FBQUEsUUFDZCxXQUFXO0FBQUE7QUFBQSxNQUNiLENBQUM7QUFBQSxNQUNELGlCQUFpQjtBQUFBLFFBQ2YsUUFBUTtBQUFBLFVBQ04sTUFBTTtBQUFBO0FBQUEsWUFFSixPQUFPLFdBQVcsTUFBTSxnQkFBZ0I7QUFBQSxVQUMxQztBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQTtBQUFBLFFBQ2QsZUFBZTtBQUFBLFVBQ2I7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUNSLE1BQU07QUFBQSxVQUNOLFlBQVk7QUFBQSxVQUNaLGFBQWE7QUFBQSxVQUNiLGFBQWE7QUFBQSxVQUNiLE9BQU87QUFBQSxZQUNMO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsWUFDUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQU1GO0FBQUEsUUFDRjtBQUFBLFFBQ0EsU0FBUztBQUFBLFVBQ1AsY0FBYyxDQUFDLDRDQUE0QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQWtCN0Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUlGLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0EsUUFBUTtBQUFBO0FBQUE7QUFBQSxZQUdOLFVBQVUsS0FBSztBQUNiLHFCQUFPLElBQUksS0FBSyxRQUFRLE1BQU0sTUFBTSxLQUFLLE9BQU87QUFBQSxZQUNsRDtBQUFBLFlBQ0EsVUFBVSxDQUFDLEdBQUc7QUFBQTtBQUFBLFlBQ2QsbUJBQW1CLENBQUM7QUFBQTtBQUFBLFlBQ3BCLFNBQVM7QUFBQTtBQUFBLFVBQ1gsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFFTixPQUFPO0FBQUEsUUFDTCxLQUFLLEdBQUcsYUFBYSxxQkFBcUI7QUFBQSxRQUMxQyxNQUFNLEdBQUcsYUFBYSxpQkFBaUI7QUFBQSxNQUN6QztBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBO0FBQUEsVUFDUixjQUFjO0FBQUE7QUFBQSxVQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBO0FBQUEsUUFDOUM7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsVUFDZCxRQUFRO0FBQUE7QUFBQSxVQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsSUFDUDtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsTUFFTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixhQUFhLElBQVM7QUFFcEIsZ0JBQUksR0FBRyxTQUFTLGVBQWUsR0FBRztBQUNoQyxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUE7QUFBQSxNQUVGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
