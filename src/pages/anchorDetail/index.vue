<template>
  <div class="bigBox">
    <img
      @click.stop="router.go(-1)"
      src="./assets/Slice90@2x.webp"
      class="backBtn"
    />
    <img
      src="./assets/Slice91@2x.webp"
      class="sandian"
      @click.stop="state.showPopup = true"
    />
    <van-skeleton
      avatar
      :avatar-size="400"
      avatar-shape="square"
      :loading="loading"
    >
      <div class="swiperBox">
        <van-swipe
          ref="swipeRef"
          class="my-swipe"
          :autoplay="3000"
          :show-indicators="false"
          @change="onChange"
        >
          <van-swipe-item v-for="(rowItems, rowIndex) in data?.images">
            <van-image
              fit="cover"
              :src="rowItems?.image"
              height="400"
              width="100%"
              lazy-load
              @click.stop="
                () => {
                  showImagePreview([rowItems.image]);
                }
              "
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </van-swipe-item>
        </van-swipe>
        <div class="ovllowBox">
          <van-image
            v-for="(rowItems, rowIndex) in data?.images"
            fit="cover"
            radius="5px"
            :src="rowItems?.image"
            :class="swipeIndex === rowIndex ? 'ovllowImgActive' : 'ovllowImg'"
            @click.stop="swipeRef.swipeTo(rowIndex)"
          ></van-image>
        </div>

        <img
          class="followImg"
          src="./assets/Group1000004619@2x.webp"
          v-if="data?.user?.liked === 0"
          @click.stop="handleFollow"
        />
        <img
          @click.stop="handleCancelFollow"
          class="followImg"
          src="./assets/Group21000004619@2x.webp"
          v-else
        />
      </div>
    </van-skeleton>

    <div class="contentBox">
      <div class="infoBox">
        <div class="infoBoxTop">
          <div class="infoBoxTopLeft">
            <div class="infoBoxTopLeftTop">
              <div class="name">
                {{ data?.user?.nickname }}
              </div>
              <div
                class="yuan"
                v-if="data?.user?.inCall === 0 && data?.user?.active === 1"
              ></div>
              <div class="yuan2" v-if="data?.user?.active === 0"></div>
              <div
                class="yuan3"
                v-if="data?.user?.inCall === 1 && data?.user?.active === 1"
              ></div>
              <div
                class="online"
                v-if="data?.user?.inCall === 0 && data?.user?.active === 1"
              >
                Online
              </div>
              <div class="onlineOff" v-if="data?.user?.active === 0">
                Offline
              </div>
              <div
                class="online"
                style="color: #f1db15"
                v-if="data?.user?.inCall === 1 && data?.user?.active === 1"
              >
                Busy
              </div>
            </div>
            <div class="infoBoxTopLeftBottom">
              <img
                src="./assets/Group863@2x.webp"
                class="infoBoxTopLeftBottomImg"
              />
              <div class="infoBoxTopLeftBottomFont">{{ data?.user?.id }}</div>
              <img
                src="./assets/Slice33@2x.webp"
                class="infoBoxTopLeftBottomImgTwo"
                @click="handleCopy(data?.user?.id)"
              />
            </div>
          </div>
          <div class="disPos">
            <van-image
              fit="cover"
              radius="50"
              :src="data?.user?.avatar"
              class="imgClass"
              lazy-load
              @click.stop="
                () => {
                  showImagePreview([data?.user?.avatar]);
                }
              "
            ></van-image>
            <div class="disBox" v-if="data?.user?.distance">
              <img src="./assets/dis2.webp" class="disImg" />
              <div class="disText">
                {{ new BigNumber(data?.user?.distance).div(1000) || 2 }}km
              </div>
            </div>
          </div>
        </div>
        <div class="infoBoxBottom" v-html="data?.user?.intro"></div>
        <div class="infoBottom">
          <div class="infoBottomItem">
            <div class="infoBottomItemTop">Gender</div>
            <div class="infoBottomItemBottom">
              <div class="infoBottomItemBottomFont">Female</div>
              <img
                src="./assets/Vector@2x.webp"
                class="infoBottomItemBottomImg"
              />
            </div>
          </div>
          <img class="shu" src="./assets/Rectangle2117@2x.webp" />
          <div class="infoBottomItem">
            <div class="infoBottomItemTop">Age</div>
            <div class="infoBottomItemBottom">
              <div class="infoBottomItemBottomFont">{{ data?.user?.age }}</div>
            </div>
          </div>
          <img class="shu" src="./assets/Rectangle2117@2x.webp" />
          <div class="infoBottomItem">
            <div class="infoBottomItemTop">Location</div>
            <div class="infoBottomItemBottom">
              <div class="infoBottomItemBottomFont">
                {{ data?.user?.region }}
              </div>
              <img
                style="width: 12px; height: 12px"
                :src="getCountryImg(data?.user)"
                class="coutry"
                alt=""
              />
            </div>
          </div>
          <img class="shu" src="./assets/Rectangle2117@2x.webp" />
          <div class="infoBottomItem">
            <div class="infoBottomItemTop">Followers</div>
            <div class="infoBottomItemBottom">
              <div class="infoBottomItemBottomFont">
                {{ data?.user?.fansCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="momentBoxBig" v-if="postData?.list?.length > 0">
        <div class="momentBox">
          <div class="momentBoxLeft">Moment</div>
          <div
            class="momentBoxRight"
            @click="
              router.push({
                name: 'UserDynamicList',
                query: { id: data?.user?.id },
              })
            "
          >
            More
            <van-icon name="arrow" color="#cccccc" size="12" />
          </div>
        </div>
        <div class="momentBoxFlex">
          <van-image
            v-for="(rowItems, rowIndex) in postData.list"
            fit="cover"
            radius="5px"
            :src="rowItems?.images[0].image"
            class="momentBoxFlexImg"
            @click.stop="
              () => {
                showImagePreview([rowItems?.images[0].image]);
              }
            "
          ></van-image>
        </div>
      </div>
      <div class="ProfileBig">
        <div class="ProfileFont">Profile</div>
        <div class="ProfileBox">
          <div class="ProfileItem" style="background: #331e1a">
            <img src="./assets/Slice87@2x.webp" class="ProfileItemImg" />
            <div class="ProfileItemFont" style="color: #ff6144">
              {{ data?.user?.height || 165 }}cm
            </div>
          </div>
          <div class="ProfileItem" style="background: #322906">
            <img src="./assets/Slice88@2x.webp" class="ProfileItemImg" />
            <div class="ProfileItemFont" style="color: #fa7718">
              {{ data?.user?.weight || 60 }}kg
            </div>
          </div>
          <div
            class="ProfileItem"
            style="background: #0e1f33"
            v-if="data?.user?.job !== '' && data?.user?.job"
          >
            <img src="./assets/Slice116@2x.webp" class="ProfileItemImg" />
            <div style="color: #449aff" class="ProfileItemFont">
              {{ data?.user?.job }}
            </div>
          </div>
          <div
            class="ProfileItem"
            style="background: #120c31"
            v-if="data?.user?.relationship !== '' && data?.user?.relationship"
          >
            <img src="./assets/Slice89@2x.webp" class="ProfileItemImg" />

            <div style="color: #583ef4" class="ProfileItemFont">
              {{ data?.user?.relationship }}
            </div>
          </div>
          <div class="ProfileItem" style="background: #331224">
            <img src="./assets/Slice117@2x.webp" class="ProfileItemImg" />
            <div style="color: #ff58b2" class="ProfileItemFont">
              {{ data?.user?.tags || "Single" }}
            </div>
          </div>
        </div>
      </div>
      <div class="GiftsBig">
        <div class="GiftsFont">Gifts</div>
        <div class="giftBox">
          <div
            class="giftBoxItem"
            v-for="(rowItems, rowIndex) in reciveData?.list"
          >
            <van-image
              fit="cover"
              :src="rowItems?.gift?.icon"
              lazy-load
              class="giftBoxItemImg"
            ></van-image>
            <div class="giftBoxItemFont">x{{ rowItems?.total }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottomBox">
      <div
        class="bottomBoxLeft"
        @click.stop="
          () => {
            handleGo(data).then((res) => {
              if (!res) {
                if (user?.user?.vipLevel === 0) {
                  state.showVipPopup = true;
                } else {
                  state.showRechargePopup = true;
                }
              }
            });
          }
        "
      >
        <div class="noVipBox" v-if="user?.user?.vipLevel === 0">
          <img class="vipIcon" src="./assets/Group1000004778@2x.webp" />
          <img class="caiIcon" src="./assets/Rectangle34625288@2x.webp" />
          <div class="fontFlexBox">
            <div>VIP Only</div>
            <img src="./assets/image10@2x.webp" class="moneyImg" />
            <div>{{ data?.user?.videoCallVipPrice | 0 }}/min</div>
          </div>
        </div>
        <img
          src="./assets/vipImg.webp"
          class="vipimg"
          v-if="user?.user?.vipLevel > 0"
        />
        <SvgaShow
          :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
        ></SvgaShow>
        <div class="bottomBoxLeftBox">
          <div class="bottomBoxLeftBoxTop">video call</div>
          <div class="bottomBoxLeftBoxBottom">
            <img src="./assets/image10@2x.webp" class="moneyImg" />
            <div
              class="bottomBoxLeftBoxBottomFont"
              v-if="user?.user?.vipLevel > 0"
            >
              {{ data?.user?.videoCallPrice || 0 }}
            </div>
            <div class="bottomBoxLeftBoxBottomFontTwo">
              {{
                user?.user?.vipLevel === 0
                  ? data?.user?.videoCallPrice || 0
                  : data?.user?.videoCallVipPrice || 0
              }}/min
            </div>
          </div>
        </div>
      </div>
      <img
        src="./assets/Group1000004749@2x.webp"
        class="bottomBoxLeftImg"
        @click.stop="
          () => {
            router.push({
              name: 'ChatRoom',
              query: { user: JSON.stringify(data?.user) },
            });
            handleCash();
          }
        "
      />
    </div>
  </div>
  <van-action-sheet
    @select="onSelect"
    v-model:show="state.showPopup"
    :actions="state.actions"
    cancel-text="cancel"
    close-on-click-action
    @cancel="state.showPopup = false"
  />
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import {
  userdetail,
  userfollow,
  userreceiveStats,
  postuser,
  userunfollow,
  userblock,
} from "@/api/allApi";
import { useRoute, useRouter } from "vue-router";
import { showImagePreview, showLoadingToast, showToast } from "vant";
import { useUserDetailStore } from "@/stores/userDetail";
import { handleGo } from "@/common/fetchCommon";
import RechargePopup from "@/components/rechargePopup/index.vue";
import SvgaShow from "@/components/svgaShow/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import BigNumber from "bignumber.js";

const { vipConfigData } = useVipConfigStore();

onMounted(() => {
  state.showPopup = false;
  getUserDetail();
  getReciveGifs();
  document.body.style.overflow = "auto";
  nextTick(() => {
    window.scroll({ top: 0 });
  });
});

const state = reactive({
  showRechargePopup: false,
  showPopup: false,
  actions: [
    {
      name: "Report",
    },
    {
      name: "Block",
    },
  ],
  showVipPopup: false,
});
const {
  fetchData: blockFetch,
  msg: blockMsg,
  success: blockSuccess,
} = userblock();
const onSelect = (val: any) => {
  if (val.name === "Report") {
    router.push({
      name: "BlockAndReport",
      query: {
        type: "Report",
        id: route.query.id,
      },
    });
  } else {
    showLoadingToast({
      duration: 0,
      message: "Please wait...",
      forbidClick: true,
    });
    blockFetch({
      toUserId: route.query.id,
    });
    if (blockSuccess.value) {
      showToast("Success");
    } else {
      showToast(blockMsg.value);
    }
  }
  state.showPopup = true;
};

const swipeRef = ref(null);

const router = useRouter();

const startX = ref(0);
const startY = ref(0);

const handleTouchStart = (event: any) => {
  startX.value = event.touches[0].clientX;
  startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event: any) => {
  // 防止默认行为，避免页面滚动
  // event.preventDefault();
};

const handleTouchEnd = (event: any) => {
  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;
  const swipeDistance = endX - startX.value;

  // 判断是否为左滑手势
  if (swipeDistance > 50 && Math.abs(endY - startY.value) < 50) {
    router.back();
  }
};

const { fetchData, data, loading } = userdetail();

const { fetchData: reciveFetch, data: reciveData } = userreceiveStats();

const { fetchData: postFetch, data: postData } = postuser();

const route = useRoute();

const getUserDetail = async () => {
  await fetchData({ id: route.query.id });
  await postFetch({ userId: route.query.id, offset: 0 });
};

const getReciveGifs = async () => {
  await reciveFetch({ userId: route.query.id?.toString() });
};

const { userDetail: user }: any = useUserDetailStore();

const {
  fetchData: followFetch,
  msg: followMsg,
  success: followSuccess,
} = userfollow();

const handleFollow = async () => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await followFetch({
    toUserId: data.value.user.id,
  });
  if (followSuccess.value) {
    showToast("Success");
    getUserDetail();
  } else {
    showToast(followMsg.value);
  }
};

const {
  fetchData: UnFollowFetch,
  msg: UnFollowMsg,
  success: UnFollowSuccess,
} = userunfollow();

const handleCancelFollow = async () => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await UnFollowFetch({
    toUserId: data.value.user.id,
  });
  if (UnFollowSuccess.value) {
    showToast("Success");
    getUserDetail();
  } else {
    showToast(UnFollowMsg.value);
  }
};
const regions = [
  "bgd",
  "bra",
  "col",
  "egy",
  "esp",
  "fra",
  "idn",
  "ind",
  "mar",
  "nga",
  "pak",
  "phl",
  "usa",
  "ven",
  "vnm",
];

const getCountryImg = (item: any) => {
  const path: any = new URL(
    `/public/ic_contry_${item?.region?.toLowerCase()}.webp`,
    import.meta.url
  );
  const defaultImg: any = new URL(
    `/public/ic_contry_ind.webp`,
    import.meta.url
  );

  if (regions.includes(item?.region?.toLowerCase())) {
    return path;
  } else {
    return defaultImg;
  }
};

const handleCash = () => {
  const currentObj = {
    userId: data?.value?.user?.id,
    time: new Date().getTime(),
  };
  localStorage.setItem("currentChatRoomObj", JSON.stringify(currentObj));
  localStorage.setItem("topNotification", JSON.stringify(currentObj));
};

const handleCopy = async (str: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = str;

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand("copy");

  document.body.removeChild(textarea);
  showToast("Success");
};

const swipeIndex = ref(0);

const onChange = (index: number) => {
  swipeIndex.value = index;
};
</script>
<style lang="scss" scoped>
.bigBox {
  min-height: 100%;
  position: relative;
  overflow-x: hidden;
  // padding-bottom: 200px;
  .backBtn {
    position: absolute;
    top: 20px;
    left: 18px;
    z-index: 20;
    width: 104px;
    height: 104px;
  }
  .sandian {
    position: absolute;
    top: 20px;
    right: 18px;
    z-index: 20;
    width: 104px;
    height: 104px;
  }
  .swiperBox {
    width: 100%;
    // height: 972px;
    // height: 500px;
    position: relative;
    .ovllowBox {
      position: absolute;
      bottom: 80px;
      // left: 324px;
      left: 20px;
      // width: 400px;
      width: 90%;
      padding-right: 20px;
      height: 108px;
      overflow-x: auto;
      display: flex;
      //   justify-content: space-around;
      .ovllowImg {
        width: 108px;
        height: 108px;
        flex-shrink: 0;
        border-radius: 13px 13px 13px 13px;
        margin-right: 16px;
      }
      .ovllowImgActive {
        width: 108px;
        height: 108px;
        flex-shrink: 0;
        border-radius: 13px 13px 13px 13px;
        margin-right: 16px;
        border: 4px solid #cccccc;
      }
    }
    .followImg {
      position: absolute;
      bottom: 86px;
      right: 34px;
      width: 140px;
      height: 60px;
    }
  }
  .contentBox {
    margin-top: -28px;
    width: 100%;
    background: #232323;
    padding-top: 42px;
    padding-bottom: 200px;
    .infoBox {
      // height: 420px;
      padding-bottom: 20px;
      background: #000000;
      box-shadow: 0px 8px 50px 0px rgba(33, 37, 41, 0.08);
      border-radius: 50px 50px 50px 50px;
      margin-bottom: 20px;
      .infoBoxTop {
        padding-top: 24px;
        padding-left: 56px;
        padding-right: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .infoBoxTopLeft {
          .infoBoxTopLeftTop {
            display: flex;
            align-items: center;
            .name {
              font-family: "Inter", sans-serif;
              font-weight: 400;
              font-size: 40px;
              color: #ffffff;
              margin-right: 10px;
            }
            .yuan {
              width: 20px;
              height: 20px;
              margin-right: 4px;
              border-radius: 50%;
              background-color: #00e397;
            }
            .yuan2 {
              width: 20px;
              height: 20px;
              margin-right: 4px;
              border-radius: 50%;
              background-color: #c7c4cc;
            }
            .yuan3 {
              width: 20px;
              height: 20px;
              margin-right: 4px;
              border-radius: 50%;
              background-color: #f1db15;
            }
            .online {
              font-family: "Inter", sans-serif;
              font-weight: 500;
              font-size: 20px;
              color: #24e672;
            }
            .onlineOff {
              font-family: "Inter", sans-serif;
              font-weight: 500;
              font-size: 20px;
              color: #c7c4cc;
            }
          }
          .infoBoxTopLeftBottom {
            display: flex;
            align-items: center;
            margin-top: 16px;
            .infoBoxTopLeftBottomImg {
              width: 32px;
              height: 28px;
              margin-right: 10px;
            }
            .infoBoxTopLeftBottomFont {
              margin-right: 10px;
              font-family: "Inter", sans-serif;
              font-weight: 400;
              font-size: 28px;
              color: #c7c4cc;
            }
            .infoBoxTopLeftBottomImgTwo {
              width: 24px;
              height: 24px;
            }
          }
        }
        .disPos {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .imgClass {
            width: 128px;
            height: 128px;
          }
          .disBox {
            position: absolute;
            bottom: -10px;
            // left: 14px;
            // width: 100px;
            padding: 10px;
            height: 32px;
            background: #ffffff;
            border-radius: 28px 28px 28px 28px;
            border: 2px solid #eb6300;
            display: flex;
            align-items: center;
            padding-left: 10px;
            .disImg {
              width: 20px;
              height: 20px;
              margin-right: 4px;
            }
            .disText {
              font-family: "Inter", sans-serif;
              font-weight: 400;
              font-size: 20px;
              color: #eb6300;
            }
          }
        }
      }
      .infoBoxBottom {
        margin-top: 34px;
        padding-left: 68px;
        padding-right: 68px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
        margin-bottom: 72px;
      }
      .infoBottom {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding-left: 56px;
        padding-right: 56px;
        .infoBottomItem {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .infoBottomItemTop {
            font-family: "PingFang SC", sans-serif;
            font-weight: 500;
            font-size: 28px;
            color: #ffffff;
            margin-bottom: 6px;
          }
          .infoBottomItemBottom {
            display: flex;
            align-items: center;
            font-family: "PingFang SC", sans-serif;
            font-weight: 600;
            font-size: 28px;
            color: #c7c4cc;
            .infoBottomItemBottomImg {
              width: 20px;
              height: 20px;
            }
          }
        }
        .shu {
          width: 2px;
          height: 42px;
        }
      }
    }
    .momentBoxBig {
      margin-bottom: 20px;
      padding-left: 44px;
      padding-right: 32px;
      background: #000000;
      box-shadow: 0px 8px 50px 0px rgba(33, 37, 41, 0.08);
      border-radius: 50px 50px 50px 50px;
      padding-top: 34px;
      padding-bottom: 44px;
      .momentBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;
        .momentBoxLeft {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 32px;
          color: #ffffff;
        }
        .momentBoxRight {
          display: flex;
          align-items: center;
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #ffffff;
          display: flex;
          align-items: center;
        }
      }
      .momentBoxFlex {
        width: 100%;
        overflow-x: auto;
        display: flex;
        padding-left: 26px;
        margin-bottom: 48px;
        .momentBoxFlexImg {
          width: 200px;
          height: 200px;
          border-radius: 16px 16px 16px 16px;
          flex-shrink: 0;
          margin-right: 20px;
        }
      }
    }
    .ProfileBig {
      margin-bottom: 20px;
      padding-left: 44px;
      padding-right: 32px;
      background: #000000;
      box-shadow: 0px 8px 50px 0px rgba(33, 37, 41, 0.08);
      border-radius: 50px 50px 50px 50px;
      padding-top: 34px;
      padding-bottom: 44px;
      .ProfileFont {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #ffffff;
        margin-bottom: 22px;
      }
      .ProfileBox {
        // padding-left: 32px;

        display: flex;
        flex-wrap: wrap;
        .ProfileItem {
          padding: 8px;
          margin-right: 20px;
          // background: #f8f8f8;
          border-radius: 56px 56px 56px 56px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          .ProfileItemImg {
            margin-right: 8px;
            width: 40px;
            height: 40px;
          }
          .ProfileItemFont {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 28px;
            color: #1a1a1a;
          }
        }
      }
    }
    .GiftsBig {
      padding-left: 44px;
      padding-right: 32px;
      background: #000000;
      box-shadow: 0px 8px 50px 0px rgba(33, 37, 41, 0.08);
      border-radius: 50px 50px 50px 50px;
      padding-top: 34px;
      padding-bottom: 44px;
      .GiftsFont {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #ffffff;
        margin-bottom: 26px;
      }
      .giftBox {
        display: flex;
        flex-wrap: wrap;
        padding-left: 12px;
        //   padding-right: 32px;
        .giftBoxItem {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-right: 26px;
          margin-bottom: 20px;
          .giftBoxItemImg {
            width: 104px;
            height: 104px;
            margin-bottom: 8px;
          }
          .giftBoxItemFont {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #fff;
          }
        }
        //   .giftBoxItem:nth-child(4n-1) {
        //     margin-right: 0;
        //   }
      }
    }
  }
  .bottomBox {
    position: fixed;
    bottom: 0;
    z-index: 20;
    width: 100%;
    height: 140px;
    border-radius: 0px 0px 0px 0px;
    padding-left: 32px;
    padding-right: 32px;
    display: flex;
    justify-content: space-between;
    .bottomBoxLeft {
      width: 400px;
      height: 100px;
      background: #eb6300;
      border-radius: 1200px 1200px 1200px 1200px;
      position: relative;
      padding-left: 70px;
      display: flex;
      align-items: center;
      .noVipBox {
        background-image: url("./assets/Group1000004508@2x.webp");
        min-width: 336px;
        max-width: 360px;
        height: 108px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0px;
        top: -100px;
        display: flex;
        align-items: center;
        padding-left: 5px;
        .vipIcon {
          width: 64px;
          height: 52px;
        }
        .caiIcon {
          width: 72px;
          height: 60px;
          margin-left: -30px;
        }
        .fontFlexBox {
          margin-left: -30px;
          z-index: 2;
          display: flex;
          align-items: center;
          font-family: "ABeeZee", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #ffffff;
          .moneyImg {
            width: 24px;
            height: 30px;
          }
        }
      }
      .vipimg {
        position: absolute;
        left: 0px;
        top: -30px;
        width: 62px;
        height: 62px;
      }
      .bottomBoxLeftBox {
        margin-left: 24px;
        .bottomBoxLeftBoxTop {
          font-family: "PingFang SC", sans-serif;
          font-weight: 600;
          font-size: 32px;
          color: #ffffff;
        }
        .bottomBoxLeftBoxBottom {
          display: flex;
          align-items: center;
          .moneyImg {
            min-width: 20px;
            max-width: 20px;
            height: 23px;
          }
          .bottomBoxLeftBoxBottomFont {
            margin-left: 12px;
            font-family: "PingFang SC", sans-serif;
            font-weight: 500;
            font-size: 20px;
            color: #cccccc;
            text-decoration: line-through;
          }
          .bottomBoxLeftBoxBottomFontTwo {
            font-family: "PingFang SC", sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #ffffff;
            margin-left: 12px;
          }
        }
      }
    }
    .bottomBoxLeftImg {
      width: 240px;
      height: 100px;
    }
  }
}
</style>
