<template>
  <div>
    <van-nav-bar
      style="background-color: #2c1a1a; color: #fff"
      title=""
      left-text=""
      fixed
      :border="false"
    >
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#fff"
          @click="
            () => {
              router.go(-1);
            }
          "
        />
      </template>
    </van-nav-bar>
    <div class="titleOne">
      <span class="text-[#EA1C00]">* </span>Please fill in
    </div>
    <div class="textBig">
      <div class="textBox">
        <textarea
          class="textarea"
          v-model="state.text"
          maxlength="200"
          style="background: none"
        ></textarea>
        <div class="textRight">{{ state.text.length }}/200</div>
      </div>
    </div>
    <div class="titleOne" style="padding-top: 0px">Upload video</div>
    <div class="uploadBox">
      <van-uploader
        @delete="handleDelete"
        accept="video/*"
        class="upload"
        v-model="state.fileList"
        :after-read="afterRead"
        :max-count="1"
      />
    </div>
    <div class="possBig">
      <div @click="handleSubmit" class="possBigBtn">Post</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fileupload, usercomplaint, postDynamic } from "@/api/allApi";
import { generateRandomString } from "@/common/utils";
import { showLoadingToast, showToast } from "vant";

const state = reactive<any>({
  text: "",
  fileList: [],
  fileIds: [],
});

const router = useRouter();

const route = useRoute();

const handleDelete = (file: any) => {
  state.fileList = state.fileList.filter(
    (item: any) => item.content !== file.content
  );
};

const {
  fetchData: uploadFetch,
  msg: uploadMsg,
  success: uploadSuccess,
  data: upploadData,
} = fileupload();

const afterRead = async (file: any) => {
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
    duration: 2500,
  };
  await uploadFetch({
    files: JSON.stringify([filesObg]),
    scene: "post",
  });
  if (uploadSuccess.value) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", upploadData.value.list[0].token);

    xhr.onerror = (evt) => {
      showToast("文件上传失败");
    };

    xhr.send(file.file);

    state.fileList = state.fileList.map((item: any) => {
      if (item.content === file.content) {
        item.id = upploadData.value.list[0].id;
      }
      return item;
    });
    // state.fileIds.push(upploadData.value.list[0].id);
    showToast("Success");
  } else {
    showToast(uploadMsg.value);
  }
};

const {
  fetchData: postDynamicFetch,
  msg: postDynamicMsg,
  success: postDynamicSuccess,
} = postDynamic();

const handleSubmit = async () => {
  if (state.text.trim() === "") {
    showToast("Please fill in the text");
    return;
  }
  showLoadingToast({
    message: "Submitting...",
    forbidClick: true,
    duration: 0,
  });
  const arr: any = [];
  state.fileList.forEach((item: any) => {
    arr.push(item.id);
  });

  await postDynamicFetch({
    uploadFileIds: arr.join(","),
    content: state.text,
  });
  if (postDynamicSuccess.value) {
    showToast("Success");
    router.go(-1);
  } else {
    showToast(postDynamicMsg.value);
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
.titleOne {
  padding-top: 100px;
  font-family: "SF Pro Display", sans-serif;
  font-weight: 600;
  font-size: 32px;
  color: #fff;
  padding-left: 32px;
  margin-bottom: 20px;
}
.textBig {
  padding-left: 32px;
  padding-right: 32px;
  margin-bottom: 40px;
  .textBox {
    min-height: 320px;
    border-bottom: 1px solid #f3f3f3;
    position: relative;
    .textarea {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 26px;
      color: #fff;
      min-height: 320px;
      min-width: 100%;
    }
    .textRight {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #cccccc;
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }
}
.uploadBox {
  padding-left: 32px;
}
.possBig {
  position: fixed;
  bottom: 20px;
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
  .possBigBtn {
    height: 100px;
    background: #eb6300;
    // background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
    border-radius: 16px 16px 16px 16px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    font-size: 40px;
    color: #ffffff;
    line-height: 100px;
    text-align: center;
  }
}
.upload {
  width: 214px;
  height: 214px;
  border-radius: 16px;
}
</style>
