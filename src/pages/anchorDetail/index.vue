<template>
  <div
    class="bigBox"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <van-icon
      name="arrow-left"
      class="backBtn"
      color="white"
      size="30"
      @click.stop="router.go(-1)"
    />
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
            height="600"
            width="100%"
            lazy-load
            @click.stop="
              () => {
                showImagePreview([rowItems.image]);
              }
            "
          ></van-image>
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
    </div>
    <div class="contentBox">
      <div class="topContent">
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
        <div
          v-if="data?.user?.liked === 0"
          @click.stop="handleFollow"
          class="followBox"
        >
          Follow
        </div>
        <div v-else @click.stop="handleCancelFollow" class="followBoxUn">
          UnFollow
        </div>
      </div>
      <div class="nameBox">
        <div class="name">{{ data?.user?.nickname }}</div>
        <img :src="getCountryImg(data?.user)" class="coutry" alt="" />
      </div>
      <div class="idBox">
        <div class="yuan" v-if="data?.user?.onDuty"></div>
        <div class="yuanFont" v-if="data?.user?.onDuty">Online</div>
        <div class="idFont" @click="handleCopy(data?.user?.id)">
          ID:{{ data?.user?.id }}
        </div>
        <img src="./assets/ic_copyid@2x.png" class="copyIdImg" />
      </div>
      <div class="msgBox">
        <div class="msgItem">
          <img class="msgImg" src="./assets/ic_gender@2x.png" />
          <div class="msgItemRight">
            <div class="msgItemRightOne">Gender</div>
            <div class="msgItemRightTwo">Female</div>
          </div>
        </div>
        <div class="msgItem" style="background-color: #f4edff">
          <img class="msgImg" src="./assets/ic_age@2x.png" />
          <div class="msgItemRight">
            <div class="msgItemRightOne" style="color: #a25afc">Age</div>
            <div class="msgItemRightTwo" style="color: #a25afc">
              {{ data?.user?.age }}
            </div>
          </div>
        </div>
        <div class="msgItem" style="background-color: #edf6ff">
          <img class="msgImg" src="./assets/ic_followers@2x.png" />
          <div class="msgItemRight">
            <div class="msgItemRightOne" style="color: #708ffb">Followers</div>
            <div class="msgItemRightTwo" style="color: #708ffb">
              {{ data?.user?.fansCount }}
            </div>
          </div>
        </div>
      </div>
      <div class="BioFont">Bio</div>
      <div class="BioFont2" v-html="data?.user?.intro"></div>
      <div class="momentBox">
        <div class="momentBoxLeft">Moment</div>
        <van-icon
          @click="
            router.push({
              name: 'UserDynamicList',
              query: { id: data?.user?.id },
            })
          "
          name="arrow"
          color="#cccccc"
          size="24"
        />
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
      <div class="ProfileFont">Profile</div>
      <div class="ProfileBox">
        <div class="ProfileItem">
          <img src="./assets/Frame@2x.png" class="ProfileItemImg" />
          <div class="ProfileItemFont">{{ data?.user?.height || 165 }}cm</div>
        </div>
        <div class="ProfileItem">
          <img src="./assets/Frame@2x (1).png" class="ProfileItemImg" />
          <div class="ProfileItemFont">{{ data?.user?.weight || 60 }}kg</div>
        </div>
        <div
          class="ProfileItem"
          v-if="data?.user?.job !== '' && data?.user?.job"
        >
          <img src="./assets/Frame@2x (2).png" class="ProfileItemImg" />
          <div class="ProfileItemFont">{{ data?.user?.job }}</div>
        </div>
        <div class="ProfileItem">
          <img src="./assets/Frame@2x (3).png" class="ProfileItemImg" />
          <div class="ProfileItemFont">{{ data?.user?.tags || "Single" }}</div>
        </div>
        <div
          class="ProfileItem"
          v-if="data?.user?.relationship !== '' && data?.user?.relationship"
        >
          <img src="./assets/Frame@2x (4).png" class="ProfileItemImg" />
          <div class="ProfileItemFont">{{ data?.user?.relationship }}</div>
        </div>
      </div>
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
    <div class="bottomBox">
      <img
        src="./assets/按钮@2x.png"
        class="bottomBoxLeftImg"
        @click.stop="
          () => {
            router.push({
              name: 'ChatRoom',
              query: { user: JSON.stringify(data?.user) },
            });
          }
        "
      />
      <div class="bottomBoxRight" @click.stop="handleGo(data)">
        <img src="./assets/ic_call_video@2x.png" class="bottomBoxRightImg" />
        <img src="./assets/coin_300@2x.png" class="bottomBoxRightImgGold" />
        <div class="nums">
          {{
            user?.user?.vipLevel === 0
              ? data?.user?.videoCallPrice
              : data?.user?.videoCallVipPrice
          }}/min
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import {
  userdetail,
  userfollow,
  userreceiveStats,
  postuser,
  userunfollow,
} from "@/api/allApi";
import { useRoute, useRouter } from "vue-router";
import { showImagePreview, showLoadingToast, showToast } from "vant";
import { useUserDetailStore } from "@/stores/userDetail";
import { handleGo } from "@/common/fetchCommon";

onMounted(() => {
  getUserDetail();
  getReciveGifs();
  nextTick(() => {
    window.scroll({ top: 0 });
  });
});

const swipeRef = ref(null);

const router = useRouter();

const startX = ref(0);
const startY = ref(0);

const handleTouchStart = (event) => {
  startX.value = event.touches[0].clientX;
  startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
  // 防止默认行为，避免页面滚动
  event.preventDefault();
};

