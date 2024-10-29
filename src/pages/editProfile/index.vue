<template>
  <div class="bigBox">
    <van-nav-bar
      style="background-color: #2c1a1a; color: #fff"
      title="Edit Profile"
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
      <template #right>
        <div class="rightBtn" @click="handleSave">Save</div>
      </template>
    </van-nav-bar>
    <div class="container">
      <div class="containerTop">
        <div class="containerTopLeft">Profile Photo</div>
        <van-uploader :after-read="afterRead">
          <img
            v-if="data?.user?.avatar === ''"
            src="./assets/Component 4@2x.png"
            class="containerTopRight"
            alt=""
          />
          <img v-else :src="state.form.avatar" class="containerTopRight" />
        </van-uploader>
      </div>
      <div class="containerTop2">
        <div class="containerTop2Left">Nickname</div>
        <div class="containerTop2Right">
          <input v-model="state.form.nickname" class="inputClass" />
          <van-icon
            v-if="state.form.nickname !== ''"
            name="cross"
            size="18"
            color="#ebebeb"
            class="iconClass"
            @click="state.form.nickname = ''"
          />
        </div>
      </div>
      <div class="containerTop2">
        <div class="containerTop2Left">Gender</div>
        <div class="containerTop2Right">Male</div>
      </div>
      <div class="containerTop3">
        <div class="containerTop3Ttile">Bio</div>
        <textarea
          class="textarea"
          v-model="state.form.bio"
          maxlength="200"
        ></textarea>
      </div>
      <div class="uploadBox">
        <div class="uploadBoxTitle">Photo</div>
        <van-uploader
          @delete="handleDelete"
          accept="image/*"
          class="upload"
          v-model="state.fileList"
          :after-read="afterReadPhoto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  userDetail,
  fileupload,
  userPost,
  useralbum,
  useralbumdelete,
  useralbumpost,
} from "@/api/allApi";
import { generateRandomString, getFilterData } from "@/common/utils";
import { closeToast, showLoadingToast, showToast } from "vant";

const router = useRouter();

const { fetchData, data } = userDetail();

const { fetchData: albumFetch, data: albumData } = useralbum();

const {
  fetchData: albumFetchPost,
  msg: albumMsgPost,
  success: albumSuccessPost,
  data: albumDataPostData,
} = useralbumpost();

const {
  fetchData: albumFetchDelete,
  msg: albumMsg,
  success: albumSuccess,
} = useralbumdelete();

const state = reactive<any>({
  form: {
    nickname: "",
    avatar: "",
    bio: "",
    avatarFileId: "",
  },
  fileList: [],
});

onMounted(async () => {
  getUserDetail();
  await albumFetch();
  state.fileList = albumData?.value?.images?.map((item: any) => {
    item.url = item.image;
    return item;
  });
});

const getUserDetail = async () => {
  await fetchData();
  state.form.nickname = data.value.user?.nickname;
  state.form.avatar = data?.value.user?.avatar;
  state.form.bio = data?.value.user?.intro;
};

const {
  fetchData: uploadFetch,
  msg: uploadMsg,
  success: uploadSuccess,
  data: upploadData,
} = fileupload();

const afterRead = async (file: any) => {
  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });
  const md532Str = generateRandomString();

  const filesObg = {
    name: file.file.name,
    size: file.file.size,
    md5: md532Str,
    width: 100,
    height: 100,
  };
  await uploadFetch({
    files: JSON.stringify([filesObg]),
    scene: "avatar",
  });
  if (uploadSuccess.value) {
    state.form.avatar = file.content;
    state.form.avatarFileId = upploadData.value.list[0].id;
    closeToast();
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", upploadData.value.list[0].token);

    xhr.onerror = (evt) => {
      showToast("文件上传失败");
    };

    xhr.send(file.file);
  }
};

const { fetchData: userFetch, msg: userMsg, success: userSuccess } = userPost();

const handleSave = async () => {
  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });
  await userFetch(
    getFilterData({
      nickname: state.form.nickname,
      // gender: "M",
      // birthDate: dayjs().format("YYYY-MM-DD"),
      avatarFileId: state.form.avatarFileId,
      intro: state.form.bio,
    })
  );
  if (userSuccess.value) {
    showToast({
      message: "Save successfully",
      type: "success",
      duration: 1000,
    });
  } else {
    showToast({
      message: userMsg.value,
    });
  }
};

const handleDelete = async (file: any) => {
  showLoadingToast({
    message: "Deleting...",
    duration: 0,
    forbidClick: true,
  });
  await albumFetchDelete({
    imageId: file.id,
  });
  if (albumSuccess.value) {
    showToast("Success");
    state.fileList = state.fileList.filter((item: any) => item.id !== file.id);
  } else {
    showToast(albumMsg.value);
  }
};

const afterReadPhoto = async (file: any) => {
  showLoadingToast({
    message: "Uploading...",
    forbidClick: true,
    duration: 0,
  });
  const md532Str = generateRandomString();
  const filesObg = {
    name: file.file.name,
    size: file.file.size,
    md5: md532Str,
    width: 100,
    height: 100,
    duration: 0,
  };
  await uploadFetch({
    files: JSON.stringify([filesObg]),
    scene: "album",
  });
  if (uploadSuccess.value) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", upploadData.value.list[0].token);

    xhr.onerror = (evt) => {
      showToast("文件上传失败");
    };

    xhr.send(file.file);
    await albumFetchPost({
      fileId: upploadData.value.list[0].id,
    });
    if (albumSuccessPost.value) {
      state.fileList = state.fileList.map((item: any) => {
        if (item.content === file.content) {
          item.id = albumDataPostData.value.id;
        }
        return item;
      });
    } else {
      showToast(albumMsgPost.value);
    }

    // state.fileIds.push(upploadData.value.list[0].id);
    showToast("Success");
  } else {
    showToast(uploadMsg.value);
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
.rightBtn {
  width: 96px;
  height: 50px;
  background: #eb6300;
  // background: linear-gradient(90deg, #fa882d 0%, #ff4393 99%);
  border-radius: 24px 24px 24px 24px;
  font-family: "SF Pro Display", sans-serif;
  font-weight: bold;
  font-size: 28px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 88px;
  .containerTop {
    height: 200px;
    width: 100%;
    border-bottom: 1px dashed#566B88;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .containerTopLeft {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 600;
      font-size: 32px;
      color: #fff;
    }
    .containerTopRight {
      width: 160px;
      height: 160px;
    }
  }
  .containerTop2 {
    height: 120px;
    width: 100%;
    border-bottom: 1px dashed#566B88;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .containerTop2Left {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 600;
      font-size: 32px;
      color: #fff;
    }
    .containerTop2Right {
      display: flex;
      align-items: center;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #fff;
      .inputClass {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #fff;
        text-align: right;
        background: none;
      }
      .iconClass {
        margin-left: 24px;
      }
    }
  }
  .containerTop3 {
    // height: 120px;
    padding-top: 20px;
    width: 100%;
    border-bottom: 1px dashed#566B88;
    .containerTop3Ttile {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 600;
      font-size: 32px;
      color: #fff;
    }
    .textarea {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 26px;
      color: #fff;
      background: none;
    }
  }
  .uploadBox {
    // padding-left: 32px;
    padding-top: 20px;
    .uploadBoxTitle {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 600;
      font-size: 32px;
      color: #1a1a1a;
    }
  }
}
</style>
