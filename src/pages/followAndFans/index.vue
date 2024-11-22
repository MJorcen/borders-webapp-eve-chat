<template>
  <div class="bigBox">
    <van-nav-bar
      left-text=""
      fixed
      :border="false"
      z-index="20"
      style="background-color: #2c1a1a"
    >
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
      <template #title>
        <div class="tabsBox">
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
      </template>
    </van-nav-bar>
    <div class="w-[100%] h-[50px]"></div>
    <div v-if="active === 0">
      <van-pull-refresh
        v-model="loadingTwo"
        @refresh="
          () => {
            state.offsetTwo = 0;
            state.followList = [];
            getFolowList();
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
          v-if="state.followList.length"
          v-model:loading="loadingTwo"
          :finished="state.finishedTwo"
          finished-text="Nothing More"
          loading-text="Loading..."
          @load="getFolowList()"
        >
          <div
            class="callBigBox"
            v-for="(item, index) in state.followList"
            :key="index"
          >
            <div class="callBoxItem">
              <div class="callBoxItemLeft">
                <img :src="item.avatar" class="callBoxItemLeftImg" />
                <div class="callContent">
                  <div class="callContentTop">{{ item.nickname }}</div>
                  <div class="callContentBottom">ID:{{ item.id }}</div>
                </div>
              </div>
              <!-- <img src="./assets/ic_follow@2x.png" class="w-[58px] h-[25px]" /> -->
            </div>
          </div>
        </van-list>
        <Empty v-if="!state.followList.length" />
      </van-pull-refresh>
    </div>
    <div v-else>
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
          v-if="state.list.length"
        >
          <div
            class="callBigBox"
            v-for="(item, index) in state.list"
            :key="index"
          >
            <div class="callBoxItem">
              <div class="callBoxItemLeft">
                <img :src="item.avatar" class="callBoxItemLeftImg" />

                <div class="callContent">
                  <div class="callContentTop">{{ item.nickname }}</div>
                  <div class="callContentBottom">ID:{{ item.id }}</div>
                </div>
              </div>
              <!-- <img src="./assets/ic_follow@2x.png" class="w-[58px] h-[25px]" /> -->
            </div>
          </div>
        </van-list>
        <Empty v-if="!state.list.length" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { userfollowfansList, userfollowfollowingList } from "@/api/allApi";
import { useRoute, useRouter } from "vue-router";
import Empty from "@/components/Empty.vue";

const active = ref(0);

const router = useRouter();

const route = useRoute();

const tabsList: any = reactive([
  { title: "Follow", active: true },
  { title: "Followers", active: false },
]);

const state = reactive<any>({
  offset: 0,
  finished: true,
  list: [],
  finishedTwo: false,
  offsetTwo: 0,
  followList: [],
});

const { fetchData, data, loading } = userfollowfansList();

const {
  fetchData: fetchFollowList,
  data: followList,
  loading: loadingTwo,
} = userfollowfollowingList();

onMounted(() => {
  if (Number(route.query.type) === 1) {
    handleClick(0);
  } else {
    handleClick(1);
  }
  getList();
  getFolowList();
});

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

const getFolowList = async () => {
  await fetchFollowList({
    offset: state.offsetTwo,
  });
  if (data.value) {
    state.offsetTwo += followList.value.list.length;
    state.finishedTwo = !followList.value.hasMore;
    state.followList = [...state.followList, ...followList.value.list];
  }
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
.tabsBox {
  display: flex;
  align-items: center;
  .tabs {
    font-family: "SF Pro Display", sans-serif;
    font-weight: bold;
    font-size: 40px;
    color: #aaaaaa;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .activeTabs {
    font-family: "SF Pro Display", sans-serif;
    font-weight: bold;
    font-size: 40px;
    color: #ff4d42;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .line {
      width: 80px;
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
      width: 80px;
      height: 80px;
    }
  }
}
</style>
