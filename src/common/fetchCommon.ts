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

const { fetchData: configFetch, data: configData } = userconfig();

export const handleGo = async (item: any) => {
  return new Promise(async (resolve, reject) => {
    await configFetch();
    if (configData?.value?.showFirstVipPrompt) {
      evenBus.emit("showFirstVipPrompt", configData.value);
    }
    if (item.user.inCall === 0 && item.user.active === 0) {
      return showToast("Not Online");
    }
    if (item.user.inCall === 0 && item.user.active === 1) {
      // await configFetch();
      // if (configData.value?.hasPayment) {
      //   resolve(true);
      // } else {
      //   resolve(false);
      // }
      await callFetch({ type: 1, toUserId: item.user.id });
      if (callSuccess.value) {
        evenBus.emit("activeCall", { ...callData.value });
        resolve(true);
      } else {
        showToast(callMsg.value);
        if (code.value === 402) {
          resolve(false);
        }
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
