import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "tailwindcss";
import { createHtmlPlugin } from "vite-plugin-html";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import pxtorem from "postcss-pxtorem";
import fs from "fs";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

//这个配置 为了在html中使用 环境变量
const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue(),
      VueSetupExtend(),
      viteCompression({
        threshold: 1024000, // 对大于 1mb 的文件进行压缩
      }),
      createHtmlPlugin({
        inject: {
          data: {
            //将环境变量 VITE_APP_TITLE 赋值给 title 方便 html页面使用 title 获取系统标题
            title: getViteEnv(mode, "VITE_APP_TITLE"),
          },
        },
      }),
      VitePWA({
        registerType: "autoUpdate", // 可选：autoUpdate | manual
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg",
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
              type: "image/png",
            },
            // {
            //   src: "android-chrome-512x512.png",
            //   sizes: "512x512",
            //   type: "image/png",
            // },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{ts,js,css,html,png,jpg,svg}"],
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
        // devOptions: {
        //   enabled: true,
        // },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
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
            propList: ["*"], // 需要转换的属性，默认转换所有属性
            selectorBlackList: [], // CSS选择器黑名单，防止部分选择器被转换
            exclude: /\/node_modules\//i, // 忽略包文件转换rem
          }),
        ],
      },
    },

    server: {
      port: 3000,
      // 生成https方便本地调试，需要配置本地证书
      https: {
        key: fs.readFileSync("./localhost-key.pem"),
        cert: fs.readFileSync("./localhost.pem"),
      },
      proxy: {
        "/api": {
          target: "http://hnybgz.asuscomm.com:6688/duome/api/v1", // 后端API的实际地址
          changeOrigin: true, // 是否改变源，开启后会对主机头进行修改， 默认false
          rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径，去除请求前缀
        },
        "/qqq": {
          target: "https://maps.googleapis.com/maps/api", // 后端API的实际地址
          changeOrigin: true, // 是否改变源，开启后会对主机头进行修改， 默认false
          secure: true, // 禁用 SSL 证书验证
          rewrite: (path) => path.replace(/^\/qqq/, ""), // 重写路径，去除请求前缀
        },
        "/www": {
          target: "http://hnybgz.asuscomm.com:6688/gateway/mapping/cloud/v1", // 后端API的实际地址
          changeOrigin: true, // 是否改变源，开启后会对主机头进行修改， 默认false
          rewrite: (path) => path.replace(/^\/www/, ""), // 重写路径，去除请求前缀
          // rewrite: (path) => path.replace(new RegExp(`^${baseApiOther}`), ""), // Rewrite the path dynamically
        },
      },
      hmr: true,
    },
    build: {
      // sourcemap: isDevEnv(mode),
      rollupOptions: {
        output: {
          manualChunks(id: any) {
            // 初始化tailwindcss文件，放入至main.ts中路径一致
            if (id.includes("src/index.css")) {
              return "tailwindcss";
            }
            // if (id.includes("node_modules")) {
            //   return "vendor";
            // }
          },
        },
        // input: 'index.html'
      },
    },
    base: "./",
  };
});
