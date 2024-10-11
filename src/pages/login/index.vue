<template>
  <div class="bigBox">
    <van-nav-bar
      title="Fill your information"
      left-text=""
      fixed
      :border="false"
    >
    </van-nav-bar>
    <div class="contBox">
      <!-- <van-uploader :after-read="afterRead">
        <div class="imgBox">
          <img
            v-if="fileObj?.content === ''"
            src="./assets/uppro_img@2x.png"
            alt=""
            class="upLoadClass"
          />
          <img
            v-if="fileObj?.content !== ''"
            :src="fileObj?.content"
            alt=""
            class="upLoadClass"
          />
          <img
            v-if="fileObj?.content !== ''"
            src="./assets/Frame 19288@2x.png"
            alt=""
            class="editIcon"
          />
        </div>
      </van-uploader> -->
      <div class="imgBox">
        <img src="./assets/Avatar@2x.png" alt="" class="upLoadClass" />
      </div>
    </div>
    <div class="inputBoxBig">
      <div class="inputBox">
        <div class="inputBoxLeft">Nickname</div>
        <input
          class="inputClass"
          v-model="state.nickname"
          placeholder="Enter your nickname"
        />
      </div>
    </div>
    <!-- || fileObj?.content === '' -->
    <div
      @click="handleLogin"
      :class="state.nickname === '' ? 'btnBox' : 'btnActiveBox'"
    >
      Done
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  logindevice,
  fileupload,
  deviceactivate,
  userfillInfo,
} from "@/api/allApi";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { closeToast, showLoadingToast, showToast } from "vant";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { generateRandomString } from "@/common/utils";
import { useUserStore } from "@/stores/user";
import { useImHook } from "@/hook/useIm";
import { useUserDetailStore } from "@/stores/userDetail";
import randomData from "@/common/randomName";

const state = reactive({
  nickname: "",
  img: "",
});

console.log(`output->`, randomData.randomNickArr);

const fileObj = ref<any>({
  content: "",
});

const { fetchData, msg, success, data } = logindevice();

const { setUser } = useUserStore();

const { setUser: setUserDetail }: any = useUserDetailStore();

let deviceId = "";

onMounted(() => {
  const deviceIdCookie = Cookies.get("deviceId");

  if (!deviceIdCookie) {
    deviceId = uuidv4();

    Cookies.set("deviceId", deviceId, { expires: 365 });
  } else {
    deviceId = deviceIdCookie;
  }
  state.nickname = generateRandomNameWithNumber();
});

const nicknames = randomData.randomNickArr;

// 生成随机名字和三个随机数字
function generateRandomNameWithNumber() {
  // 随机选择一个名字
  const randomName = nicknames[Math.floor(Math.random() * nicknames.length)];

  // 生成三个随机数字
  const randomNumbers = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  // 返回结果
  return `${randomName}${randomNumbers}`;
}

const {
  fetchData: uploadFetch,
  msg: uploadMsg,
  success: uploadSuccess,
  data: upploadData,
} = fileupload();

const afterRead = async (file: any) => {
  console.log(file, "qqqq");
  fileObj.value = file;
};

const {
  fetchData: activateFetch,
  msg: activateMsg,
  success: activateSuccess,
} = deviceactivate();

const {
  fetchData: userFetch,
  msg: userMsg,
  success: userSuccess,
} = userfillInfo();

const router = useRouter();

// 登录
const handleLogin = async () => {
  // 使用 fetch API 请求一个公开的 IP 地理位置服务
  await fetch("https://ipapi.co/json/")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.country_code_iso3); // 输出国家代码，如 'USA'
      console.log(data.country_calling_code); // 输出国家拨号代码，如 '1'
      console.log(data.country_name); // 输出国家名称，如 'United States'
      localStorage.setItem("region", data.country_code_iso3);
      localStorage.setItem("country", data.country);
    })
    .catch(function (error) {
      console.log("Error fetching API: ", error);
    });

  // if (state.nickname === "" || fileObj.value.content === "") {
  //   closeToast();
  //   showToast("Please fill in all required information");
  //   return;
  // }

  if (state.nickname === "") {
    showToast("Please fill in all required information");
    return;
  }

  showLoadingToast({
    message: "Loding...",
    forbidClick: true,
    duration: 0,
  });

  localStorage.clear();
  // localStorage.removeItem("userInfo");
  // localStorage.removeItem("user");

  sessionStorage.clear();

  await activateFetch({
    brand: "XIAOMI",
    model: "MI 10",
    userAgent: "cs",
    androidId: "123456",
  });
  if (activateSuccess.value) {
    await fetchData({ deviceId: deviceId });
    if (success.value) {
      // localStorage.setItem("userInfo", JSON.stringify(data.value));
      localStorage.setItem("web_token", data.value.token);

      // const md532Str = generateRandomString();
      // const filesObg = {
      //   name: fileObj.value.file.name,
      //   size: fileObj.value.file.size,
      //   md5: md532Str,
      //   width: 100,
      //   height: 100,
      // };
      // await uploadFetch({
      //   files: JSON.stringify([filesObg]),
      //   scene: "avatar",
      // });
      // const xhr = new XMLHttpRequest();
      // xhr.open("PUT", upploadData.value.list[0].token);

      // xhr.onerror = (evt) => {
      //   showToast("文件上传失败");
      // };

      // xhr.send(fileObj.value.file);
      // if (uploadSuccess.value) {
      await userFetch({
        nickname: state.nickname,
        gender: "M",
        // avatarFileId: upploadData.value.list[0].id,
        birthDate: dayjs().format("YYYY-MM-DD"),
      });
      if (userSuccess.value) {
        showToast("Success");
        // closeToast();
        router.push({ name: "HostList" });
        setUser(data.value);
        setUserDetail(data.value);
        useImHook();
      } else {
        if (userMsg.value === "User existed") {
          router.push({ name: "HostList" });
          useImHook();
        }
        // showToast(userMsg.value);
      }
      // } else {
      //   showToast(uploadMsg.value);
      // }
    } else {
      showToast(msg.value);
    }
  } else {
    showToast(activateMsg.value);
  }
};
</script>
<style lang="scss" scoped>
.contBox {
  //   height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 184px;
  margin-bottom: 120px;
  .imgBox {
    position: relative;
    .upLoadClass {
      width: 240px;
      height: 240px;
      border-radius: 50%;
    }
    .editIcon {
      position: absolute;
      width: 72px;
      height: 72px;
      bottom: 0px;
      right: 0px;
    }
  }
}
.inputBoxBig {
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 160px;
  .inputBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    width: 100%;
    border-bottom: 1px solid grey;

    .inputBoxLeft {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 600;
      font-size: 32px;
      color: #1a1a1a;
    }
    .inputClass {
      text-align: right;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 40px;
      color: #1a1a1a;
      width: 100%;
    }
    .inputClass::placeholder {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 40px;
      color: #cccccc;
    }
  }
}
.btnBox {
  margin-left: 156px;
  margin-right: 156px;
  height: 100px;
  background: #f2f2f2;
  border-radius: 16px 16px 16px 16px;
  font-family: "SF Pro Display", sans-serif;
  font-weight: 500;
  font-size: 40px;
  color: #ff4d42;
  line-height: 100px;
  text-align: center;
}
.btnActiveBox {
  margin-left: 156px;
  margin-right: 156px;
  height: 100px;
  background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
  border-radius: 16px 16px 16px 16px;
  font-family: "SF Pro Display", sans-serif;
  font-weight: 500;
  font-size: 40px;
  color: #fff;
  line-height: 100px;
  text-align: center;
}
</style>
