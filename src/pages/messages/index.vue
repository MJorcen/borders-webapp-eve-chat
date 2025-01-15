<template>
  <div class="bigBoxs">
    <!-- <img
      class="siginImg"
      @click.stop="handleSigin"
      src="./assets/Group1000004767@2x.webp"
    /> -->
    <div class="topBox">
      <div class="tabsBox">
        <div class="tabsBoxLeft">
          <div
            :class="item.active ? 'activeTabs' : 'tabs'"
            v-for="(item, index) in tabsList"
            :key="index"
            @click="handleClick(index)"
          >
            {{ item.title }}
            <div class="line" v-if="item.active"></div>
          </div>
        </div>
        <div class="flex items-center">
          <img
            @click="router.push('/notification')"
            src="./assets/xiaoxi1@2x.webp"
            class="noticeImg"
          />
          <img
            @click="handleClear"
            src="./assets/clear123.webp"
            class="deleteImg"
          />
        </div>
      </div>
      <!-- <div class="scollTop" v-if="active === 0 && state.messageList.length">
        <div
          :class="item.onLine ? 'userItem' : 'userItemNone'"
          v-for="(item, index) in state.messageList.slice(0, 10)"
          :key="index"
        >
          <van-image
            round
            radius="50"
            fit="cover"
            :src="item.avatar"
            class="noticeTopImg"
            lazy-load
            @click.stop="handleChatRoom(item)"
          ></van-image>
        </div>
      </div> -->
      <!-- live流入口 -->
      <div
        class="liveBoxBig"
        v-if="active === 0 && liveData?.list?.length"
        @click="router.push('/livePage')"
      >
        <div class="liveBox">
          <div class="liveBoxLeft">
            <div class="liveBoxLeftImg">
              <SvgaShow
                :divId="`liveBoxSvga`"
                :url="'https://fs.duome.live/app/live/live.svga'"
              ></SvgaShow>
              <div class="liveNums">{{ liveData?.total }}</div>
            </div>
            <div class="liveBoxLeftFont">Live streaming</div>
          </div>
          <div class="liveBoxRight">
            <van-image
              v-for="(item, index) in liveData?.list"
              round
              fit="cover"
              lazy-load
              radius="50"
              :src="item?.avatar"
              class="liveBoxRightImg"
            >
            </van-image>
          </div>
        </div>
      </div>

      <!-- live流入口 -->

      <!-- 系统消息 -->
      <!-- <div class="noticeTopBoxBig" v-if="active === 0">
        <div class="noticeTopBox" @click="router.push('/notification')">
          <img src="./assets/noticeNew.png" class="noticeTopImg" />
          <div class="noticeTopBoxRight">
            <div class="noticeTopBoxRightTop">
              <div class="noticeTopBoxRightTopLeft">Notifications</div>
              <div class="noticeTopBoxRightTopRight">
                {{ noticeData?.list?.[0]?.updatedAt }}
              </div>
            </div>
            <div class="noticeTopBoxRightBottom">
              {{ noticeData?.list?.[0]?.content || "No new notifications" }}
            </div>
          </div>
        </div>
      </div> -->
      <!-- 系统消息 -->
      <!-- 访客 -->
      <div
        class="noticeTopBoxBig"
        v-if="active === 0"
        @click="router.push('/visitor')"
      >
        <div class="eyeBig">
          <div class="eyesLeft">
            <img src="./assets/eyes.png" class="eyesImg" />
            <div class="eyesFont">
              <div class="eyesFontOne">Visitors</div>
              <div class="eyesFontTwo">Have new visitors!</div>
            </div>
          </div>
          <div class="eyesRight">
            <img src="./assets/mohu.png" class="eyesRightImg" />
            <div class="dian"></div>
          </div>
        </div>
      </div>
      <!-- 访客 -->
    </div>
    <!-- v-if="active === 0 && state.messageList.length" -->
    <div class="msgBigOverflow" v-if="active === 0 && state.messageList.length">
      <van-list>
        <div
          class="noticeTopBoxBigMsg"
          v-for="(item, index) in state.messageList"
          :key="item?.id"
          @click.stop="handleChatRoom(item)"
        >
          <div class="noticeTopBox">
            <van-image
              round
              fit="cover"
              lazy-load
              radius="50"
              :src="item?.avatar"
              class="noticeTopImg"
            >
              <!-- <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template> -->
            </van-image>
            <div class="noticeTopBoxRight">
              <van-skeleton title :row="4" :loading="loadingSkeleton">
                <div class="noticeTopBoxRightTop">
                  <div class="noticeTopBoxRightTopLeft">{{ item?.nick }}</div>
                  <div
                    class="noticeTopBoxRightTopRight"
                    v-if="
                      !item?.localCustom || item?.localCustom?.cusstomMsg === ''
                    "
                  >
                    {{ dayjs(item?.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
                  </div>
                  <div v-else class="noticeTopBoxRightTopRight">
                    {{
                      dayjs(item?.localCustom?.time).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    }}
                  </div>
                </div>
                <div class="noticeTopBoxRightBottomFlex">
                  <!-- !item.localCustom?.cusstomMsg -->
                  <div
                    class="noticeTopBoxRightBottomFlexFont"
                    v-if="
                      (!item?.localCustom && !item?.localCustom?.cusstomMsg) ||
                      item?.localCustom?.cusstomMsg === ''
                    "
                  >
                    {{
                      item?.lastMsg?.type === "image"
                        ? "[Picture]"
                        : item?.lastMsg?.type === "audio"
                        ? "[Audio]"
                        : item?.lastMsg?.type === "custom" &&
                          JSON.parse(item?.lastMsg?.content)?.type === 2
                        ? "[Video Call]"
                        : item?.lastMsg?.type === "custom" &&
                          JSON.parse(item?.lastMsg?.content)?.type === 1
                        ? "[Gift]"
                        : item?.lastMsg?.type === "geo"
                        ? "[Map]"
                        : item?.lastMsg?.text?.includes("displayName")
                        ? "[Map]"
                        : item?.lastMsg?.text
                    }}
                  </div>
                  <div v-else class="noticeTopBoxRightBottomFlexFont">
                    {{
                      item?.localCustom?.cusstomMsg?.includes?.("ext")
                        ? "[Picture]"
                        : item?.localCustom?.cusstomMsg?.includes?.(
                            "displayName"
                          )
                        ? "[Map]"
                        : item?.localCustom?.cusstomMsg
                    }}
                  </div>
                  <div
                    class="nums"
                    v-if="
                      (item?.unread <= 99 && item?.unread > 0) ||
                      item?.localCustom?.unread > 0
                    "
                  >
                    {{
                      !item?.localCustom && !item?.localCustom?.unread
                        ? item?.unread
                        : item?.localCustom?.unread
                    }}
                  </div>
                  <div class="numsPlus" v-if="item?.unread >= 99">99+</div>
                </div>
              </van-skeleton>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <Empty v-if="active === 0 && !state.messageList.length"></Empty>

    <van-pull-refresh
      v-model="loading"
      @refresh="
        () => {
          state.callList = [];
          state.offset = 0;
          state.finished = true;
          getList();
        }
      "
    >
      <template #pulling>
        <span>Loading...</span>
      </template>
      <template #loosing>
        <span>Loading...</span>
      </template>
      <template #loading>
        <span>Loading...</span>
      </template>
      <van-list
        v-model:loading="loading"
        :finished="state.finished"
        finished-text="Nothing More"
        loading-text="Loading..."
        @load="getList"
        v-if="active === 1"
      >
        <div v-if="active === 1">
          <div
            class="callBigBox"
            v-for="(item, index) in state.callList"
            :key="index"
          >
            <div class="callBoxItem">
              <div class="callBoxItemLeft">
                <van-image
                  round
                  fit="cover"
                  radius="50"
                  :src="item.user.avatar"
                  class="callBoxItemLeftImg"
                  lazy-load
                ></van-image>
                <div class="callContent">
                  <div class="callContentTop">{{ item.user.nickname }}</div>
                  <div class="callContentTime">
                    [Video call:{{
                      formatSecondsToTime(item.call.duration || 0)
                    }}]
                  </div>
                  <div class="callContentBottom">
                    {{ item.call.createdAt }}
                  </div>
                </div>
              </div>
              <img
                :src="
                  item.user.inCall === 0 && item.user.onDuty ? videoImg : msgImg
                "
                @click.stop="
                  () => {
                    handleGo(item).then((res) => {
                      const userDetails = getLocalUserDetail();

                      if (!res) {
                        if (userDetails?.user?.vipLevel === 0) {
                          state.showVipPopup = true;
                        } else {
                          state.showRechargePopup = true;
                        }
                      }
                    });
                  }
                "
                class="callBoxItemRight"
              />
              <!-- <div
                class="caozuo"
                @click.stop="
                  () => {
                    handleGo(item).then((res) => {
                      const userDetails = getLocalUserDetail();

                      if (!res) {
                        if (userDetails?.user?.vipLevel === 0) {
                          state.showVipPopup = true;
                        } else {
                          // state.showRechargePopup = true;
                          state.showAppUserDownLoadPopup = true;
                        }
                      } else {
                        state.showAppUserDownLoadPopup = true;
                      }
                    });
                  }
                "
              >
                <SvgaShow
                  :divId="`demo${item?.user?.id}${index}`"
                  :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
                ></SvgaShow>
              </div> -->
            </div>
          </div>
        </div>
        <Empty v-if="active === 1 && !state.callList.length"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
  <div lass="w-[100%] h-[100px]"></div>

  <!-- <van-floating-bubble
    axis="xy"
    icon="chat"
    magnetic="x"
    v-model:offset="offsetPover"
    style="width: 85px; height: 84px; background-color: rgba(255, 255, 255, 0)"
  >
    <template #default>
      <div>
        <img src="./assets/xuanfu.png" class="w-[60px] h-[50px]" />
        <div class="freeFont">Free</div>
      </div>
    </template>
  </van-floating-bubble> -->
  <Tabbar ref="TabbarRef"></Tabbar>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <CallDownLoadPopup v-model="state.showCallDownLoadPopup"></CallDownLoadPopup>
  <SignPopup v-model="state.showSignPopup"> </SignPopup>
  <AppUserDownLoadPopup
    v-model="state.showAppUserDownLoadPopup"
  ></AppUserDownLoadPopup>
</template>

<script setup lang="ts" name="Messages">
import {
  ref,
  reactive,
  onMounted,
  watch,
  nextTick,
  onActivated,
  onDeactivated,
} from "vue";
import Tabbar from "@/components/Tabbar/index.vue";
import Empty from "@/components/Empty.vue";
import dayjs from "dayjs";
import { useImHook } from "@/hook/useIm";
import { callrecordlist, notiflist, livelist, userconfig } from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";
import msgImg from "./assets/ic_video@2x (1).png";
import videoImg from "./assets/callOp.png";
import evenBus from "@/common/evenBus";
import { useRouter } from "vue-router";
import { handleGo } from "@/common/fetchCommon";
import { formatSecondsToTime, removeSubstrings } from "@/common/utils";
import { useUserStore } from "@/stores/user";
import RechargePopup from "@/components/rechargePopup/index.vue";
import { useUserDetailStore } from "@/stores/userDetail";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import CallDownLoadPopup from "@/components/callDownLoadPopup/index.vue";
import SignPopup from "@/components/signPopup/index.vue";
import AppUserDownLoadPopup from "@/components/appUserDownLoadPopup/index.vue";
import { getLocalUserDetail } from "@/common/utils";

const { userDetail }: any = useUserDetailStore();

const { vipConfigData } = useVipConfigStore();
import SvgaShow from "@/components/svgaShow/index.vue";

const { fetchData: configFetch, data: configData } = userconfig();

const state = reactive<any>({
  messageList: [],
  callList: [],
  offset: 0,
  finished: true,
  showRechargePopup: false,
  showVipPopup: false,
  showCallDownLoadPopup: false,
  showSignPopup: false,
  showAppUserDownLoadPopup: false,
});

const { fetchData: liveFetch, data: liveData } = livelist();

const offsetPover = ref({
  x: -138,
  y: 500,
});

const active = ref(0);

const router = useRouter();

const { nim } = useImHook();

const getLocalSessions = () => {
  loadingSkeleton.value = true;
  return new Promise((resolve, reject) => {
    nim?.getLocalSessions({
      limit: 100,
      done: getLocalSessionsDone,
    });

    function getLocalSessionsDone(error: any, obj: any) {
      if (!error) {
        resolve(obj.sessions);
      }
    }
  });
};

const loadingSkeleton = ref(true);

// evenBus.on("updateonSessions", (data: any) => {
//   // getLocalSessions().then((sessions: any) => {
//   //   getMsgList(sessions);
//   //   closeToast();
//   // });
// });

evenBus.on("updateSession", (data: any) => {
  // getLocalSessions().then((sessions: any) => {
  //   getMsgList(sessions);
  //   closeToast();
  // });
  getNewMsg(data);
});

const getNewMsg = async (session: any) => {
  loadingSkeleton.value = false;
  state.messageList = [...state.messageList, session];
  const account =
    session.to ===
    `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userInfo?.user.id}`
      ? session.lastMsg.from
      : session.to;
  await nim.getUser({
    account,
    done: (error: any, user: any) => {
      // if (error) {
      state.messageList = state.messageList.map((item: any) => {
        if (item?.id === session?.id) {
          item = {
            ...session,
            avatar: user?.avatar,
            nick: user?.nick,
          };
          if (user?.custom) {
            item.custom = JSON?.parse(user?.custom || "{}");
          }
          if (session?.localCustom) {
            try {
              item.localCustom = JSON.parse(session.localCustom || "{}");
            } catch (err) {
              console.warn(err);
            }
          }
          return item;
        }
        return item;
      });
      state.messageList = state.messageList.reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item?.id === current?.id);

        if (!x) {
          acc.push(current);
        }
        return acc;
      }, []);
    },
  });
};

