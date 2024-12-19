<template>
  <div class="bigBox">
    <van-tabbar z-index="8" v-model="props.tabsCurrent" :border="false">
      <van-tabbar-item
        v-for="(item, index) in tabsList"
        :key="index"
        @click="handleChange(item, index)"
        :badge="
          item.showBadge && state.badge > 0
            ? state.badge > 99
              ? '99+'
              : state.badge
            : null
        "
      >
        <template #icon>
          <img
            :class="
              index === 1
                ? 'imgClassXin'
                : item?.name === 'Nearby'
                ? 'fujinClass'
                : 'imgClass'
            "
            :src="item.active ? item.activeImg : item.img"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  watch,
  getCurrentInstance,
  onActivated,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import imgMatchActive from "../../assets/imgMatchActive.webp";
import imgMatch from "../../assets/imgMatch.webp";
import img3 from "../../assets/img3.webp";
import img4 from "../../assets/img4.webp";
import img5 from "../../assets/img5.webp";
import img6 from "../../assets/img6.webp";
import img7 from "../../assets/img7.webp";
import img8 from "../../assets/img8.webp";
import img9 from "../../assets/img9.webp";
import img10 from "../../assets/img10.webp";
import evenBus from "@/common/evenBus";
import { useImHook } from "@/hook/useIm";
import { userconfig } from "@/api/allApi";

export interface Props {
  tabsCurrent: number;
  modalValue: number;
}

const props = withDefaults(defineProps<Props>(), {
  tabsCurrent: 0,
  modalValue: 0,
});

const state = reactive<any>({
  badge: 0,
  msgList: [],
});

const emits = defineEmits([
  "onChange",
  "update:tabsCurrent",
  "update:modalValue",
]);

const { nim } = useImHook();

const getLocalSessions = () => {
  return new Promise((resolve, reject) => {
    let arr: any = [];
    nim?.getLocalSessions({
      limit: 100,
      done: getLocalSessionsDone,
    });

    function getLocalSessionsDone(error: any, obj: any) {
      if (!error) {
        arr = obj.sessions.map((item: any) => {
          if (item?.localCustom) {
            try {
              item.localCustom = JSON.parse(item.localCustom);
            } catch (err) {
              console.warn(err);
            }
          }
          return item;
        });
        resolve(arr);
      }
    }
  });
};

evenBus.on("updateonSessions", (data: any) => {
  getLocalSessions().then((res: any) => {
    state.badge = sumUnreadAndLocalCustomUnread(res);
    // if (state.badge > 99) {
    //   state.badge = "99+";
    // }
  });

  // localStorage.setItem("badge", state.badge.toString());
  // emits("update:modalValue", 23);
});

evenBus.on("updateSession", (data: any) => {
  getLocalSessions().then((res: any) => {
    state.badge = sumUnreadAndLocalCustomUnread(res);
  });
});

const sumUnreadAndLocalCustomUnread = (arr: any) => {
  return arr.reduce((accumulator: any, current: any) => {
    const unread = current.unread || 0;

    const localCustomUnread =
      current.localCustom && current.localCustom.unread
        ? current.localCustom.unread
        : 0;

    return accumulator + unread + localCustomUnread;
  }, 0);
};

const router = useRouter();

// let nim: any;

// evenBus.on("setFunc", (data: any) => {
//   nim = data;
// });

const { fetchData: configFetch, data: configData } = userconfig();

onMounted(async () => {
  // await configFetch();

  const currentTab = getCurrentTab();
  getLocalSessions().then((res: any) => {
    state.badge = sumUnreadAndLocalCustomUnread(res);
  });

  emits("update:tabsCurrent", currentTab);

  if (currentTab === 0) {
    tabsList[0].active = true;
    tabsList[1].active = false;
    tabsList[2].active = false;
    tabsList[3].active = false;
    tabsList[4].active = false;
  } else if (currentTab === 2) {
    tabsList[0].active = false;
    tabsList[1].active = false;
    tabsList[2].active = true;
    tabsList[3].active = false;
    tabsList[4].active = false;
  } else if (currentTab === 1) {
    tabsList[0].active = false;
    tabsList[1].active = true;
    tabsList[2].active = false;
    tabsList[3].active = false;
    tabsList[4].active = false;
  } else if (currentTab === 3) {
    tabsList[0].active = false;
    tabsList[1].active = false;
    tabsList[2].active = false;
    tabsList[3].active = true;
    tabsList[4].active = false;
  } else if (currentTab === 4) {
    tabsList[0].active = false;
    tabsList[1].active = false;
    tabsList[2].active = false;
    tabsList[3].active = false;
    tabsList[4].active = true;
  }
});

onActivated(async () => {
  const currentTab = getCurrentTab();

  getLocalSessions().then((res: any) => {
    state.badge = sumUnreadAndLocalCustomUnread(res);
  });

  emits("update:tabsCurrent", currentTab);

  if (currentTab === 0) {
    tabsList[0].active = true;
    tabsList[1].active = false;
    tabsList[2].active = false;
    tabsList[3].active = false;
    tabsList[4].active = false;
  } else if (currentTab === 2) {
    tabsList[0].active = false;
    tabsList[1].active = false;
    tabsList[2].active = true;
    tabsList[3].active = false;
    tabsList[4].active = false;
  } else if (currentTab === 1) {
    tabsList[0].active = false;
    tabsList[1].active = true;
    tabsList[2].active = false;
    tabsList[3].active = false;
    tabsList[4].active = false;
  } else if (currentTab === 3) {
    tabsList[0].active = false;
    tabsList[1].active = false;
    tabsList[2].active = false;
    tabsList[3].active = true;
    tabsList[4].active = false;
  } else if (currentTab === 4) {
    tabsList[0].active = false;
    tabsList[1].active = false;
    tabsList[2].active = false;
    tabsList[3].active = false;
    tabsList[4].active = true;
  }
});

const getCurrentTab = () => {
  switch (router?.currentRoute?.value?.name) {
    case "HostList":
      return 0;
    case "Messages":
      return 3;
    case "Nearby":
      return 2;
    case "MatchNew":
      return 1;
    case "Mine":
      return 4;
  }
};

let tabsList: any = reactive([
  {
    img: img1,
    activeImg: img2,
    active: true,
    name: "HostList",
  },
  {
    img: imgMatch,
    activeImg: imgMatchActive,
    active: false,
    name: "MatchNew",
  },
  {
    img: img9,
    activeImg: img10,
    active: false,
    name: "Nearby",
  },
  {
    img: img5,
    activeImg: img6,
    active: false,
    name: "Messages",
    showBadge: true,
  },
  {
    img: img7,
    activeImg: img8,
    active: false,
    name: "Mine",
  },
]);

const handleChange = (it: any, index: number) => {
  tabsList.map((item: any, i: number) => {
    if (index === i) {
      item.active = true;
    } else {
      item.active = false;
    }
    return item;
  });
  router.push({ name: it.name });
  //   emits("onChange", index);
};

defineExpose({
  state,
});
</script>
<style lang="scss" scoped>
.van-tabbar {
  height: 100px !important;
  background: #241213 !important;
  // border: 4px solid #241213 !important;
  border-top: 2px solid #585050 !important;
}
.van-tabbar-item--active {
  background: #241213 !important;
}
.imgClass {
  width: 50px;
  height: 50px;
}
.imgClassXin {
  width: 60px;
  height: 50px;
}
.fujinClass {
  width: 46px;
  height: 58px;
}
</style>
