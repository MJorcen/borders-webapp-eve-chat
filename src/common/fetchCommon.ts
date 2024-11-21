import { calldial, userconfig } from "@/api/allApi";
import evenBus from "./evenBus";
import { showToast } from "vant";
import { useRouter } from "vue-router";

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
    if (item.user.inCall === 0 && item.user.active === 1) {
      await configFetch();
      // if (configData.value?.hasPayment) {
      //   resolve(true);
      // } else {
      //   resolve(false);
      // }

      if (configSuccess.value) {
        if (configData.value?.hasPayment && flag) {
          resolve(true);
        } else {
          await callFetch({ type: 1, toUserId: item.user.id });
          if (callSuccess.value) {
            evenBus.emit("activeCall", { ...callData.value });
            // resolve(true);
          } else {
            if (code.value === 402) {
              resolve(false);
            }
          }
        }
      } else {
        showToast(callMsg.value);
        // evenBus.emit("noMony");
      }
    } else {
      router?.push({
        name: "ChatRoom",
        query: { user: JSON.stringify(item.user) },
      });
    }
  });
};