const tabsList: any = reactive([
  { title: "Messages", active: true },
  { title: "Calls", active: false },
]);

const { fetchData: noticeFetch, data: noticeData } = notiflist();

onMounted(async () => {
  // await getList();
  // await noticeFetch({
  //   tab: 3,
  // });
  // await getMsgList(hooksState.messageList);

  document.body.style.overflow = "auto";
  getLocalSessions().then((sessions: any) => {
    showLoadingToast({
      duration: 0,
      message: "Loading...",
      forbidClick: true,
    });
    getMsgList(sessions);
  });
});

onActivated(async () => {
  await getList();
  await noticeFetch({
    tab: 3,
  });
  await liveFetch({
    limit: 4,
  });
  await configFetch();
  // showLoadingToast({
  //   duration: 0,
  //   message: "Loading...",
  //   forbidClick: true,
  // });
  // getLocalSessions().then((sessions: any) => {
  //   getMsgList(sessions);
  // });
  document.body.style.overflow = "auto";

  closeToast();
});

const handleSigin = () => {
  if (!configData.value?.hasPayment) {
    state.showVipPopup = true;
  } else {
    state.showSignPopup = true;
  }
};

watch(
  () => state.messageList,
  (newVal) => {
    if (newVal) {
      state.messageList = state.messageList.sort((a: any, b: any) => {
        const timeA = getCompareTime(a);
        const timeB = getCompareTime(b);
        return timeB - timeA;
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const { user: userInfo }: any = useUserStore();

function getCompareTime(item: any) {
  try {
    // const localCustom = JSON.parse(item?.localCustom || "{}");
    const localCustom = item?.localCustom;
    if (localCustom && localCustom.time) {
      return localCustom.time;
    }
  } catch (error) {
    // 如果解析失败，忽略错误
  }
  return item.updateTime || 0;
}

const getMsgList = async (data: any) => {
  state.messageList = data;
  console.time("getMsgList耗时"); // 开始计时

  // 创建一个数组用于存放所有的 Promise
  const promises = [];

  for (let i = 0; i < state.messageList.length; i++) {
    if (state.messageList[i]?.lastMsg) {
      const userPromise = new Promise((resolve, reject) => {
        nim.getUser({
          account:
            state.messageList[i].to ===
            `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userInfo?.user.id}`
              ? state.messageList[i].lastMsg.from
              : state.messageList[i].to,
          done: (error: any, user: any) => {
            getUserDone(error, user);
            if (error) {
              reject(error); // 如果失败，reject
            } else {
              resolve(user); // 如果成功，resolve
            }
          },
        });
      });

      promises.push(userPromise); // 将每个Promise放入数组
    }
  }

  try {
    await Promise.all(promises); // 等待所有请求完成
    console.timeEnd("getMsgList耗时"); // 结束计时并输出
    loadingSkeleton.value = false; // 关闭loading效果
  } catch (error) {
    console.error("获取用户资料时出错:", error);
  }
};

const getUserDone = (error: any, user: any) => {
  console.log(error);
  console.log(user);
  console.log("获取用户资料" + (!error ? "成功" : "失败"));

  if (!error) {
    state.messageList = state.messageList.map((item: any, i: number) => {
      const userId =
        `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userInfo?.user.id}` ===
        item.to
          ? item.lastMsg.from
          : item.to;
      if (userId === user?.account) {
        item.avatar = user?.avatar;
        item.nick = user?.nick;
        if (user?.custom) {
          item.custom = JSON?.parse(user?.custom);
        }
        if (item?.localCustom) {
          try {
            item.localCustom = JSON.parse(item.localCustom);
          } catch (err) {
            console.warn(err);
          }
        }
      }
      return item;
    });
  }
};

const { fetchData, data, loading } = callrecordlist();

const getList = async () => {
  await fetchData({
    offset: state.offset,
  });
  if (data.value) {
    state.offset += data.value.list.length;
    state.finished = !data.value.hasMore;
    state.callList = [...state.callList, ...data.value.list];
  }
};

const TabbarRef = ref<any>();

const handleClear = () => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  nim.deleteAllLocalMsgs({
    // id: idArr,
    done: deleteLocalSessionDone,
  });

  function deleteLocalSessionDone(error: any, obj: any) {
    console.log(error);
    console.log(obj);
    console.log("删除本地会话" + (!error ? "成功" : "失败"));
    if (!error) {
      closeToast();
      TabbarRef.value.state.badge = 0;
      state.messageList = [];
      localStorage.removeItem("wsMsgArr");
    }
  }

  closeToast();
};

const handleChatRoom = (item: any) => {
  if (loadingSkeleton.value) return;
  router.push({
    name: "ChatRoom",
    query: {
      user: JSON.stringify(item),
      type: "formMsgList",
    },
  });
  // 假如存在自定义字段进去会话前要清0未读数;
  if (item?.localCustom) {
    nim.getLocalSession({
      sessionId: item.id,
      done: (error: any, session: any) => {
        console.log(error);
        console.log(session);
        console.log("获取本地会话" + (!error ? "成功" : "失败"));
        const obj = JSON.parse(session.localCustom);
        obj.unread = 0;
        nim.updateLocalSession({
          localCustom: JSON.stringify(obj),
          id: item.id,
          done: (err: any, obj: any) => {
            console.log(`output->错误`, err);
            console.log(`output->更新的会话结构`, obj);
          },
        });
        // 记录当前进入房间的id
        const currentObj = {
          userId: removeSubstrings(item.lastMsg.from),
          time: new Date().getTime(),
        };
        localStorage.setItem("currentChatRoomObj", JSON.stringify(currentObj));
      },
    });
  }
  const topNotificationObj = {
    userId: removeSubstrings(item.lastMsg.from),
    time: new Date().getTime(),
  };
  localStorage.setItem("topNotification", JSON.stringify(topNotificationObj));
  // nim.resetSessionUnread(item.id);
};

const handleClick = (index: number) => {
  tabsList.forEach((item: any, i: number) => {
    if (i === index) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
  active.value = index;
};
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none !important;
}

.bigBoxs {
  // padding-bottom: 100px;
  background-color: #241213;
  position: relative;
  .siginImg {
    position: absolute;
    bottom: 200px;
    right: 0px;
    width: 168px;
    height: 169px;
    z-index: 10;
  }
  .tabsBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    margin-bottom: 42px;
    padding-left: 32px;
    padding-right: 32px;
    position: sticky;
    top: 0;
    z-index: 18;
    background-color: #241213;

    .tabsBoxLeft {
      display: flex;
      align-items: center;

      .tabs {
        font-family: "Inter", sans-serif;
        font-weight: bold;
        font-size: 36px;
        color: #c7c4cc;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      .activeTabs {
        font-family: "Inter", sans-serif;
        font-weight: bold;
        font-size: 44px;
        color: #eb6300;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .line {
          width: 100%;
          min-height: 4px;
          background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
          border-radius: 4px 4px 4px 4px;
          margin-top: 8px;
        }
      }

      .activeTabs:nth-child(2) {
        margin-left: 40px;
        margin-right: 40px;
      }

      .tabs:nth-child(2) {
        margin-left: 40px;
        margin-right: 40px;
      }
    }

    .deleteImg {
      width: 48px;
      height: 48px;
    }
    .noticeImg {
      width: 48px;
      height: 48px;
      margin-right: 30px;
    }
  }

  .scollTop {
    display: flex;
    align-items: center;
    overflow-x: scroll;
    height: 140px;
    padding-left: 28px;
    padding-right: 28px;
    gap: 14px;
    flex-shrink: 0;

    .userItem {
      min-width: 101px;
      max-width: 101px;
      height: 101px;
      border: 2px solid #ff4d42;
      opacity: 0.7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .userItemImg {
        border-radius: 50%;
        width: 92px;
        height: 92px;
      }
    }

    .userItemNone {
      min-width: 101px;
      max-width: 101px;
      height: 101px;
      opacity: 0.7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .userItemImg {
        border-radius: 50%;
        width: 92px;
        height: 92px;
      }
    }

    .noticeTopImg {
      min-width: 108px;
      max-width: 108px;
      height: 108px;
      border-radius: 50%;
      margin-right: 32px;
    }
  }
  .liveBoxBig {
    overflow: hidden;
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;
    .liveBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 168px;
      border-bottom: 2px dashed #566b88;
      width: 100%;
      .liveBoxLeft {
        display: flex;
        align-items: center;
        .liveBoxLeftImg {
          background-image: url(./assets/1@2x.webp);
          background-size: 100% 100%;
          // background-size: cover;
          width: 112px;
          height: 112px;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .liveNums {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #ff0000;
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #ffffff;
            line-height: 32px;
            text-align: center;
            position: absolute;
            right: 0;
            top: -10px;
          }
        }
        .liveBoxLeftFont {
          margin-left: 20px;
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 32px;
          color: #eb6300;
        }
      }
      .liveBoxRight {
        display: flex;
        align-items: center;
        .liveBoxRightImg {
          min-width: 84px;
          max-width: 84px;
          height: 84px;
          margin-left: -23px;
        }
      }
    }
  }
  .noticeTopBoxBig {
    overflow: hidden;
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;

    .noticeTopBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 168px;
      border-bottom: 2px dashed #566b88;
      width: 100%;

      .noticeTopImg {
        min-width: 108px;
        max-width: 108px;
        height: 108px;
        border-radius: 50%;
        margin-right: 32px;
      }

      .noticeTopBoxRight {
        width: 100%;

        .noticeTopBoxRightTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          width: 100%;

          .noticeTopBoxRightTopLeft {
            font-family: "SF Pro Display", sans-serif;
            font-weight: bold;
            font-size: 36px;
            color: #fff;
          }

          .noticeTopBoxRightTopRight {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 28px;
            color: #91a3bd;
          }
        }

        .noticeTopBoxRightBottom {
          width: 556px;
          height: 34px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #91a3bd;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .noticeTopBoxRightBottomFlex {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .noticeTopBoxRightBottomFlexFont {
            width: 504px;
            height: 34px;
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 28px;
            color: #404040;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .nums {
            // padding: 2px 15px 2px 15px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            line-height: 40px;
            text-align: center;
            background: #ff4d42;
            border: 2px solid #ffffff;
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #ffffff;
          }

          .numsPlus {
            width: 64px;
            height: 32px;
            background: #ff4d42;
            border-radius: 20px 20px 20px 20px;
            border: 2px solid #ffffff;
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .eyeBig {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 168px;
      border-bottom: 2px dashed #566b88;
      width: 100%;

      .eyesLeft {
        display: flex;
        align-items: center;

        .eyesImg {
          min-width: 104px;
          height: 104px;
        }

        .eyesFont {
          margin-left: 24px;

          .eyesFontOne {
            font-family: "SF Pro Display", sans-serif;
            font-weight: bold;
            font-size: 34px;
            color: #fff;
            margin-bottom: 18px;
          }

          .eyesFontTwo {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 30px;
            color: #91a3bd;
          }
        }
      }

      .eyesRight {
        position: relative;

        .eyesRightImg {
          width: 158px;
          height: 88px;
        }

        .dian {
          position: absolute;
          top: 0;
          right: 0;
          width: 16px;
          height: 16px;
          background: #ea1c00;
          border-radius: 50%;
        }
      }
    }
  }

  .msgBigOverflow {
    height: calc(100vh - 610px);
    overflow-y: scroll;
    padding-bottom: 100px;

    .noticeTopBoxBigMsg {
      transform: translateZ(0);
      overflow: hidden;
      display: flex;
      align-items: center;
      padding-left: 32px;
      padding-right: 32px;
      width: 100%;

      .noticeTopBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 168px;
        border-bottom: 2px dashed #566b88;
        width: 100%;

        .noticeTopImg {
          min-width: 108px;
          max-width: 108px;
          height: 108px;
          border-radius: 50%;
          margin-right: 32px;
        }

        .noticeTopBoxRight {
          width: 100%;

          .noticeTopBoxRightTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
            width: 100%;

            .noticeTopBoxRightTopLeft {
              font-family: "Inter", sans-serif;
              font-weight: normal;
              font-size: 28px;
              color: #fff;
              width: 200px;
              // height: 60px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .noticeTopBoxRightTopRight {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 400;
              font-size: 28px;
              color: #8c8c8c;
            }
          }

          .noticeTopBoxRightBottom {
            width: 556px;
            height: 34px;
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 28px;
            color: #404040;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .noticeTopBoxRightBottomFlex {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .noticeTopBoxRightBottomFlexFont {
              width: 504px;
              height: 34px;
              font-family: "Inter", sans-serif;
              font-weight: 400;
              font-size: 28px;
              color: #91a3bd;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .nums {
              // padding: 2px 15px 2px 15px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              line-height: 40px;
              text-align: center;
              background: #ff4d42;
              border: 2px solid #ffffff;
              font-family: "SF Pro Display", sans-serif;
              font-weight: 400;
              font-size: 24px;
              color: #ffffff;
            }

            .numsPlus {
              width: 64px;
              height: 32px;
              background: #ff4d42;
              border-radius: 20px 20px 20px 20px;
              border: 2px solid #ffffff;
              font-family: "SF Pro Display", sans-serif;
              font-weight: 400;
              font-size: 24px;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

      .eyeBig {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 168px;
        border-bottom: 2px dashed #566b88;
        width: 100%;

        .eyesLeft {
          display: flex;
          align-items: center;

          .eyesImg {
            min-width: 104px;
            height: 104px;
          }

          .eyesFont {
            margin-left: 24px;

            .eyesFontOne {
              font-family: "SF Pro Display", sans-serif;
              font-weight: bold;
              font-size: 34px;
              color: #1a1a1a;
              margin-bottom: 18px;
            }

            .eyesFontTwo {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 400;
              font-size: 30px;
              color: #8c8c8c;
            }
          }
        }

        .eyesRight {
          position: relative;

          .eyesRightImg {
            width: 158px;
            height: 88px;
          }

          .dian {
            position: absolute;
            top: 0;
            right: 0;
            width: 16px;
            height: 16px;
            background: #ea1c00;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .callBigBox {
    height: 168px;
    background-color: #241213;
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 32px;

    .callBoxItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 168px;
      border-bottom: 2px dashed #566b88;
      width: 100%;

      .callBoxItemLeft {
        display: flex;
        align-items: center;

        .callBoxItemLeftImg {
          border-radius: 50%;
          min-width: 108px;
          max-width: 108px;
          height: 108px;
          margin-right: 32px;
        }

        .callContent {
          .callContentTop {
            width: 260px;
            height: 42px;
            font-weight: bold;
            font-size: 36px;
            color: #fff;
            font-family: "SF Pro Display", sans-serif;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 8px;
          }

          .callContentTime {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 28px;
            color: #00d88a;
            margin-bottom: 8px;
          }

          .callContentBottom {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 28px;
            color: #91a3bd;
          }
        }
      }

      .caozuo {
        width: 88px;
        height: 88px;

        border-radius: 50%;
        background-color: #f9577e;
      }

      .callBoxItemRight {
        width: 80px;
        height: 80px;
      }
    }
  }
}

.freeFont {
  width: 120px;
  height: 43px;
  background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
  border-radius: 90px 90px 90px 90px;
  border: 3px solid #f7ff5a;
  font-family: "SF Pro Display", sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #ffffff;
  line-height: 43px;
  text-align: center;
}
</style>