const handleTouchEnd = (event) => {
  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;
  const swipeDistance = endX - startX.value;

  // 判断是否为左滑手势
  if (swipeDistance > 50 && Math.abs(endY - startY.value) < 50) {
    router.back();
  }
};

const { fetchData, data } = userdetail();

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
    `../../../public/ic_contry_${item?.region?.toLowerCase()}.webp`,
    import.meta.url
  );
  const defaultImg: any = new URL(
    `../../../public/ic_contry_ind.webp`,
    import.meta.url
  );

  if (regions.includes(item?.region?.toLowerCase())) {
    return path;
  } else {
    return defaultImg;
  }
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
  position: relative;
  .backBtn {
    position: absolute;
    top: 20px;
    left: 18px;
    z-index: 20;
  }
  .swiperBox {
    width: 100%;
    height: 1100px;
    position: relative;
    .ovllowBox {
      position: absolute;
      bottom: 80px;
      left: 324px;
      width: 400px;
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
  }
  .contentBox {
    width: 100%;

    margin-top: -20px;
    z-index: 20;
    background: #fff;
    border-radius: 24px 24px 0px 0px;
    .topContent {
      border-radius: 24px 24px 0px 0px;
      width: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      padding-top: 40px;
      margin-bottom: 20px;
      .imgClass {
        width: 160px;
        height: 160px;
      }
      .followBox {
        position: absolute;
        top: 96px;
        right: 40px;
        width: 116px;
        height: 48px;
        background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
        border-radius: 24px 24px 24px 24px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 28px;
        color: #ffffff;
        line-height: 48px;
        text-align: center;
      }
      .followBoxUn {
        position: absolute;
        top: 96px;
        right: 40px;
        width: 140px;
        height: 48px;
        background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
        border-radius: 24px 24px 24px 24px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 28px;
        color: #ffffff;
        line-height: 48px;
        text-align: center;
      }
    }
    .nameBox {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      background: #fff;
      width: 100%;
      .name {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 40px;
        color: #000000;
        margin-right: 8px;
      }
      .coutry {
        width: 48px;
        height: 48px;
      }
    }
    .idBox {
      display: flex;
      align-items: center;
      justify-content: center;
      .yuan {
        width: 12px;
        height: 12px;
        background: #00d88a;
        border-radius: 50%;
        margin-right: 8px;
      }
      .yuanFont {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 400;
        font-size: 24px;
        color: #1a1a1a;
        margin-right: 20px;
      }
      .idFont {
        font-family: "SF Pro Text", sans-serif;
        font-weight: 400;
        font-size: 24px;
        color: #8c8c8c;
        margin-right: 8px;
      }
      .copyIdImg {
        width: 32px;
        height: 32px;
      }
    }
    .msgBox {
      margin-top: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      .msgItem {
        width: 160px;
        height: 80px;
        background: #feedff;
        border-radius: 16px 16px 16px 16px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        padding-left: 16px;
        // padding-right: 16px;
        margin-right: 16px;
        .msgImg {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
        .msgItemRight {
          .msgItemRightOne {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #e04cf8;
          }
          .msgItemRightTwo {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #e04cf8;
          }
        }
      }
    }
    .BioFont {
      margin-top: 28px;
      margin-bottom: 26px;
      padding-left: 32px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 36px;
      color: #000000;
    }
    .BioFont2 {
      padding-left: 32px;
      padding-right: 23px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #1a1a1a;
      line-height: 33px;
      margin-bottom: 40px;
    }
    .momentBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 32px;
      padding-right: 32px;
      margin-bottom: 24px;
      .momentBoxLeft {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 36px;
        color: #000000;
      }
    }
    .momentBoxFlex {
      width: 100%;
      overflow-x: auto;
      display: flex;
      padding-left: 32px;
      margin-bottom: 48px;
      .momentBoxFlexImg {
        width: 200px;
        height: 200px;
        border-radius: 16px 16px 16px 16px;
        flex-shrink: 0;
        margin-right: 20px;
      }
    }
    .ProfileFont {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 36px;
      color: #000000;
      margin-bottom: 6px;
      padding-left: 32px;
    }
    .ProfileBox {
      padding-left: 32px;

      display: flex;
      flex-wrap: wrap;
      .ProfileItem {
        padding: 16px;
        margin-right: 20px;
        background: #f8f8f8;
        border-radius: 16px 16px 16px 16px;
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
    .GiftsFont {
      margin-bottom: 6px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 36px;
      color: #000000;
      padding-left: 32px;
    }
    .giftBox {
      display: flex;
      flex-wrap: wrap;
      padding-left: 32px;
      //   padding-right: 32px;
      margin-bottom: 140px;
      .giftBoxItem {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 16px;
        margin-bottom: 20px;
        .giftBoxItemImg {
          width: 160px;
          height: 160px;
          margin-bottom: 8px;
        }
        .giftBoxItemFont {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #1a1a1a;
        }
      }
      //   .giftBoxItem:nth-child(4n-1) {
      //     margin-right: 0;
      //   }
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
    .bottomBoxLeftImg {
      width: 226px;
      height: 100px;
    }
    .bottomBoxRight {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 440px;
      height: 100px;
      background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
      border-radius: 16px 16px 16px 16px;
      .bottomBoxRightImg {
        width: 64px;
        height: 64px;
        margin-right: 20px;
      }
      .bottomBoxRightImgGold {
        width: 40px;
        height: 40px;
      }
      .nums {
        font-family: "SF Pro Text", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
      }
    }
  }
}
</style>
