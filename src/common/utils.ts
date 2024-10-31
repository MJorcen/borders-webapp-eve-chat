/**
 * 防抖
 * @param {*} fn
 * @param {*} delay
 * @param {*} immediate 是否立即执行第一次
 * @returns
 */
export const debounce = (fn: any, delay: number) => {
  let timer: any = null;
  return (...param: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...param);
    }, delay);
  };
};

/**
 * 批量过滤对象值为空的属性
 * @param {Object} val 需要过滤的对象
 * @param {Array}  arr 排除过滤的属性
 * @returns
 */
export const getFilterData = (val: any = {}, arr: any = []) => {
  let res: any = {};
  for (let key in val) {
    if ((val[key] || val[key] === 0) && !arr.includes(key)) {
      res[key] = val[key];
    }
  }
  return res;
};

/**

 * @returns 生成一个32位以内的数字+字母组合
 */
export const generateRandomString = (length: number = 32) => {
  // 定义可能的字符集，仅包含小写字母a-f和数字
  const chars = "abcdef0123456789";

  let result = "";
  const charsLength = chars.length;

  // 使用Math.random()生成随机索引，并从字符集中选择字符
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
};

/**
 *
 * @param {string} str 需要剔除的字符串
 * @returns
 */
export const removeSubstrings = (str: string) => {
  // 先尝试移除 "evea"
  let result = str.replace(/evea/g, "");
  // 再尝试移除剩下的 "eve"
  result = result.replace(/eve/g, "");
  return result;
};

/**
 *
 * @param {number} timestamp 时间戳
 * @returns 提取日期字符串
 */
export const extractDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

/**
 *
 * @param {Array} messages 消息数组
 * @returns 返回按日期分组的消息的二维数组，里面的messages数组为倒序
 */

export const groupMessagesByDay = (messages: any) => {
  const groupedMessages: any = {};
  const reversedArr = [...messages].reverse();

  reversedArr.forEach((message: any) => {
    const dateString: any = extractDate(message.time);
    if (!groupedMessages[dateString]) {
      groupedMessages[dateString] = [];
    }
    groupedMessages[dateString].push(message);
  });

  // 将结果转换为数组
  const result = Object.entries(groupedMessages).map(([date, messages]) => ({
    date,
    messages,
  }));
  return result;
};

/**
 *
 * @param {Array} messages 消息数组
 * @returns 返回按日期分组的消息的二维数组，里面的messages数组不为倒序
 */

export const groupMessagesByDayNoReverse = (messages: any) => {
  const groupedMessages: any = {};

  messages.forEach((message: any) => {
    const dateString: any = extractDate(message.time);
    if (!groupedMessages[dateString]) {
      groupedMessages[dateString] = [];
    }
    groupedMessages[dateString].push(message);
  });

  // 将结果转换为数组
  const result = Object.entries(groupedMessages).map(([date, messages]) => ({
    date,
    messages,
  }));
  return result;
};

export const formatSecondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // 补零操作
  const pad = (num: number) => (num < 10 ? "0" + num : num);

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

/**
 *
 * @returns 返回链接的查询参数对象
 */

export const getCurrentQueryParams = (urlParamsStr: string) => {
  const urlParams = new URLSearchParams(urlParamsStr.slice(1));
  const paramsObject: { [key: string]: string } = {};
  urlParams.forEach((value: any, key: any) => {
    paramsObject[key] = value;
  });

  return paramsObject;
  // const objectParams: any = {};
  // let url = decodeURI(window.location.search || window.location.hash);
  // let strs;
  // if (url.indexOf("?") != -1) {
  //   // hash模式进此判断
  //   if (window.location.hash) {
  //     strs = url.split("?")[1].toString().split("&");
  //     // history模式
  //   } else {
  //     strs = url.substr(1).split("&");
  //   }
  //   // 循环遍历并添加到对象中
  //   for (let i = 0; i < strs.length; i++) {
  //     objectParams[strs[i].split("=")[0]] = strs[i].split("=")[1];
  //   }
  // }
  // // 判断objectParams对象的长度，大于1则有值
  // if (Object.keys(objectParams).length > 0) {
  //   console.log(objectParams);
  // }
  // return objectParams;
};
