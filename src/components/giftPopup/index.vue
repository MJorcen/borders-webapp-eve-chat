<template>
  <van-popup
    v-model:show="props.modelValue"
    position="bottom"
    round
    @click-overlay="emit('update:modelValue', false)"
  >
    <div class="giftPopup">
      <van-swipe class="my-swipe" indicator-color="white">
        <van-swipe-item v-for="(rowItems, rowIndex) in list">
          <div class="swipeBox">
            <div
              :class="item.isAcitve ? 'giftItemActive' : 'giftItem'"
              v-for="(item, index) in rowItems"
              :key="index"
              @click="handleChose(item, rowIndex, index)"
            >
              <van-image :src="item.icon" alt="" class="giftImg" lazy-load />
              <div class="giftBottom">
                <img
                  src="./assets/coin_300@2x.png"
                  alt=""
                  class="giftGoldImg"
                />
                <div class="giftNums">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="giftBottomBox">
        <div class="giftBottomBoxLeft">
          <img
            src="./assets/coin_300@2x.png"
            alt=""
            class="giftBottomBoxLeftImg"
          />
          <div class="giftBottomBoxLeftNums">
            {{ walletData?.wallet?.gold }}
          </div>
          <van-icon name="arrow" color="#fff" size="16px" />
        </div>
        <div class="giftBottomBoxRight" @click.stop="handleGive">Give</div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { giftlist, userwallet } from "@/api/allApi";
import { useRoute } from "vue-router";

interface Prop {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});

const emit = defineEmits(["update:modelValue", "handleGive"]);

const { fetchData: giftFetch, data: giftData } = giftlist();
const { fetchData: wollectFetch, data: walletData } = userwallet();

const route = useRoute();

// onMounted(() => {
//   if (route.name !== "Login") {
//     getGiftList();
//     wollectFetch();
//   }
// });

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      getGiftList();
      wollectFetch();
    }
  }
);

const getGiftList = async () => {
  await giftFetch();
  splitItems();
};

const list = ref<any>([]);

// 每行显示的元素数量
const itemsPerRow = 8;

// 计算分割后的数据
const splitItems = () => {
  const result = [];
  for (let i = 0; i < giftData?.value?.list?.length; i += itemsPerRow) {
    result.push(giftData?.value?.list?.slice(i, i + itemsPerRow));
  }
  list.value = result;
  // return result;
};

const handleChose = (item: any, outIndex: number, index: number) => {
  list.value = list.value.map((it: any, inx: number) => {
    if (inx === outIndex) {
      it.map((it2: any, inx2: number) => {
        if (inx2 === index) {
          it2.isAcitve = true;
        } else {
          it2.isAcitve = false;
        }
      });
    }
    return it;
  });
};

const handleGive = () => {
  const filteredList: any = [];
  list.value.forEach((it: any) => {
    it.forEach((it2: any) => {
      if (it2.isAcitve) {
        filteredList.push(it2);
      }
    });
  });

  console.log(`output->`, filteredList);
  emit("handleGive", filteredList[0] || {});
};
defineExpose({
  wollectFetch,
});
</script>
<style lang="scss" scoped>
.giftPopup {
  width: 100%;
  height: 648px;
  background: linear-gradient(135deg, #3d0400 0%, #15001e 100%);
  border-radius: 24px 24px 0px 0px;
  padding: 40px 16px 0px 16px;
  .swipeBox {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    // justify-content: space-between;
    padding-bottom: 50px;
    .giftItem {
      width: 172px;
      height: 200px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 16px 16px 16px 16px;
      // border: 2px solid #ff4d42;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding-top: 16px;
      .giftImg {
        width: 132px;
        height: 132px;
        margin-bottom: 10px;
      }
      .giftBottom {
        display: flex;
        align-items: center;
        .giftGoldImg {
          width: 32px;
          height: 32px;
          margin-right: 4px;
        }
        .giftNums {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 500;
          font-size: 20px;
          color: #ffffff;
        }
      }
    }
    .giftItemActive {
      width: 172px;
      height: 200px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 16px 16px 16px 16px;
      border: 2px solid #ff4d42;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding-top: 16px;
      .giftImg {
        width: 132px;
        height: 132px;
        margin-bottom: 10px;
      }
      .giftBottom {
        display: flex;
        align-items: center;
        .giftGoldImg {
          width: 32px;
          height: 32px;
          margin-right: 4px;
        }
        .giftNums {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 500;
          font-size: 20px;
          color: #ffffff;
        }
      }
    }
  }
  .giftBottomBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .giftBottomBoxLeft {
      display: flex;
      align-items: center;
      padding-left: 32px;
      .giftBottomBoxLeftImg {
        width: 40px;
        height: 40px;
        margin-right: 4px;
      }
      .giftBottomBoxLeftNums {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 600;
        font-size: 28px;
        color: #ffffff;
        margin-right: 4px;
      }
    }
    .giftBottomBoxRight {
      width: 160px;
      height: 64px;
      background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
      border-radius: 32px 32px 32px 32px;
      margin-right: 16px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 600;
      font-size: 32px;
      color: #ffffff;
      line-height: 64px;
      text-align: center;
    }
  }
}
</style>
