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
import archiver from "file:///Users/apple/%E8%BE%B9%E7%95%8CProject/chat1v1-h5/node_modules/archiver/index.js";
var __vite_injected_original_dirname = "/Users/apple/\u8FB9\u754CProject/chat1v1-h5";
var getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};
var getOutputDir = (buildCommand) => {
  switch (buildCommand) {
    case "build:vidjoy":
      return "dist-vidjoy";
    case "build:yaya":
      return "dist-yaya";
    case "build:chatJoi":
      return "dist-chatJoi";
    case "build:justVidTest":
      return "dist-justVidTest";
    case "build:vidHub":
      return "dist-vidHub";
    case "build:vidBuzz":
      return "dist-vidBuzz";
    case "build:vidLink":
      return "dist-vidLink";
    case "build:vidChat":
      return "dist-vidChat";
    case "build:SoulChat":
      return "dist-SoulChat";
    case "build:SpicyChat":
      return "dist-SpicyChat";
    case "build:strangers":
      return "dist-strangers";
    case "build:SexyChat":
      return "dist-SexyChat";
    case "build:Hornyhub":
      return "dist-Hornyhub";
    case "build:Sexylivechat":
      return "dist-Sexylivechat";
    case "build:NudeChat":
      return "dist-NudeChat";
    case "build:AdultChat":
      return "dist-AdultChat";
    default:
      return "dist";
  }
};
var compressOutputPlugin = () => {
  const buildCommand = process.env.npm_lifecycle_event;
  return {
    name: "compress-output-plugin",
    closeBundle() {
      const outputDir = getOutputDir(buildCommand);
      const zipFilePath = `${outputDir}.zip`;
      console.log(`\u5F00\u59CB\u538B\u7F29 ${outputDir} \u5230 ${zipFilePath}...`);
      if (!fs.existsSync(outputDir)) {
        console.error(`\u76EE\u5F55 ${outputDir} \u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u538B\u7F29\uFF01`);
        return;
      }
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", () => {
        console.log(
          `${zipFilePath} \u538B\u7F29\u5B8C\u6210\uFF0C\u5927\u5C0F\u4E3A ${archive.pointer()} \u5B57\u8282`
        );
      });
      archive.on("error", (err) => {
        throw err;
      });
      archive.pipe(output);
      archive.glob("**/*", { cwd: outputDir, dot: true });
      archive.finalize();
    }
  };
};
var vite_config_default = defineConfig(({ command, mode }) => {
  let outputDir = "dist";
  const buildCommand = process.env.npm_lifecycle_event;
  return {
    plugins: [
      compressOutputPlugin(),
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
          globPatterns: ["**/*.{ts,js,css,html,png,jpg,svg,webp,gif}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 ** 2
          // 5 MB or set to something else
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
        },
        "/www": {
          target: "http://hnybgz.asuscomm.com:6688/gateway/mapping/cloud/v1",
          // 后端API的实际地址
          changeOrigin: true,
          // 是否改变源，开启后会对主机头进行修改， 默认false
          rewrite: (path2) => path2.replace(/^\/www/, "")
          // 重写路径，去除请求前缀
          // rewrite: (path) => path.replace(new RegExp(`^${baseApiOther}`), ""), // Rewrite the path dynamically
        }
      },
      hmr: true
    },
    build: {
      outDir: getOutputDir(buildCommand),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXBwbGUvXHU4RkI5XHU3NTRDUHJvamVjdC9jaGF0MXYxLWg1XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXBwbGUvXHU4RkI5XHU3NTRDUHJvamVjdC9jaGF0MXYxLWg1L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hcHBsZS8lRTglQkUlQjklRTclOTUlOENQcm9qZWN0L2NoYXQxdjEtaDUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmRcIjtcbmltcG9ydCBweHRvcmVtIGZyb20gXCJwb3N0Y3NzLXB4dG9yZW1cIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiO1xuaW1wb3J0IGFyY2hpdmVyIGZyb20gXCJhcmNoaXZlclwiO1xuXG4vL1x1OEZEOVx1NEUyQVx1OTE0RFx1N0Y2RSBcdTRFM0FcdTRFODZcdTU3MjhodG1sXHU0RTJEXHU0RjdGXHU3NTI4IFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxuY29uc3QgZ2V0Vml0ZUVudiA9IChtb2RlLCB0YXJnZXQpID0+IHtcbiAgcmV0dXJuIGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlbdGFyZ2V0XTtcbn07XG5cbmNvbnN0IGdldE91dHB1dERpciA9IChidWlsZENvbW1hbmQpID0+IHtcbiAgc3dpdGNoIChidWlsZENvbW1hbmQpIHtcbiAgICBjYXNlIFwiYnVpbGQ6dmlkam95XCI6XG4gICAgICByZXR1cm4gXCJkaXN0LXZpZGpveVwiO1xuICAgIGNhc2UgXCJidWlsZDp5YXlhXCI6XG4gICAgICByZXR1cm4gXCJkaXN0LXlheWFcIjtcbiAgICBjYXNlIFwiYnVpbGQ6Y2hhdEpvaVwiOlxuICAgICAgcmV0dXJuIFwiZGlzdC1jaGF0Sm9pXCI7XG4gICAgY2FzZSBcImJ1aWxkOmp1c3RWaWRUZXN0XCI6XG4gICAgICByZXR1cm4gXCJkaXN0LWp1c3RWaWRUZXN0XCI7XG4gICAgY2FzZSBcImJ1aWxkOnZpZEh1YlwiOlxuICAgICAgcmV0dXJuIFwiZGlzdC12aWRIdWJcIjtcbiAgICBjYXNlIFwiYnVpbGQ6dmlkQnV6elwiOlxuICAgICAgcmV0dXJuIFwiZGlzdC12aWRCdXp6XCI7XG4gICAgY2FzZSBcImJ1aWxkOnZpZExpbmtcIjpcbiAgICAgIHJldHVybiBcImRpc3QtdmlkTGlua1wiO1xuICAgIGNhc2UgXCJidWlsZDp2aWRDaGF0XCI6XG4gICAgICByZXR1cm4gXCJkaXN0LXZpZENoYXRcIjtcbiAgICBjYXNlIFwiYnVpbGQ6U291bENoYXRcIjpcbiAgICAgIHJldHVybiBcImRpc3QtU291bENoYXRcIjtcbiAgICBjYXNlIFwiYnVpbGQ6U3BpY3lDaGF0XCI6XG4gICAgICByZXR1cm4gXCJkaXN0LVNwaWN5Q2hhdFwiO1xuICAgIGNhc2UgXCJidWlsZDpzdHJhbmdlcnNcIjpcbiAgICAgIHJldHVybiBcImRpc3Qtc3RyYW5nZXJzXCI7XG4gICAgY2FzZSBcImJ1aWxkOlNleHlDaGF0XCI6XG4gICAgICByZXR1cm4gXCJkaXN0LVNleHlDaGF0XCI7XG4gICAgY2FzZSBcImJ1aWxkOkhvcm55aHViXCI6XG4gICAgICByZXR1cm4gXCJkaXN0LUhvcm55aHViXCI7XG4gICAgY2FzZSBcImJ1aWxkOlNleHlsaXZlY2hhdFwiOlxuICAgICAgcmV0dXJuIFwiZGlzdC1TZXh5bGl2ZWNoYXRcIjtcbiAgICBjYXNlIFwiYnVpbGQ6TnVkZUNoYXRcIjpcbiAgICAgIHJldHVybiBcImRpc3QtTnVkZUNoYXRcIjtcbiAgICBjYXNlIFwiYnVpbGQ6QWR1bHRDaGF0XCI6XG4gICAgICByZXR1cm4gXCJkaXN0LUFkdWx0Q2hhdFwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gXCJkaXN0XCI7IC8vIFx1OUVEOFx1OEJBNFx1Njc4NFx1NUVGQVx1OEY5M1x1NTFGQVx1NzZFRVx1NUY1NVxuICB9XG59O1xuXG4vLyBcdTU5MkFcdTU5MUFcdTUzMDVcdTk3MDBcdTg5ODFcdTUzOEJcdTdGMjlcdUZGMENcdThGRDlcdTkxQ0NcdTRGN0ZcdTc1MjhcdTYzRDJcdTRFRjZcdTUzOEJcdTdGMjlcdThGOTNcdTUxRkFcdTc2RUVcdTVGNTVcbmNvbnN0IGNvbXByZXNzT3V0cHV0UGx1Z2luID0gKCkgPT4ge1xuICBjb25zdCBidWlsZENvbW1hbmQgPSBwcm9jZXNzLmVudi5ucG1fbGlmZWN5Y2xlX2V2ZW50O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJjb21wcmVzcy1vdXRwdXQtcGx1Z2luXCIsXG4gICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBjb25zdCBvdXRwdXREaXIgPSBnZXRPdXRwdXREaXIoYnVpbGRDb21tYW5kKTtcblxuICAgICAgY29uc3QgemlwRmlsZVBhdGggPSBgJHtvdXRwdXREaXJ9LnppcGA7XG5cbiAgICAgIGNvbnNvbGUubG9nKGBcdTVGMDBcdTU5Q0JcdTUzOEJcdTdGMjkgJHtvdXRwdXREaXJ9IFx1NTIzMCAke3ppcEZpbGVQYXRofS4uLmApO1xuXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTc2RUVcdTVGNTVcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhvdXRwdXREaXIpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFx1NzZFRVx1NUY1NSAke291dHB1dERpcn0gXHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU2NUUwXHU2Q0Q1XHU1MzhCXHU3RjI5XHVGRjAxYCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gXHU1MjFCXHU1RUZBXHU1MzhCXHU3RjI5XHU2NTg3XHU0RUY2XG4gICAgICBjb25zdCBvdXRwdXQgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh6aXBGaWxlUGF0aCk7XG4gICAgICBjb25zdCBhcmNoaXZlID0gYXJjaGl2ZXIoXCJ6aXBcIiwgeyB6bGliOiB7IGxldmVsOiA5IH0gfSk7XG5cbiAgICAgIG91dHB1dC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgYCR7emlwRmlsZVBhdGh9IFx1NTM4Qlx1N0YyOVx1NUI4Q1x1NjIxMFx1RkYwQ1x1NTkyN1x1NUMwRlx1NEUzQSAke2FyY2hpdmUucG9pbnRlcigpfSBcdTVCNTdcdTgyODJgXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgYXJjaGl2ZS5vbihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSk7XG5cbiAgICAgIGFyY2hpdmUucGlwZShvdXRwdXQpO1xuXG4gICAgICAvLyBcdTZERkJcdTUyQTBcdTc2RUVcdTVGNTVcdTUxODVcdTVCQjlcdUZGMDhcdTRFMERcdTUzMDVcdTU0MkJcdTY4MzlcdTc2RUVcdTVGNTVcdTY3MkNcdThFQUJcdUZGMDlcbiAgICAgIGFyY2hpdmUuZ2xvYihcIioqLypcIiwgeyBjd2Q6IG91dHB1dERpciwgZG90OiB0cnVlIH0pO1xuXG4gICAgICBhcmNoaXZlLmZpbmFsaXplKCk7XG4gICAgfSxcbiAgfTtcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGxldCBvdXRwdXREaXIgPSBcImRpc3RcIjsgLy8gXHU5RUQ4XHU4QkE0XHU4RjkzXHU1MUZBXHU3NkVFXHU1RjU1XG4gIGNvbnN0IGJ1aWxkQ29tbWFuZCA9IHByb2Nlc3MuZW52Lm5wbV9saWZlY3ljbGVfZXZlbnQ7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICBjb21wcmVzc091dHB1dFBsdWdpbigpLFxuICAgICAgdnVlKCksXG4gICAgICBWdWVTZXR1cEV4dGVuZCgpLFxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MDAwLCAvLyBcdTVCRjlcdTU5MjdcdTRFOEUgMW1iIFx1NzY4NFx1NjU4N1x1NEVGNlx1OEZEQlx1ODg0Q1x1NTM4Qlx1N0YyOVxuICAgICAgfSksXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLy9cdTVDMDZcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0YgVklURV9BUFBfVElUTEUgXHU4RDRCXHU1MDNDXHU3RUQ5IHRpdGxlIFx1NjVCOVx1NEZCRiBodG1sXHU5ODc1XHU5NzYyXHU0RjdGXHU3NTI4IHRpdGxlIFx1ODNCN1x1NTNENlx1N0NGQlx1N0VERlx1NjgwN1x1OTg5OFxuICAgICAgICAgICAgdGl0bGU6IGdldFZpdGVFbnYobW9kZSwgXCJWSVRFX0FQUF9USVRMRVwiKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBWaXRlUFdBKHtcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIiwgLy8gXHU1M0VGXHU5MDA5XHVGRjFBYXV0b1VwZGF0ZSB8IG1hbnVhbFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbXG4gICAgICAgICAgXCJmYXZpY29uLmljb1wiLFxuICAgICAgICAgIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIixcbiAgICAgICAgICBcIm1hc2tlZC1pY29uLnN2Z1wiLFxuICAgICAgICBdLFxuICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgIG5hbWU6IFwiTXkgUFdBIEFwcFwiLFxuICAgICAgICAgIHNob3J0X25hbWU6IFwiTXlBcHBcIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBIGRlc2NyaXB0aW9uIG9mIG15IFBXQSBhcHAuXCIsXG4gICAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogXCIuL3B1YmxpYy92aXRlLnN2Z1wiLFxuICAgICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICBzcmM6IFwiYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICAgICAgICAgIC8vICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgLy8gICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB3b3JrYm94OiB7XG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLnt0cyxqcyxjc3MsaHRtbCxwbmcsanBnLHN2Zyx3ZWJwLGdpZn1cIl0sXG4gICAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUgKiAxMDI0ICoqIDIsIC8vIDUgTUIgb3Igc2V0IHRvIHNvbWV0aGluZyBlbHNlXG5cbiAgICAgICAgICAvLyBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIC8vICAge1xuICAgICAgICAgIC8vICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ3N0YXRpY1xcLmNvbS8sXG4gICAgICAgICAgLy8gICAgIGhhbmRsZXI6IFwiU3RhbGVXaGlsZVJldmFsaWRhdGVcIixcbiAgICAgICAgICAvLyAgICAgb3B0aW9uczoge1xuICAgICAgICAgIC8vICAgICAgIGNhY2hlTmFtZTogXCJnb29nbGUtZm9udHMtd2ViZm9udHNcIixcbiAgICAgICAgICAvLyAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgIC8vICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxuICAgICAgICAgIC8vICAgICAgIH0sXG4gICAgICAgICAgLy8gICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgIC8vICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgLy8gICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzMCwgLy8gMzAgRGF5c1xuICAgICAgICAgIC8vICAgICAgIH0sXG4gICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgLy8gICB9LFxuICAgICAgICAgIC8vICAgLy8gQWRkIG1vcmUgcnVudGltZSBjYWNoaW5nIHJ1bGVzIGFzIG5lZWRlZFxuICAgICAgICAgIC8vIF0sXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRldk9wdGlvbnM6IHtcbiAgICAgICAgLy8gICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAvLyB9LFxuICAgICAgfSksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICB0YWlsd2luZGNzcyxcbiAgICAgICAgICBweHRvcmVtKHtcbiAgICAgICAgICAgIC8vIHJvb3RWYWx1ZTogNzUsIC8vIFx1OEZEOVx1OTFDQ1x1NTE5OVx1OEJCRVx1OEJBMVx1N0EzRlx1NzY4NFx1NUJCRFx1NUVBNi8xMFx1NTM3M1x1NTNFRlx1RkYwQ1x1NEY4Qlx1NTk4Mlx1OEJCRVx1OEJBMVx1N0EzRlx1NUJCRFx1NUVBNlx1NjYyRjc1MHB4XHU1QzMxXHU1MTk5NzVcbiAgICAgICAgICAgIC8vIHZhbnRcdTlFRDhcdThCQTRcdTY2MkYzNy41XHVGRjBDXHU1OTgyXHU2NzlDXHU2NjJGXHU0RjdGXHU3NTI4XHU0RTg2dmFudFx1NzY4NFx1OEJERFx1NTNFRlx1NEVFNVx1NTBDRlx1NEUwQlx1OTc2Mlx1OEZEOVx1NjgzN1x1NTE5OVxuICAgICAgICAgICAgcm9vdFZhbHVlKHJlcykge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzLmZpbGUuaW5kZXhPZihcInZhbnRcIikgIT09IC0xID8gMzcuNSA6IDc1O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb3BMaXN0OiBbXCIqXCJdLCAvLyBcdTk3MDBcdTg5ODFcdThGNkNcdTYzNjJcdTc2ODRcdTVDNUVcdTYwMjdcdUZGMENcdTlFRDhcdThCQTRcdThGNkNcdTYzNjJcdTYyNDBcdTY3MDlcdTVDNUVcdTYwMjdcbiAgICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXSwgLy8gQ1NTXHU5MDA5XHU2MkU5XHU1NjY4XHU5RUQxXHU1NDBEXHU1MzU1XHVGRjBDXHU5NjMyXHU2QjYyXHU5MEU4XHU1MjA2XHU5MDA5XHU2MkU5XHU1NjY4XHU4OEFCXHU4RjZDXHU2MzYyXG4gICAgICAgICAgICBleGNsdWRlOiAvXFwvbm9kZV9tb2R1bGVzXFwvL2ksIC8vIFx1NUZGRFx1NzU2NVx1NTMwNVx1NjU4N1x1NEVGNlx1OEY2Q1x1NjM2MnJlbVxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiAzMDAwLFxuICAgICAgLy8gXHU3NTFGXHU2MjEwaHR0cHNcdTY1QjlcdTRGQkZcdTY3MkNcdTU3MzBcdThDMDNcdThCRDVcdUZGMENcdTk3MDBcdTg5ODFcdTkxNERcdTdGNkVcdTY3MkNcdTU3MzBcdThCQzFcdTRFNjZcbiAgICAgIGh0dHBzOiB7XG4gICAgICAgIGtleTogZnMucmVhZEZpbGVTeW5jKFwiLi9sb2NhbGhvc3Qta2V5LnBlbVwiKSxcbiAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKFwiLi9sb2NhbGhvc3QucGVtXCIpLFxuICAgICAgfSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9obnliZ3ouYXN1c2NvbW0uY29tOjY2ODgvZHVvbWUvYXBpL3YxXCIsIC8vIFx1NTQwRVx1N0FFRkFQSVx1NzY4NFx1NUI5RVx1OTY0NVx1NTczMFx1NTc0MFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU2NTM5XHU1M0Q4XHU2RTkwXHVGRjBDXHU1RjAwXHU1NDJGXHU1NDBFXHU0RjFBXHU1QkY5XHU0RTNCXHU2NzNBXHU1OTM0XHU4RkRCXHU4ODRDXHU0RkVFXHU2NTM5XHVGRjBDIFx1OUVEOFx1OEJBNGZhbHNlXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLCAvLyBcdTkxQ0RcdTUxOTlcdThERUZcdTVGODRcdUZGMENcdTUzQkJcdTk2NjRcdThCRjdcdTZDNDJcdTUyNERcdTdGMDBcbiAgICAgICAgfSxcbiAgICAgICAgXCIvcXFxXCI6IHtcbiAgICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpXCIsIC8vIFx1NTQwRVx1N0FFRkFQSVx1NzY4NFx1NUI5RVx1OTY0NVx1NTczMFx1NTc0MFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU2NTM5XHU1M0Q4XHU2RTkwXHVGRjBDXHU1RjAwXHU1NDJGXHU1NDBFXHU0RjFBXHU1QkY5XHU0RTNCXHU2NzNBXHU1OTM0XHU4RkRCXHU4ODRDXHU0RkVFXHU2NTM5XHVGRjBDIFx1OUVEOFx1OEJBNGZhbHNlXG4gICAgICAgICAgc2VjdXJlOiB0cnVlLCAvLyBcdTc5ODFcdTc1MjggU1NMIFx1OEJDMVx1NEU2Nlx1OUE4Q1x1OEJDMVxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9xcXEvLCBcIlwiKSwgLy8gXHU5MUNEXHU1MTk5XHU4REVGXHU1Rjg0XHVGRjBDXHU1M0JCXHU5NjY0XHU4QkY3XHU2QzQyXHU1MjREXHU3RjAwXG4gICAgICAgIH0sXG4gICAgICAgIFwiL3d3d1wiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9obnliZ3ouYXN1c2NvbW0uY29tOjY2ODgvZ2F0ZXdheS9tYXBwaW5nL2Nsb3VkL3YxXCIsIC8vIFx1NTQwRVx1N0FFRkFQSVx1NzY4NFx1NUI5RVx1OTY0NVx1NTczMFx1NTc0MFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU2NTM5XHU1M0Q4XHU2RTkwXHVGRjBDXHU1RjAwXHU1NDJGXHU1NDBFXHU0RjFBXHU1QkY5XHU0RTNCXHU2NzNBXHU1OTM0XHU4RkRCXHU4ODRDXHU0RkVFXHU2NTM5XHVGRjBDIFx1OUVEOFx1OEJBNGZhbHNlXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3d3dy8sIFwiXCIpLCAvLyBcdTkxQ0RcdTUxOTlcdThERUZcdTVGODRcdUZGMENcdTUzQkJcdTk2NjRcdThCRjdcdTZDNDJcdTUyNERcdTdGMDBcbiAgICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke2Jhc2VBcGlPdGhlcn1gKSwgXCJcIiksIC8vIFJld3JpdGUgdGhlIHBhdGggZHluYW1pY2FsbHlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBobXI6IHRydWUsXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiBnZXRPdXRwdXREaXIoYnVpbGRDb21tYW5kKSxcbiAgICAgIC8vIHNvdXJjZW1hcDogaXNEZXZFbnYobW9kZSksXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIG1hbnVhbENodW5rcyhpZDogYW55KSB7XG4gICAgICAgICAgICAvLyBcdTUyMURcdTU5Q0JcdTUzMTZ0YWlsd2luZGNzc1x1NjU4N1x1NEVGNlx1RkYwQ1x1NjUzRVx1NTE2NVx1ODFGM21haW4udHNcdTRFMkRcdThERUZcdTVGODRcdTRFMDBcdTgxRjRcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcInNyYy9pbmRleC5jc3NcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwidGFpbHdpbmRjc3NcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJ2ZW5kb3JcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAvLyBpbnB1dDogJ2luZGV4Lmh0bWwnXG4gICAgICB9LFxuICAgIH0sXG4gICAgYmFzZTogXCIuL1wiLFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFTLFNBQVMsY0FBYyxlQUFlO0FBQzNVLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sUUFBUTtBQUNmLFNBQVMsZUFBZTtBQUN4QixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGNBQWM7QUFWckIsSUFBTSxtQ0FBbUM7QUFhekMsSUFBTSxhQUFhLENBQUMsTUFBTSxXQUFXO0FBQ25DLFNBQU8sUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTTtBQUM1QztBQUVBLElBQU0sZUFBZSxDQUFDLGlCQUFpQjtBQUNyQyxVQUFRLGNBQWM7QUFBQSxJQUNwQixLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1Q7QUFDRSxhQUFPO0FBQUEsRUFDWDtBQUNGO0FBR0EsSUFBTSx1QkFBdUIsTUFBTTtBQUNqQyxRQUFNLGVBQWUsUUFBUSxJQUFJO0FBRWpDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFDWixZQUFNLFlBQVksYUFBYSxZQUFZO0FBRTNDLFlBQU0sY0FBYyxHQUFHLFNBQVM7QUFFaEMsY0FBUSxJQUFJLDRCQUFRLFNBQVMsV0FBTSxXQUFXLEtBQUs7QUFHbkQsVUFBSSxDQUFDLEdBQUcsV0FBVyxTQUFTLEdBQUc7QUFDN0IsZ0JBQVEsTUFBTSxnQkFBTSxTQUFTLHlEQUFZO0FBQ3pDO0FBQUEsTUFDRjtBQUdBLFlBQU0sU0FBUyxHQUFHLGtCQUFrQixXQUFXO0FBQy9DLFlBQU0sVUFBVSxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztBQUV0RCxhQUFPLEdBQUcsU0FBUyxNQUFNO0FBQ3ZCLGdCQUFRO0FBQUEsVUFDTixHQUFHLFdBQVcscURBQWEsUUFBUSxRQUFRLENBQUM7QUFBQSxRQUM5QztBQUFBLE1BQ0YsQ0FBQztBQUVELGNBQVEsR0FBRyxTQUFTLENBQUMsUUFBUTtBQUMzQixjQUFNO0FBQUEsTUFDUixDQUFDO0FBRUQsY0FBUSxLQUFLLE1BQU07QUFHbkIsY0FBUSxLQUFLLFFBQVEsRUFBRSxLQUFLLFdBQVcsS0FBSyxLQUFLLENBQUM7QUFFbEQsY0FBUSxTQUFTO0FBQUEsSUFDbkI7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBQ2pELE1BQUksWUFBWTtBQUNoQixRQUFNLGVBQWUsUUFBUSxJQUFJO0FBRWpDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLHFCQUFxQjtBQUFBLE1BQ3JCLElBQUk7QUFBQSxNQUNKLGVBQWU7QUFBQSxNQUNmLGdCQUFnQjtBQUFBLFFBQ2QsV0FBVztBQUFBO0FBQUEsTUFDYixDQUFDO0FBQUEsTUFDRCxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxVQUNOLE1BQU07QUFBQTtBQUFBLFlBRUosT0FBTyxXQUFXLE1BQU0sZ0JBQWdCO0FBQUEsVUFDMUM7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxRQUNkLGVBQWU7QUFBQSxVQUNiO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsUUFDQSxVQUFVO0FBQUEsVUFDUixNQUFNO0FBQUEsVUFDTixZQUFZO0FBQUEsVUFDWixhQUFhO0FBQUEsVUFDYixhQUFhO0FBQUEsVUFDYixPQUFPO0FBQUEsWUFDTDtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFNRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNQLGNBQWMsQ0FBQyw0Q0FBNEM7QUFBQSxVQUMzRCwrQkFBK0IsSUFBSSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFtQjdDO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ3BDO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBLFVBQ1A7QUFBQSxVQUNBLFFBQVE7QUFBQTtBQUFBO0FBQUEsWUFHTixVQUFVLEtBQUs7QUFDYixxQkFBTyxJQUFJLEtBQUssUUFBUSxNQUFNLE1BQU0sS0FBSyxPQUFPO0FBQUEsWUFDbEQ7QUFBQSxZQUNBLFVBQVUsQ0FBQyxHQUFHO0FBQUE7QUFBQSxZQUNkLG1CQUFtQixDQUFDO0FBQUE7QUFBQSxZQUNwQixTQUFTO0FBQUE7QUFBQSxVQUNYLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BRU4sT0FBTztBQUFBLFFBQ0wsS0FBSyxHQUFHLGFBQWEscUJBQXFCO0FBQUEsUUFDMUMsTUFBTSxHQUFHLGFBQWEsaUJBQWlCO0FBQUEsTUFDekM7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQTtBQUFBLFFBQzlDO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUE7QUFBQSxVQUNSLGNBQWM7QUFBQTtBQUFBLFVBQ2QsUUFBUTtBQUFBO0FBQUEsVUFDUixTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQTtBQUFBLFFBQzlDO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUE7QUFBQSxVQUNSLGNBQWM7QUFBQTtBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUE7QUFBQTtBQUFBLFFBRTlDO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSztBQUFBLElBQ1A7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVEsYUFBYSxZQUFZO0FBQUE7QUFBQSxNQUVqQyxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixhQUFhLElBQVM7QUFFcEIsZ0JBQUksR0FBRyxTQUFTLGVBQWUsR0FBRztBQUNoQyxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUE7QUFBQSxNQUVGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
