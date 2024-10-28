<template>
  <div class="bigBox">
    <van-nav-bar title="Detail" left-text="" fixed :border="false">
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#000000"
          @click="
            () => {
              router.go(-1);
            }
          "
        />
      </template>
    </van-nav-bar>
    <div class="bigBoxs">
      <van-pull-refresh v-model="loading" @refresh="handleRefresh">
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
          @load="getList()"
        >
          <div
            class="callBigBox"
            v-for="(item, index) in state.list"
            :key="index"
          >
            <div class="callBoxItem">
              <div class="callBoxItemLeft">
                <div class="callContent">
                  <div class="callContentTop">{{ item.title }}</div>
                  <div class="callContentBottom">
                    <div class="callContentBottomOne">
                      {{ item.desc }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="callBoxItemRight">
                <div class="callBoxItemRightOne">
                  {{ item.createdAt }}
                </div>
                <div class="callBoxItemRightOne" style="color: #fe5243">
                  {{ item.amount }}
                </div>
              </div>
            </div>
          </div>
          <Empty v-if="!state.list.length"> </Empty>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Empty from "@/components/Empty.vue";
import { walletloggold } from "@/api/allApi";

const router = useRouter();

const state = reactive<any>({
  offset: 0,
  list: [],
  finished: true,
});

const { fetchData, data, loading } = walletloggold();

onMounted(() => {
  getList();
});

const handleRefresh = () => {
  state.offset = 0;
  state.list = [];
  state.finished = true;

  getList();
};

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
.bigBox {
  padding-top: 100px;
  .callBigBox {
    //   height: 168px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 32px;
    .callBoxItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // height: 168px;
      border-bottom: 2px solid #f5f5f5;
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
            color: #1a1a1a;
            margin-bottom: 8px;
          }
          .callContentBottom {
            display: flex;
            align-items: center;
            .callContentBottomOne {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 400;
              font-size: 28px;
              color: #404040;
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
        .callBoxItemRightOne {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #8c8c8c;
          margin-bottom: 9px;
          text-align: right;
        }
      }
    }
  }
}
</style>
