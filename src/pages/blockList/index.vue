<template>
  <div class="bigBox">
    <van-nav-bar
      style="background-color: #2c1a1a; color: #ffffff"
      title="Block List"
      left-text=""
      fixed
      :border="false"
    >
      <template #left>
        <van-icon
          @click="router.go(-1)"
          name="arrow-left"
          size="18"
          color="#fff"
        />
      </template>
    </van-nav-bar>
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
        @load="getList"
      >
        <div
          class="callBigBox"
          v-for="(item, index) in state.list"
          :key="index"
        >
          <div class="callBoxItem">
            <div class="callBoxItemLeft">
              <van-image
                round
                fit="cover"
                radius="50"
                :src="item?.avatar"
                class="callBoxItemLeftImg"
                lazy-load
              ></van-image>
              <div class="callContent">
                <div class="callContentTop">{{ item?.nickname }}</div>
                <div class="callContentTime">ID:{{ item.id }}</div>
              </div>
            </div>
            <!-- <div @click="handleUnBlock(item.id)" class="callBoxItemRight">
              Unblock
            </div> -->
            <img
              @click="handleUnBlock(item.id)"
              src="./assets/removeBlock.webp"
              style="width: 35px; height: 35px; cursor: pointer"
            />
          </div>
        </div>
        <Empty v-if="!state.list.length"> </Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import Empty from "@/components/Empty.vue";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";

import { userblocklist, userblockno } from "@/api/allApi";
import { showLoadingToast, showToast } from "vant";

const router = useRouter();

const state = reactive<any>({
  list: [],
  offset: 0,
  finished: true,
});

onMounted(() => {
  getList();
});

const { fetchData, data, loading } = userblocklist();

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
  fetchData: fetchDataNo,
  msg: fetchDataNoMsg,
  success: fetchDataNoSuccess,
} = userblockno();

const handleUnBlock = async (id: number) => {
  showLoadingToast({
    duration: 0,
    mask: true,
    message: "Plesase wait...",
  });
  await fetchDataNo({
    toUserId: id || 123,
    scene: "黑名单",
  });
  if (fetchDataNoSuccess.value) {
    showToast("Success");
    state.offset = 0;
    getList();
  } else {
    showToast(fetchDataNoMsg.value);
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
.bigBox {
  padding-top: 80px;
  .callBigBox {
    height: 168px;
    background: #241213;
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
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #eb6300;
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
        width: 138px;
        height: 50px;
        background: linear-gradient(90deg, #8f48ff 0%, #e405ff 100%);
        border-radius: 24px 24px 24px 24px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 28px;
        color: #ffffff;
        line-height: 50px;
        text-align: center;
      }
    }
  }
}
</style>
