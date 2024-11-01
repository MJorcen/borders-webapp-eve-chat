import axios from "axios";
// import { useRouter } from 'vue-router'
// import { router } from '@/router/index'
import { showToast } from "vant";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { getCurrentQueryParams } from "@/common/utils";

const router = useRouter();

/**
 * 返回状态信息，根据 http 状态错
 * @param {Number} status
 * @returns
 */

/**
 * 初始化 axios 服务
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // baseURL: getBaseUrl(),

  // headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  // },
  // 是否跨站点访问控制请求
  withCredentials: false,
  timeout: 30000,
  validateStatus() {
    return true;
  },
});

/**
 * 拦截请求
 */
service.interceptors.request.use(
  (config: any) => {
    let userInfo: any;
    const region = localStorage.getItem("region");
    const country = localStorage.getItem("country");
    const token = localStorage.getItem("web_token");

    let rbParams: any = {};

    try {
      let rbLoacal = localStorage.getItem(
        `__rb_${import.meta.env.VITE_ROLBEST_LINKID}_params`
      ) as string;
      rbParams = getCurrentQueryParams(rbLoacal);
    } catch (e) {
      console.log("error::", e);
    }

    try {
      const info = localStorage.getItem("userInfo");
      userInfo = JSON.parse(info as string);
    } catch (e) {
      console.log("error::", e);
    }

    const navigatorInfo = navigator.languages;

    const preferredLanguage = navigator.language;

    // if (userInfo) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    config.headers.Authorization = `Bearer ${token}`;
    const deviceId = Cookies.get("deviceId");
    config.headers["Eve-Payload"] = `deviceId=${deviceId}${
      import.meta.env.VITE_APP_EVE_PAYLOAD
    }&lang=${preferredLanguage}&locale=${
      navigatorInfo?.[0] || navigatorInfo?.[1]
    }&region=${region}&rb=${
      rbParams?.click_clickid
        ? rbParams?.click_clickid
        : rbParams?.rb
        ? rbParams?.rb
        : rbParams?.index
        ? rbParams?.index
        : ""
    }`;
    config.headers["CF-IPCountry"] = country;
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    return config;
  },
  async (error: any) => {
    error.data = {};
    error.data.msg = "服务器异常，请联系管理员！";
    return await Promise.resolve(error);
  }
);

// 返回拦截
service.interceptors.response.use(
  (response: any) => {
    const status = response.status;
    let msg = "";

    // console.log("msg::", response);
    // http 状态码
    if (status < 200 || status >= 300) {
      msg = response.data.msg;
      if (typeof response.data === "string") {
        response.data = {
          msg,
        };
      } else {
        response.data.msg = msg;
      }

      showToast(msg);
      console.log("status", status);

      //  没有权限跳转到登录页面重新登录
      if (status === 401) {
        console.log("== 401");
        localStorage.removeItem("userInfo");
        router.push("/login");
        // location.reload();
      }
    }

    return response;
  },
  async (error: any) => {
    console.log("error.config:::", error);
    // 请求缓存处理方式
    const message = error?.message;
    if (axios.isCancel(error) && message.data && message.data.config.cache) {
      return await Promise.resolve(message.data); // 返回结果数据
    }
    if (axios.isCancel(error)) {
      console.log("repeated request: ", message);
    } else {
      // 处理错误业务代码
      error.data = {};
      error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
      showToast(error.data.msg);
    }

    return await Promise.reject(error);
  }
);

export default service;
