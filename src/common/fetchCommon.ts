import {
  calldial,
  userconfig,
  logindevice,
  deviceactivate,
  userfillInfo,
  userlocation,
} from "@/api/allApi";
import evenBus from "./evenBus";
import { closeToast, showLoadingToast, showToast } from "vant";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useImHook } from "@/hook/useIm";
import { useUserDetailStore } from "@/stores/userDetail";
import randomData from "@/common/randomName.json";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { ref } from "vue";
import { getFilterData } from "./utils";
import dayjs from "dayjs";

const router = useRouter();

const {
  fetchData: callFetch,
  data: callData,
  msg: callMsg,
  success: callSuccess,
  code,
} = calldial();

const {
  fetchData: configFetch,
  data: configData,
  success: configSuccess,
} = userconfig();

export const handleGo = async (item: any) => {
  return new Promise(async (resolve, reject) => {
    showLoadingToast({
      message: "Please wait...",
      duration: 0,
      forbidClick: true,
    });
    let flag = false;
    let mapMsgArr: any = [];

    try {
      mapMsgArr = JSON.parse(localStorage.getItem("mapMsgArr") || "[]");
    } catch (e) {
      console.log(e);
    }

    if (mapMsgArr.some((i: any) => i == item.user.id)) {
      flag = true;
    }

    if (item.user.inCall === 0 && item.user.active === 0) {
      return showToast("Not Online");
    }
    if (item.user.inCall === 1 && item.user.active === 0) {
      return showToast("She is in call");
    }
    if (item.user.inCall === 0 && item.user.active === 1) {
      evenBus.emit("call");
    } else {
      router?.push({
        name: "ChatRoom",
        query: { user: JSON.stringify(item.user) },
      });
    }
  });
};

const { fetchData, msg, success, data } = logindevice();

const { setUser } = useUserStore();

const { setUser: setUserDetail }: any = useUserDetailStore();

const { fetchData: localFetchData } = userlocation();

const {
  fetchData: activateFetch,
  msg: activateMsg,
  success: activateSuccess,
} = deviceactivate();

const {
  fetchData: userFetch,
  msg: userMsg,
  success: userSuccess,
} = userfillInfo();

const latitude = ref<any>("");
const longitude = ref<any>("");

export const handleResgiter = () => {
  return new Promise(async (resolve, reject) => {
    let deviceId = "";

    const deviceIdCookie = Cookies.get("deviceId");

    if (!deviceIdCookie) {
      deviceId = uuidv4();

      Cookies.set("deviceId", deviceId, { expires: 365 });
    } else {
      deviceId = deviceIdCookie;
    }
    await fetch("https://ipapi.co/json/")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data.country_code_iso3); // 输出国家代码，如 'USA'
        console.log(data.country_calling_code); // 输出国家拨号代码，如 '1'
        console.log(data.country_name); // 输出国家名称，如 'United States'
        localStorage.setItem("region", data.country_code_iso3);
        localStorage.setItem("country", data.country);
        latitude.value = data.latitude;
        longitude.value = data.longitude;
      })
      .catch(function (error) {
        console.log("Error fetching API: ", error);
      });

    await activateFetch(
      getFilterData({
        brand: "XIAOMI",
        model: "MI 10",
        userAgent: "cs",
        androidId: "123456",
        // referrer: JSON.stringify(state.urlData),
        // imei: link_id,
      })
    );
    if (activateSuccess.value) {
      await fetchData({ deviceId: deviceId });
      if (success.value) {
        localStorage.setItem("web_token", data.value.token);

        await userFetch({
          nickname: generateRandomNameWithNumber(),
          gender: "M",
          // avatarFileId: upploadData.value.list[0].id,
          birthDate: dayjs().format("YYYY-MM-DD"),
        });
        if (userSuccess.value) {
          await localFetchData({
            latitude: latitude.value,
            longitude: longitude.value,
          });
          showToast("Success");
          // closeToast();
          setUser(data.value);
          setUserDetail(data.value);
          useImHook();
          resolve(true);

          // 写入当前版本号
        } else {
          // if (userMsg.value === "User existed") {
          setUser(data.value);
          setUserDetail(data.value);
          useImHook();
          resolve(true);
          // }
        }
      } else {
        // showToast(msg.value);
      }
    } else {
      // showToast(activateMsg.value);
    }
  });
};

const nicknames = randomData.randomNickArr;

function generateRandomNameWithNumber() {
  // 随机选择一个名字
  const randomName = nicknames[Math.floor(Math.random() * nicknames.length)];

  // 生成三个随机数字
  const randomNumbers = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  // 返回结果
  return `${randomName}${randomNumbers}`;
}
