<template>
  <div class="bigBox">
    <van-nav-bar
      title=""
      left-text=""
      fixed
      :border="false"
      style="background-color: #2c1a1a; color: #fff"
    >
      <template #title>
        <div class="flex items-center">
          <div class="topTitle">Notification</div>
          <img src="./assets/ic_sysmess@2x.png" class="topImg" />
        </div>
      </template>
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#ffffff"
          @click="
            () => {
              router.go(-1);
            }
          "
        />
      </template>
    </van-nav-bar>
    <van-tabs
      v-model:active="active"
      title-active-color="#FF4D42"
      title-inactive-color="#8C8C8C"
      :sticky="false"
      color="#FF4D42"
      background="#241213"
    >
      <van-tab title="Interaction">
        <div class="bigBoxs">
          <van-pull-refresh
            v-model="loading"
            @refresh="
              () => {
                state.lastUpdatedAt = '';
                state.list = [];
                getListLeft(1);
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
              @load="getListLeft(1)"
            >
              <div
                class="callBigBox"
                v-for="(item, index) in state.list"
                :key="index"
              >
                <div
                  class="callBoxItem"
                  @click="
                    router.push({
                      name: 'AnchorDetail',
                      query: { id: item.userId },
                    })
                  "
                >
                  <div class="callBoxItemLeft">
                    <van-image
                      round
                      fit="cover"
                      radius="50"
                      :src="
                        item?.users?.[0]?.avatar
                          ? item?.users?.[0]?.avatar
                          : NoticeImg
                      "
                      class="callBoxItemLeftImg"
                      lazy-load
                    ></van-image>
                    <div class="callContent">
                      <div class="callContentTop">
                        {{ item?.users?.[0]?.nickname }}
                      </div>
                      <div class="callContentBottom">
                        <div class="callContentBottomOne">
                          {{ item.content }}
                        </div>
                      </div>
                      <div class="callContentBottomTwo">
                        {{ item.updatedAt }}
                      </div>
                    </div>
                  </div>
                  <div class="callBoxItemRight">
                    <!-- <div class="callBoxItemRightBtn">Follow</div> -->
                    <!-- <img
                      src="./assets/互动类型@2x (1).png"
                      class="callBoxItemRightImg"
                    /> -->
                  </div>
                </div>
              </div>
              <Empty v-if="!state.list.length"> </Empty>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab title="Notice">
        <van-pull-refresh
          v-model="loading"
          @refresh="
            () => {
              state.lastUpdatedAt = '';
              state.notiflist = [];
              getListRight(3);
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
            :finished="state.noticeFinished"
            finished-text="Noting More"
            loading-text="Loading..."
            @load="getListRight(3)"
          >
            <div class="noticeBig">
              <div
                class="noticeItem"
                v-for="(item, index) in state.notiflist"
                :key="index"
              >
                <van-image
                  round
                  fit="cover"
                  radius="50"
                  lazy-load
                  :src="NoticeImg"
                  alt=""
                  class="hostImg"
                ></van-image>
                <div>
                  <div class="noticeContent">
                    {{ item.content }}
                  </div>
                  <div class="noticeContentBottom">
                    <div
                      class="noticeContentBottomLeft"
                      @click="handleTranslate(item)"
                    >
                      <img src="./assets/Slice130@2x.webp" class="noticeImg" />
                      <div class="text">See translation</div>
                    </div>
                    <div class="noticeContentBottomRight">
                      {{ item.updatedAt }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Empty v-if="!state.notiflist.length"> </Empty>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Empty from "@/components/Empty.vue";
import { notiflist, datatranslate } from "@/api/allApi";
import NoticeImg from "./assets/Group14000.webp";
import { showLoadingToast, showToast } from "vant";
import { getFilterData } from "@/common/utils";

const router = useRouter();

const state = reactive<any>({
  list: [],
  finished: true,
  noticeFinished: true,
  notiflist: [],
});

onMounted(() => {
  getListLeft(1);
  getListRight(3);
});

const { fetchData, data, loading } = notiflist();

const getListLeft = async (type: number) => {
  await fetchData(
    getFilterData({
      tab: type,
      lastUpdatedAt:
        active.value === 0
          ? state.list[state.list.length - 1]?.updatedAt
          : state.notiflist[state.notiflist.length - 1]?.updatedAt,
    })
  );
  if (data.value.list.length > 0) {
    state.finished = !data.value.hasMore;
    state.list = [...state.list, ...data.value.list];
  }
};

const getListRight = async (type: number) => {
  await fetchData(
    getFilterData({
      tab: type,
      lastUpdatedAt:
        active.value === 0
          ? state.list[state.list.length - 1]?.updatedAt
          : state.notiflist[state.notiflist.length - 1]?.updatedAt,
    })
  );
  if (data.value.list.length > 0) {
    state.noticeFinished = !data.value.hasMore;
    state.notiflist = [...state.notiflist, ...data.value.list];
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
    text: item.content,
  });
  if (translateSuccess.value) {
    showToast("Success");
    item.content = translateData.value.text;
  } else {
    showToast(translateMsg.value);
  }
};

const active = ref(0);
</script>
<style lang="scss" scoped>
.bigBox {
  padding-top: 90px;
  .topTitle {
    font-family: "SF Pro Text", sans-serif;
    font-weight: 600;
    font-size: 34px;
    color: #fff;
  }
  .topImg {
    width: 40px;
    height: 40px;
    margin-left: 8px;
  }
  .bigBoxs {
    padding-top: 30px;
    .callBigBox {
      //   height: 168px;
      // background: #ffffff;
      display: flex;
      align-items: center;
      padding-left: 32px;
      padding-right: 32px;
      .callBoxItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 168px;
        border-bottom: 2px dashed #566b88;
        width: 100%;
        padding-bottom: 10px;
        margin-bottom: 20px;
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
              font-family: "SF Pro Display", sans-serif;
              font-weight: bold;
              font-size: 36px;
              color: #fff;
              margin-bottom: 8px;
            }
            .callContentBottom {
              display: flex;
              align-items: center;
              .callContentBottomOne {
                font-family: "SF Pro Display", sans-serif;
                font-weight: 400;
                font-size: 28px;
                color: #eb6300;
                // width: 300px;
              }
              //   .callContentBottomTwo {
              //     font-family: "SF Pro Display", sans-serif;
              //     font-weight: 400;
              //     font-size: 28px;
              //     color: #8c8c8c;
              //     margin-left: 20px;
              //   }
            }
            .callContentBottomTwo {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 400;
              font-size: 28px;
              color: #8c8c8c;
            }
          }
        }
        .callBoxItemRight {
          display: flex;
          align-items: center;
          .callBoxItemRightBtn {
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
            margin-right: 32px;
          }
          .callBoxItemRightImg {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
  }
  .noticeBig {
    padding-top: 40px;
    padding-left: 32px;
    padding-right: 32px;
    // background-color: #f8f8f8;
    min-height: 100vh;
    .noticeItem {
      display: flex;
      margin-bottom: 20px;
      .hostImg {
        min-width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .noticeContent {
        padding: 24px;
        margin-left: 16px;
        background: #fff5ed;
        border-radius: 20px 20px 20px 20px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #344054;
      }
      .noticeContentBottom {
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .noticeContentBottomLeft {
          display: flex;
          align-items: center;
          .noticeImg {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }
          .text {
            font-family: "Inter", sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #ffcaa3;
          }
        }
        .noticeContentBottomRight {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #8c8c8c;
        }
      }
    }
  }
}
</style>
