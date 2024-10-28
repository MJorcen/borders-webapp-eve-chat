<template>
  <div class="toptop">
    <div class="topBox">Moment</div>
  </div>
  <div class="itemBig">
    <van-pull-refresh
      v-model="loading"
      @refresh="
        () => {
          state.list = [];
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
        finished-text="Noting More"
        loading-text="Loading..."
        @load="getList"
      >
        <div class="itemBox" v-for="(item, index) in state?.list" :key="index">
          <div class="itemBoxTop">
            <div class="itemBoxTopLeft">
              <van-image
                round
                fit="cover"
                radius="50"
                lazy-load
                :src="item.user.avatar"
                alt=""
                class="hostImg"
                @click="
                  router.push({
                    name: 'AnchorDetail',
                    query: { id: item.user.id },
                  })
                "
              ></van-image>
              <div class="name">{{ item.user.nickname }}</div>
              <img :src="getCountryImg(item?.user)" class="countryImg" alt="" />
            </div>
            <div class="itemBoxTopRight">
              <!-- <div
                class="followBtn"
                v-if="item.user.liked === 0"
                @click.stop="handleFollow(item.user)"
              >
                Follow
              </div> -->
              <img
                src="./assets/more-horizontal@2x.png"
                alt=""
                class="moreImg"
                @click="
                  () => {
                    state.blockAndReportId = item.user.id;
                    state.showPopup = true;
                  }
                "
              />
            </div>
          </div>
          <div class="content">
            <!-- <div class="moreClass" v-if="!item?.showMore" @click="">more</div>
            Here is the text.Here is the text.Here is the text.Here is the
            text.Here is the text.Here is the text.Here is the text.Here is the
            text.Here is the text.Here is the text. -->
            <van-text-ellipsis
              rows="2"
              :content="item.post.content"
              expand-text="more"
              collapse-text="close"
            />
          </div>
          <div class="transBox" v-if="item.post.content !== ''">
            <img
              @click="handleTranslate(item)"
              class="transImg"
              src="./assets/icon_translate@2x.png"
            />
            <div @click="handleTranslate(item)" class="transFont">
              See translation
            </div>
          </div>
          <div class="imgFlexBox">
            <van-image
              v-if="item.images?.[0]?.video !== 1"
              fit="cover"
              radius="8"
              class="photoImg"
              v-for="(it, inx) in item.images"
              :key="inx"
              :src="it.image"
              lazy-load
              @click.stop="
                () => {
                  showImagePreview([it.image]);
                }
              "
            >
            </van-image>
            <div v-else style="position: relative">
              <video
                class="videoClass"
                :src="item.images?.[0]?.resourcePath"
                controls
                ref="videoRefDynamic"
              ></video>
              <div
                style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  z-index: 22;
                "
                @click="handlePlayVideo(item.images?.[0]?.resourcePath)"
              ></div>
            </div>
          </div>
          <div class="bottomBox">
            <img
              class="likeImg"
              @click.stop="handleLike(item)"
              src="./assets/like.png"
              v-if="item.liked === 0"
            />
            <img
              v-else
              class="likeImg"
              @click.stop="handleLike(item)"
              src="./assets/likeTrue.png"
            />
            <div class="likeFont" @click.stop="handleLike(item)">
              {{ item.post.likeCount }}
            </div>
            <img
              class="likeImg"
              @click.stop="
                () => {
                  router.push({
                    name: 'ChatRoom',
                    query: { user: JSON.stringify(item.user) },
                  });
                }
              "
              src="./assets/chat.png"
            />
            <div
              class="likeFont"
              @click.stop="
                () => {
                  router.push({
                    name: 'ChatRoom',
                    query: { user: JSON.stringify(item.user) },
                  });
                }
              "
            >
              Chat
            </div>
            <img
              class="likeImg"
              @click.stop="
                () => {
                  handleGo(item).then((res) => {
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
              src="./assets/video.png"
            />
            <div
              class="likeFont"
              @click.stop="
                () => {
                  handleGo(item).then((res) => {
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
              style="margin-right: 0"
            >
              Call
            </div>
          </div>
          <div class="line"></div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
  <van-action-sheet
    @select="onSelect"
    v-model:show="state.showPopup"
    :actions="state.actions"
    cancel-text="cancel"
    close-on-click-action
    @cancel="state.showPopup = false"
  />
  <van-floating-bubble
    axis="xy"
    icon="chat"
    magnetic="x"
    v-model:offset="offsetPover"
    style="background-color: rgba(255, 255, 255, 0); width: 48px; height: 48px"
  >
    <template #default>
      <van-popover
        placement="left-start"
        v-model:show="state.showPopover"
        @select="onSelect"
      >
        <div class="popoverItem" @click.stop="handlePost(1)">
          <img src="./assets/Frame@2x (1).png" class="popoverImg" />
          <div class="text-[16px]">Video</div>
        </div>
        <div class="popoverItem" @click.stop="handlePost(2)">
          <img src="./assets/Frame@2x.png" class="popoverImg" />
          <div class="text-[16px]">Album</div>
        </div>
        <template #reference>
          <img
            v-if="!state.showPopover"
            @click.stop="state.showPopover = true"
            src="./assets/ic_send_2@2x.png"
            alt=""
          />
          <img
            v-else
            @click.stop="state.showPopover = false"
            src="./assets/ic_send_2@2x (1).png"
            alt=""
          />
        </template>
      </van-popover>
    </template>
  </van-floating-bubble>
  <Tabbar></Tabbar>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
</template>

<script lang="ts" setup name="Dynamic">
import Tabbar from "@/components/Tabbar/index.vue";
import { showImagePreview, showLoadingToast, showToast } from "vant";
import { reactive, ref, onMounted, onActivated, onDeactivated } from "vue";
import {
  postrecommendList,
  userfollow,
  postlikepost,
  postlikedelete,
  datatranslate,
  userblock,
} from "@/api/allApi";
import { useRouter } from "vue-router";
import { handleGo } from "@/common/fetchCommon";
import RechargePopup from "@/components/rechargePopup/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import { useUserDetailStore } from "@/stores/userDetail";

const { userDetail: userDetails }: any = useUserDetailStore();

const scrollY = ref<any>(window.pageYOffset);

const { vipConfigData } = useVipConfigStore();

const handleScroll = () => {
  scrollY.value = window.pageYOffset;
};

onActivated(() => {
  state.showPopup = false;
  document.body.style.overflow = "auto";
  window.addEventListener("scroll", handleScroll);
  const scrollY = localStorage.getItem("dynaMicScroll") || 0;
  window.scrollTo({
    top: scrollY,
    behavior: "instant",
  });
});

onDeactivated(() => {
  state.showPopup = false;
  localStorage.setItem("dynaMicScroll", scrollY.value);
  window.removeEventListener("scroll", handleScroll);
});

const offsetPover = ref({
  x: -138,
  y: 600,
});

const state = reactive<any>({
  showPopover: false,
  offset: 0,
  finished: true,
  list: [],
  showPopup: false,
  actions: [
    {
      name: "Report",
    },
    {
      name: "Block",
    },
  ],
  blockAndReportId: "",
  showRechargePopup: false,
  showVipPopup: false,
});

onMounted(() => {
  getList();
  state.showPopup = false;
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
        id: state.blockAndReportId,
      },
    });
  } else {
    showLoadingToast({
      duration: 0,
      message: "Please wait...",
      forbidClick: true,
    });
    blockFetch({
      toUserId: state.blockAndReportId,
    });
    if (blockSuccess.value) {
      showToast("Success");
      // state.showPopup = false;
    } else {
      showToast(blockMsg.value);
    }
  }
  state.showPopup = true;
};

const handlePost = (type: number) => {
  if (type === 1) {
    router.push({
      name: "VideoUploadDynamic",
    });
  } else {
    router.push({
      name: "BlockAndReport",
      query: {
        type: "Post",
      },
    });
  }
};

const router = useRouter();

const { fetchData, data, loading } = postrecommendList();

const getList = async () => {
  await fetchData({
    offset: state.offset,
  });
  if (data.value.list.length > 0) {
    state.offset += data.value.list.length;
    state.finished = !data.value.hasMore;
    state.list = [...state.list, ...data.value.list];
  }
};

const {
  fetchData: translateFetch,
  data: translateData,
  success: translateSuccess,
  msg: translateMsg,
} = datatranslate();

const handleTranslate = async (item: any) => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await translateFetch({
    text: item.post.content,
  });
  if (translateSuccess.value) {
    showToast("Success");
    item.post.content = translateData.value.text;
  } else {
    showToast(translateMsg.value);
  }
};

const {
  fetchData: postFetch,
  msg: postMsg,
  success: postSuccess,
} = postlikepost();

const {
  fetchData: deleteFetch,
  msg: deleteMsg,
  success: deleteSuccess,
} = postlikedelete();

const handleLike = async (item: any) => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  item.liked === 0
    ? await postFetch({ postId: item.post.id })
    : await deleteFetch({ postId: item.post.id });
  if (item.liked === 0 ? postSuccess.value : deleteSuccess.value) {
    showToast("Success");
    // getList();
    item.liked = item.liked === 0 ? 1 : 0;
  } else {
    showToast(item.liked === 0 ? postMsg.value : deleteMsg.value);
  }
};

const {
  fetchData: followFetch,
  msg: followMsg,
  success: followSuccess,
} = userfollow();

const handleFollow = async (item: any) => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await followFetch({
    toUserId: item.id,
  });
  if (followSuccess.value) {
    showToast("Success");
    item.user.liked = 1;
  } else {
    showToast(followMsg.value);
  }
};

const videoRefDynamic = ref<any>();

const handlePlayVideo = (url: String) => {
  let currElement = videoRefDynamic.value[0];
  currElement.src = url;
  if (currElement.requestFullscreen) {
    currElement.requestFullscreen();
  } else if (currElement.mozRequestFullScreen) {
    currElement.mozRequestFullScreen();
  } else if (currElement.msRequestFullscreen) {
    currElement.msRequestFullscreen();
  } else if (currElement.oRequestFullscreen) {
    currElement.oRequestFullscreen();
  } else if (currElement.webkitRequestFullscreen) {
    currElement.webkitRequestFullScreen();
  }
  videoRefDynamic.value.play();
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
</script>
<style scoped lang="scss">
::v-deep(.van-floating-bubble) {
  background-color: red;
}
.topBox {
  background-image: url("./assets/bg.png");
  width: 100%;
  height: 280px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-family: "SF Pro Display", sans-serif;
  font-weight: 800;
  font-size: 48px;
  color: #ff4d42;
  padding-top: 16px;
  padding-left: 32px;
}
.itemBig {
  margin-top: -150px;
  z-index: 1;
  padding-bottom: 150px;
  .itemBox {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    margin-bottom: 20px;
    .itemBoxTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
      .itemBoxTopLeft {
        display: flex;
        align-items: center;
        .hostImg {
          width: 80px;
          height: 80px;
        }
        .name {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 500;
          font-size: 36px;
          color: #000000;
          margin-left: 16px;
        }
        .countryImg {
          width: 40px;
          height: 40px;
          margin-left: 8px;
        }
      }
      .itemBoxTopRight {
        display: flex;
        align-items: center;
        .followBtn {
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
          margin-right: 20px;
        }
        .moreImg {
          width: 48px;
          height: 48px;
        }
      }
    }
    .content {
      padding-left: 96px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #1a1a1a;
      line-height: 33px;
      width: 100%;
      // max-height: 64px;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      // overflow: hidden;
      // position: relative;
      .moreClass {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #0091ff;
        // float: left;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    .activeContent {
      padding-left: 96px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #1a1a1a;
      line-height: 33px;
    }
    .transBox {
      display: flex;
      align-items: center;
      padding-left: 96px;
      max-width: 350px;
      .transImg {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
      .transFont {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 400;
        font-size: 24px;
        color: #ff4d42;
      }
    }
    .imgFlexBox {
      display: flex;
      flex-wrap: wrap;
      padding-left: 96px;
      gap: 16px;
      .photoImg {
        width: 172px;
        height: 172px;
        border-radius: 16px 16px 16px 16px;
      }
      .videoClass {
        width: 272px;
        height: 272px;
        border-radius: 16px 16px 16px 16px;
        object-fit: fill;
      }
    }
    .bottomBox {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 20px;
      .likeImg {
        width: 48px;
        height: 48px;
        margin-right: 8px;
      }
      .likeFont {
        margin-right: 32px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #8c8c8c;
      }
    }
    .line {
      width: 100%;
      height: 2px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 0px 0px 0px 0px;
    }
  }
}
.popoverItem {
  display: flex;
  align-items: center;
  padding: 20px;
  .popoverImg {
    width: 64px;
    height: 64px;
    margin-right: 8px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: #1a1a1a;
  }
}
</style>
