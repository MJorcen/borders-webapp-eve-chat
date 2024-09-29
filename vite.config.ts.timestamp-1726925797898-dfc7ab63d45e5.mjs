// vite.config.ts
import { defineConfig, loadEnv } from "file:///E:/projecVtouch/chat1v1-h5/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/projecVtouch/chat1v1-h5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import tailwindcss from "file:///E:/projecVtouch/chat1v1-h5/node_modules/tailwindcss/lib/index.js";
import { createHtmlPlugin } from "file:///E:/projecVtouch/chat1v1-h5/node_modules/vite-plugin-html/dist/index.mjs";
import VueSetupExtend from "file:///E:/projecVtouch/chat1v1-h5/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import pxtorem from "file:///E:/projecVtouch/chat1v1-h5/node_modules/postcss-pxtorem/index.js";
import fs from "fs";
import { VitePWA } from "file:///E:/projecVtouch/chat1v1-h5/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "E:\\projecVtouch\\chat1v1-h5";
var getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};
var vite_config_default = defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue(),
      VueSetupExtend(),
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
          globPatterns: ["**/*.{ts,js,css,html,png,jpg,svg}"]
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
        },
        devOptions: {
          enabled: true
        }
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
      // // 生成https方便本地调试，需要配置本地证书
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
          target: "http://devres.sqqy188.com",
          // 后端API的实际地址
          changeOrigin: true,
          // 是否改变源，开启后会对主机头进行修改， 默认false
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
          }
        }
        // input: 'index.html'
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9qZWNWdG91Y2hcXFxcY2hhdDF2MS1oNVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxccHJvamVjVnRvdWNoXFxcXGNoYXQxdjEtaDVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Byb2plY1Z0b3VjaC9jaGF0MXYxLWg1L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwidGFpbHdpbmRjc3NcIjtcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XHJcbmltcG9ydCBWdWVTZXR1cEV4dGVuZCBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZFwiO1xyXG5pbXBvcnQgcHh0b3JlbSBmcm9tIFwicG9zdGNzcy1weHRvcmVtXCI7XHJcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuXHJcbi8vXHU4RkQ5XHU0RTJBXHU5MTREXHU3RjZFIFx1NEUzQVx1NEU4Nlx1NTcyOGh0bWxcdTRFMkRcdTRGN0ZcdTc1MjggXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHJcbmNvbnN0IGdldFZpdGVFbnYgPSAobW9kZSwgdGFyZ2V0KSA9PiB7XHJcbiAgcmV0dXJuIGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlbdGFyZ2V0XTtcclxufTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICB2dWUoKSxcclxuICAgICAgVnVlU2V0dXBFeHRlbmQoKSxcclxuICAgICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIC8vXHU1QzA2XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGIFZJVEVfQVBQX1RJVExFIFx1OEQ0Qlx1NTAzQ1x1N0VEOSB0aXRsZSBcdTY1QjlcdTRGQkYgaHRtbFx1OTg3NVx1OTc2Mlx1NEY3Rlx1NzUyOCB0aXRsZSBcdTgzQjdcdTUzRDZcdTdDRkJcdTdFREZcdTY4MDdcdTk4OThcclxuICAgICAgICAgICAgdGl0bGU6IGdldFZpdGVFbnYobW9kZSwgXCJWSVRFX0FQUF9USVRMRVwiKSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIFZpdGVQV0Eoe1xyXG4gICAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsIC8vIFx1NTNFRlx1OTAwOVx1RkYxQWF1dG9VcGRhdGUgfCBtYW51YWxcclxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbXHJcbiAgICAgICAgICBcImZhdmljb24uaWNvXCIsXHJcbiAgICAgICAgICBcImFwcGxlLXRvdWNoLWljb24ucG5nXCIsXHJcbiAgICAgICAgICBcIm1hc2tlZC1pY29uLnN2Z1wiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICAgIG5hbWU6IFwiTXkgUFdBIEFwcFwiLFxyXG4gICAgICAgICAgc2hvcnRfbmFtZTogXCJNeUFwcFwiLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiQSBkZXNjcmlwdGlvbiBvZiBteSBQV0EgYXBwLlwiLFxyXG4gICAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogXCIuL3B1YmxpYy92aXRlLnN2Z1wiLFxyXG4gICAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcclxuICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgIC8vICAgc3JjOiBcImFuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXHJcbiAgICAgICAgICAgIC8vICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICAvLyAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd29ya2JveDoge1xyXG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLnt0cyxqcyxjc3MsaHRtbCxwbmcsanBnLHN2Z31cIl0sXHJcbiAgICAgICAgICAvLyBydW50aW1lQ2FjaGluZzogW1xyXG4gICAgICAgICAgLy8gICB7XHJcbiAgICAgICAgICAvLyAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb20vLFxyXG4gICAgICAgICAgLy8gICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIixcclxuICAgICAgICAgIC8vICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAvLyAgICAgICBjYWNoZU5hbWU6IFwiZ29vZ2xlLWZvbnRzLXdlYmZvbnRzXCIsXHJcbiAgICAgICAgICAvLyAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgLy8gICAgICAgICBzdGF0dXNlczogWzAsIDIwMF0sXHJcbiAgICAgICAgICAvLyAgICAgICB9LFxyXG4gICAgICAgICAgLy8gICAgICAgZXhwaXJhdGlvbjoge1xyXG4gICAgICAgICAgLy8gICAgICAgICBtYXhFbnRyaWVzOiAxMCxcclxuICAgICAgICAgIC8vICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzAsIC8vIDMwIERheXNcclxuICAgICAgICAgIC8vICAgICAgIH0sXHJcbiAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgIC8vICAgfSxcclxuICAgICAgICAgIC8vICAgLy8gQWRkIG1vcmUgcnVudGltZSBjYWNoaW5nIHJ1bGVzIGFzIG5lZWRlZFxyXG4gICAgICAgICAgLy8gXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRldk9wdGlvbnM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcG9zdGNzczoge1xyXG4gICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgIHRhaWx3aW5kY3NzLFxyXG4gICAgICAgICAgcHh0b3JlbSh7XHJcbiAgICAgICAgICAgIC8vIHJvb3RWYWx1ZTogNzUsIC8vIFx1OEZEOVx1OTFDQ1x1NTE5OVx1OEJCRVx1OEJBMVx1N0EzRlx1NzY4NFx1NUJCRFx1NUVBNi8xMFx1NTM3M1x1NTNFRlx1RkYwQ1x1NEY4Qlx1NTk4Mlx1OEJCRVx1OEJBMVx1N0EzRlx1NUJCRFx1NUVBNlx1NjYyRjc1MHB4XHU1QzMxXHU1MTk5NzVcclxuICAgICAgICAgICAgLy8gdmFudFx1OUVEOFx1OEJBNFx1NjYyRjM3LjVcdUZGMENcdTU5ODJcdTY3OUNcdTY2MkZcdTRGN0ZcdTc1MjhcdTRFODZ2YW50XHU3Njg0XHU4QkREXHU1M0VGXHU0RUU1XHU1MENGXHU0RTBCXHU5NzYyXHU4RkQ5XHU2ODM3XHU1MTk5XHJcbiAgICAgICAgICAgIHJvb3RWYWx1ZShyZXMpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzLmZpbGUuaW5kZXhPZihcInZhbnRcIikgIT09IC0xID8gMzcuNSA6IDc1O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwcm9wTGlzdDogW1wiKlwiXSwgLy8gXHU5NzAwXHU4OTgxXHU4RjZDXHU2MzYyXHU3Njg0XHU1QzVFXHU2MDI3XHVGRjBDXHU5RUQ4XHU4QkE0XHU4RjZDXHU2MzYyXHU2MjQwXHU2NzA5XHU1QzVFXHU2MDI3XHJcbiAgICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXSwgLy8gQ1NTXHU5MDA5XHU2MkU5XHU1NjY4XHU5RUQxXHU1NDBEXHU1MzU1XHVGRjBDXHU5NjMyXHU2QjYyXHU5MEU4XHU1MjA2XHU5MDA5XHU2MkU5XHU1NjY4XHU4OEFCXHU4RjZDXHU2MzYyXHJcbiAgICAgICAgICAgIGV4Y2x1ZGU6IC9cXC9ub2RlX21vZHVsZXNcXC8vaSwgLy8gXHU1RkZEXHU3NTY1XHU1MzA1XHU2NTg3XHU0RUY2XHU4RjZDXHU2MzYycmVtXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgLy8gLy8gXHU3NTFGXHU2MjEwaHR0cHNcdTY1QjlcdTRGQkZcdTY3MkNcdTU3MzBcdThDMDNcdThCRDVcdUZGMENcdTk3MDBcdTg5ODFcdTkxNERcdTdGNkVcdTY3MkNcdTU3MzBcdThCQzFcdTRFNjZcclxuICAgICAgaHR0cHM6IHtcclxuICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhcIi4vbG9jYWxob3N0LWtleS5wZW1cIiksXHJcbiAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKFwiLi9sb2NhbGhvc3QucGVtXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2hueWJnei5hc3VzY29tbS5jb206NjY4OC9kdW9tZS9hcGkvdjFcIiwgLy8gXHU1NDBFXHU3QUVGQVBJXHU3Njg0XHU1QjlFXHU5NjQ1XHU1NzMwXHU1NzQwXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NjUzOVx1NTNEOFx1NkU5MFx1RkYwQ1x1NUYwMFx1NTQyRlx1NTQwRVx1NEYxQVx1NUJGOVx1NEUzQlx1NjczQVx1NTkzNFx1OEZEQlx1ODg0Q1x1NEZFRVx1NjUzOVx1RkYwQyBcdTlFRDhcdThCQTRmYWxzZVxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLCAvLyBcdTkxQ0RcdTUxOTlcdThERUZcdTVGODRcdUZGMENcdTUzQkJcdTk2NjRcdThCRjdcdTZDNDJcdTUyNERcdTdGMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiL3FxcVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2RldnJlcy5zcXF5MTg4LmNvbVwiLCAvLyBcdTU0MEVcdTdBRUZBUElcdTc2ODRcdTVCOUVcdTk2NDVcdTU3MzBcdTU3NDBcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU2NTM5XHU1M0Q4XHU2RTkwXHVGRjBDXHU1RjAwXHU1NDJGXHU1NDBFXHU0RjFBXHU1QkY5XHU0RTNCXHU2NzNBXHU1OTM0XHU4RkRCXHU4ODRDXHU0RkVFXHU2NTM5XHVGRjBDIFx1OUVEOFx1OEJBNGZhbHNlXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvcXFxLywgXCJcIiksIC8vIFx1OTFDRFx1NTE5OVx1OERFRlx1NUY4NFx1RkYwQ1x1NTNCQlx1OTY2NFx1OEJGN1x1NkM0Mlx1NTI0RFx1N0YwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGhtcjogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAvLyBzb3VyY2VtYXA6IGlzRGV2RW52KG1vZGUpLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3MoaWQ6IGFueSkge1xyXG4gICAgICAgICAgICAvLyBcdTUyMURcdTU5Q0JcdTUzMTZ0YWlsd2luZGNzc1x1NjU4N1x1NEVGNlx1RkYwQ1x1NjUzRVx1NTE2NVx1ODFGM21haW4udHNcdTRFMkRcdThERUZcdTVGODRcdTRFMDBcdTgxRjRcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwic3JjL2luZGV4LmNzc1wiKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBcInRhaWx3aW5kY3NzXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBpbnB1dDogJ2luZGV4Lmh0bWwnXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsY0FBYyxlQUFlO0FBQzVTLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sUUFBUTtBQUNmLFNBQVMsZUFBZTtBQVJ4QixJQUFNLG1DQUFtQztBQVd6QyxJQUFNLGFBQWEsQ0FBQyxNQUFNLFdBQVc7QUFDbkMsU0FBTyxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNO0FBQzVDO0FBR0EsSUFBTyxzQkFBUSxhQUFhLENB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
