import { calldial } from "@/api/allApi";
import evenBus from "./evenBus";
import { showToast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

const {
  fetchData: callFetch,
  data: callData,
  msg: callMsg,
  success: callSuccess,
} = calldial();

export const handleGo = async (item: any) => {
  if (item.user.inCall === 0 && item.user.active === 0) {
    return showToast("Not Online");
  }
  if (item.user.inCall === 0 && item.user.active === 1) {
    await callFetch({ type: 1, toUserId: item.user.id });
    if (callSuccess.value) {
      evenBus.emit("activeCall", { ...callData.value });
    } else {
      showToast(callMsg.value);
    }
  } else {
    router?.push({
      name: "ChatRoom",
      query: { user: JSON.stringify(item.user) },
    });
  }
};
