<template>
  <div class="bigBox">
    <van-nav-bar
      style="background-color: #2c1a1a; color: #ffffff"
      left-text=""
      title="Visitor"
      fixed
      :border="false"
    >
      <template #right>
        <van-icon
          @click="router.back()"
          name="arrow"
          size="18"
          color="#ffffff"
        />
      </template>
    </van-nav-bar>
    <div class="w-[100%] h-[50px]"></div>
    <van-pull-refresh
      v-model="loading"
      @refresh="
        () => {
          state.offset = 0;
          state.list = [];
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
        @load="getList()"
      >
        <div
          class="callBigBox"
          v-for="(item, index) in state.list"
          :key="index"
        >
          <div
            class="callBoxItem"
            @click="
              () => {
                router.push({
                  name: 'AnchorDetail',
                  query: { id: item?.user.id },
                });
              }
            "
          >
            <div class="callBoxItemLeft">
              <img :src="item.user.avatar" class="callBoxItemLeftImg" />
              <div class="callContent">
                <div class="callContentTop">{{ item.user.nickname }}</div>
                <div class="callContentBottom">ID:{{ item.user.id }}</div>
              </div>
            </div>
            <div class="callBoxItemRight">
              <div class="callBoxItemRightOne" style="margin-bottom: 8px">
                {{ item.count }} Visit
              </div>
              <div class="callBoxItemRightOne">{{ item.updatedAt }}</div>
            </div>
          </div>
        </div>
      </van-list>
      <Empty v-if="!state.list.length"> </Empty>
    </van-pull-refresh>
    <Dialog ref="DialogRef">
      <template #modalContent>
        <van-icon
          @click="router.back()"
          class="backIcon"
          name="arrow"
          size="28"
          color="#ffffff"
        />
        <div class="dialogContent">
          <img src="./assets/Frame@2x.png" class="w-[120px] h-[120px]" />
          <div class="dialogFont">Subescribe to Vip and view all visitors</div>
          <div class="dialogBtnBig">
            <div class="dialogBtn" @click="state.showVipPopup = true">
              Get VIP
            </div>
          </div>
        </div>
      </template>
    </Dialog>
    <VipPopup :vipConfg="configData" v-model="state.showVipPopup"></VipPopup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import Dialog from "./components/Dialog.vue";
import { userviewedLog, vipconfig } from "@/api/allApi";
import Empty from "@/components/Empty.vue";
import { useUserDetailStore } from "@/stores/userDetail";
import VipPopup from "@/components/vipPopup/index.vue";
import { useRouter } from "vue-router";

const DialogRef: any = ref(null);

const state = reactive<any>({
  list: [],
  finished: true,
  offset: 0,
  showVipPopup: false,
});

const router = useRouter();

const { userDetail: user }: any = useUserDetailStore();
const { fetchData: configFetch, data: configData } = vipconfig();

onMounted(async () => {
  await configFetch();
  // nextTick(() => {
  if (user.user.vipLevel === 0) {
    DialogRef.value.state.showModal = true;
  } else {
    getList();
  }
  // })
});
const { fetchData, data, loading } = userviewedLog();

const getList = async () => {
  await fetchData({
    offset: state.offset,
  });
  if (data.value) {
    state.offset += data.value.list.length;
    state.finished = !data.value.hasMore;
    state.list = [...state.list, ...data.value.list];
  }
};
</script>
<style lang="scss" scoped>
::v-deep(.van-nav-bar__title) {
  color: #fff !important;
  font-family: "ABeeZee", sans-serif !important;
  font-weight: 400 !important;
  font-size: 40px !important;
}
.callBigBox {
  height: 168px;
  // background: #ffffff;
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
          font-family: "Inter", sans-serif;
          font-weight: normal;
          font-size: 28px;
          color: #fff;
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
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #eb6300;
        }
      }
    }
    .callBoxItemRight {
      .callBoxItemRightOne {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #8c8c8c;
        text-align: right;
      }
    }
  }
}
.backIcon {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 100;
}
.dialogContent {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  .dialogFont {
    position: absolute;
    bottom: 214px;
    width: 100vw;
    text-align: center;
    font-weight: 600;
    font-size: 32px;
    color: #fff;
  }
  .dialogBtnBig {
    width: 100vw;
    padding-left: 32px;
    padding-right: 32px;
    position: absolute;
    bottom: 88px;
    .dialogBtn {
      height: 100px;
      background: #eb6300;
      border-radius: 16px 16px 16px 16px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #ffffff;
      line-height: 100px;
      text-align: center;
    }
  }
}
</style>
