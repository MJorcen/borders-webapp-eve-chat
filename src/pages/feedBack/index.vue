<template>
  <div class="feedBack">
    <van-nav-bar title="" left-text="FeedBack" fixed :border="false">
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
    <div class="titleOne"><span class="text-[#EA1C00]">* </span>content</div>
    <div class="textBig">
      <div class="textBox">
        <textarea
          class="textarea"
          v-model="state.text"
          maxlength="200"
        ></textarea>
        <div class="textRight">{{ state.text.length }}/200</div>
      </div>
    </div>
    <div class="titleOne"><span class="text-[#EA1C00]">* </span>Email</div>
    <div class="textBig">
      <div class="textBox2">
        <input v-model="state.email" class="textarea" />
      </div>
    </div>
    <div class="titleOne" style="padding-top: 0px">Upload picture</div>
    <div class="uploadBox">
      <van-uploader
        @delete="handleDelete"
        accept="image/*"
        class="upload"
        v-model="state.fileList"
        multiple
        :after-read="afterRead"
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
import { fileupload, settingfeedback } from "@/api/allApi";
import { generateRandomString } from "@/common/utils";
import { showLoadingToast, showToast } from "vant";

const state = reactive<any>({
  text: "",
  fileList: [],
  fileIds: [],
  email: "",
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
  };
  await uploadFetch({
    files: JSON.stringify([filesObg]),
    // scene: route.query.type === "Report" ? "complaint" : "post",
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
  fetchData: complaintFetch,
  msg: complaintMsg,
  success: complaintSuccess,
} = settingfeedback();

const handleSubmit = async () => {
  if (state.text.trim() === "" || state.email.trim() === "") {
    showToast("Please fill in the required fields");
    return;
  }
  const arr: any = [];
  state.fileList.forEach((item: any) => {
    arr.push(item.id);
  });

  await complaintFetch({
    content: state.text,
    fileIds: arr.join(","),
    email: state.email,
  });

  if (complaintSuccess.value) {
    showToast("Success");
    router.go(-1);
  } else {
    showToast(complaintMsg.value);
  }
};
</script>
<style lang="scss" scoped>
.feedBack {
  padding-top: 50px;
  .titleOne {
    padding-top: 50px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 600;
    font-size: 32px;
    color: #1a1a1a;
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
        color: #1a1a1a;
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
    .textBox2 {
      border-bottom: 1px solid #f3f3f3;
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
      background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
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
}
</style>
