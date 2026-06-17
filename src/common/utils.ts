import BigNumber from "bignumber.js";

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
  const urlParams = new URLSearchParams(urlParamsStr?.slice?.(1));
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

// 计算两经纬度之间的距离
export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // 地球半径，单位：公里
  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const dLat = radLat2 - radLat1;
  const dLon = (Math.PI * (lon2 - lon1)) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 返回距离，单位：公里
};

// 获取当前定位周边附近的信息
export const getPositionObj = (data: any) => {
  return new Promise(async (resolve, reject) => {
    let latitude = "";
    let longitude = "";
    await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${
        import.meta.env.VITE_APP_GOOGLE_MAP_KEY
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          considerIp: true,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Location Data:", data);
        latitude = data.location.lat;
        longitude = data.location.lng;
      })
      .catch((error) => console.error("Error:", error));

    // navigator.geolocation.getCurrentPosition(async function (position) {
    // var latitude = position.coords.latitude;
    // var longitude = position.coords.longitude;

    const resObj = JSON.parse(data[0].body.data?.bodyString || "{}");

    // const location = `${latitude},${longitude}`;

    try {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      const service: any = new google.maps.places.PlacesService(map);

      const request = {
        location: new google.maps.LatLng({ lat: latitude, lng: longitude }),
        radius: resObj.distanceMax, // 单位：米
        type: resObj.primaryTypes, // 可以根据需要更改为其他类型，如餐厅、商店等
      };

      const distanceMax = Number(new BigNumber(resObj.distanceMax).div(1000));
      const distanceMin = Number(new BigNumber(resObj.distanceMin).div(1000));
      service.nearbySearch(request, (results: any, status: string) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (results.length) {
            const hotelsWithDistance = results
              .map((hotel: any) => {
                const hotelLat = hotel.geometry.location.lat();
                const hotelLng = hotel.geometry.location.lng();

                const distance = haversine(
                  latitude,
                  longitude,
                  hotelLat,
                  hotelLng
                ); // 计算与用户位置的距离
                if (
                  distance >= Number(distanceMin) &&
                  distance <= Number(distanceMax)
                ) {
                  return {
                    ...hotel,
                    distance: distance, // 保存酒店的距离
                  };
                }
                return null;
              })
              .filter((hotel: any) => hotel !== null); // 去除 null 项
            // 按照距离从近到远排序
            const resArr = hotelsWithDistance.sort(
              (a: any, b: any) => a.distance - b.distance
            );

            resolve(resArr);
          }
        } else {
          console.error("Nearby search failed with status:", status);
        }
      });
    } catch (e) {
      console.error(e);
    }
    // });
  });
};

export const getLocalMsgList = (data: any) => {
  return new Promise((resolve, reject) => {
    let newWsMsgArr: any = [];
    try {
      newWsMsgArr = JSON.parse(localStorage.getItem("wsMsgArr") || "[]");
    } catch (e) {
      console.log(e);
    }

    // 过滤数组，取出数组ws信息传入的from去更新新的会话对象
    let fromArrMsg: any = [];
    fromArrMsg = newWsMsgArr.filter((item: any) => {
      return item?.from === data[0].body?.data?.from;
    });

    let currentChatRoomObj: any;

    try {
      currentChatRoomObj = JSON.parse(
        localStorage.getItem("currentChatRoomObj") || "{}"
      );
    } catch (e) {
      console.warn(e);
    }

    // 判断是否在房间内的时候，因为要过滤当前房间内的消息，从而得出新的未读消息
    if (
      currentChatRoomObj &&
      currentChatRoomObj.userId === data[0].body.data.from
    ) {
      fromArrMsg = fromArrMsg.filter((item: any) => {
        return item.ts > currentChatRoomObj.time;
      });
    }
    resolve(fromArrMsg);
  });
};

export const getLocalUserDetail = () => {
  let user: any = {};

  try {
    const info: any = localStorage.getItem("userDetail");
    user = JSON.parse(info as any);
    user = user.userDetail;
    return user;
  } catch (e) {
    console.log("error::", e);
  }
};
/**
 * 将 RTMP 链接转换为 HTTPS 并添加 .flv 后缀
 * @param {string} rtmpUrl - 输入的 RTMP URL
 * @returns {string} - 转换后的 HTTPS URL
 */
export function convertRtmpToFlv(rtmpUrl: string) {
  if (!rtmpUrl.startsWith("rtmp://")) {
    throw new Error("输入的 URL 必须以 rtmp:// 开头");
  }

  // 替换 rtmp:// 为 https://
  const httpsUrl = rtmpUrl.replace("rtmp://", "https://");

  // 添加 .flv 后缀
  const flvUrl = httpsUrl + ".flv";

  return flvUrl;
}
