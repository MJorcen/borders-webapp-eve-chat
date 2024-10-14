<!-- <template>
  <div class="bigBox">
    <h4>Local video</h4>
    <h4>Remote video</h4>
    <div id="local-video"></div>
    <div id="remote-video"></div>
    <van-button type="primary" @click="() => handleClick()"
      >Login Room</van-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";

const router = useRouter();

const handleClick = () => {
  // window?.translate?.changeLanguage("spanish");
  // router.push({ name: "Test" });
};

// 项目唯一标识 AppID，Number 类型，请从 ZEGO 控制台获取
let appID = 2113499012;

// 接入服务器地址 Server，String 类型，请从 ZEGO 控制台获取（获取方式请参考上文“前提条件”）
let server = import.meta.env.VITE_APP_WS_SERVER;

// 初始化实例
const zg = new ZegoExpressEngine(appID, server);
zg.setDebugVerbose(false);
// 房间状态更新回调
// 此处在登录房间成功后，立即进行推流。在实现具体业务时，您可选择其他时机进行推流，只要保证当前房间连接状态是连接成功的即可。
// 房间状态更新回调
zg.on("roomStateChanged", async (roomID, reason, errorCode, extendedData) => {
  if (reason == "LOGINED") {
    console.log(
      "与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。"
    );
  }
});

zg.on("roomUserUpdate", (roomID, updateType, userList) => {
  // 其他用户进出房间的通知
});

zg.on(
  "roomStreamUpdate",
  async (roomID, updateType, streamList, extendedData) => {
    // 房间内其他用户音视频流变化的通知
    if (updateType == "ADD") {
      // 流新增，开始拉流
      // 此处演示拉取流新增的列表中第一条流的音视频
      const streamID = streamList[0].streamID;
      // streamList 中有对应流的 streamID
      const remoteStream = await zg.startPlayingStream(streamID);
      // 创建媒体流播放组件
      const remoteView = zg.createRemoteStreamView(remoteStream);
      remoteView.play("remote-video", { enableAutoplayDialog: true });
    } else if (updateType == "DELETE") {
      // 流删除，通过流删除列表 streamList 中每个流的 streamID 进行停止拉流。
      const streamID = streamList[0].streamID;
      zg.stopPlayingStream(streamID);
    }
  }
);

// 登录房间，成功则返回 true
// userUpdate 设置为 true 才能收到 roomUserUpdate 回调。
let userID = "android_1721207808369"; // userID 用户自己设置，必须保证全局唯一
let userName = "user1"; // userName 用户自己设置，没有唯一性要求
let roomID = "evea_7384291_7732186_20240913112001"; // roomID 用户自己设置，必须保证全局唯一
// token 由用户自己的服务端生成，为了更快跑通流程，可以通过 ZEGO 控制台 https://console.zego.im/ 获取临时的音视频 token，token 为字符串
let token = `03AAAAAGbjsbsAENDaN43GcDOxpNbJT546yroA0OqKY4lpQ93gjuzLP2J4fdyYK9ea1PRrRy6A4bOLE5v2v3k2ON3NWBJEZUSugYrLO`;

zg.loginRoom(
  roomID,
  token,
  { userID, userName: userID },
  { userUpdate: true }
).then(async (result) => {
  if (result == true) {
    debugger;
    console.log("login success");
    // 与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。
    // 创建流、预览
    // 调用 createZegoStream 接口后，需要等待 ZEGO 服务器返回流媒体对象才能执行后续操作
    const localStream = await zg.createZegoStream();
    const enable = true;
    // 开启美颜
    // setEffectsBeauty 是 Promise 异步方法，异步函数执行完美颜才完成开启。
    await zg.setEffectsBeauty(localStream, enable, {
      sharpenIntensity: 100,
      whitenIntensity: 100,
      rosyIntensity: 100,
      smoothIntensity: 100,
    });
    // 预览画面
    localStream.playVideo(document.querySelector("#local-video"), {
      enableAutoplayDialog: true,
    });
    //设置本地视频镜像
    const localVideo = document.getElementById("local-video");
    localVideo.style.transform = "scale(-1,1)";

    // 开始推流，将自己的音视频流推送到 ZEGO 音视频云，此处 streamID 由用户定义，需全局唯一
    let streamID = new Date().getTime().toString();
    zg.startPublishingStream(streamID, localStream);
  }
});
</script>
<style lang="scss" scoped>
.bigBox {
  h1,
  h4 {
    text-align: center;
  }

  .video-wrapper {
    width: 610px;
    margin: 0 auto;
  }

  .video-wrapper h4 {
    width: 300px;
    display: inline-block;
    position: relative;
  }
  #remote-video,
  #local-video {
    width: 100vw;
    height: 500px;
    display: inline-block;
    position: relative;
  }

  .video-wrapper video {
    height: auto;
  }
}
</style> -->

<template>
  <div class="bigBox">
    <div id="container" @click="handleClick()">Pay with Google Pay</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, nextTick } from "vue";

const paymentsClient: any = ref(null);

// 初始化api支付环境
const initializePaymentsClient = () => {
  paymentsClient.value = new google.payments.api.PaymentsClient({
    environment: "TEST", // 生产环境中应改为 'PRODUCTION'
  });
};

// 指定您的 Google Pay API 版本
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

// 为您的付款服务机构申请付款令牌
const tokenizationSpecification = {
  type: "PAYMENT_GATEWAY",
  parameters: {
    gateway: "example",
    gatewayMerchantId: "exampleGatewayMerchantId",
  },
};

// 指定支持的支付卡网络
const allowedCardNetworks = [
  "AMEX",
  "DISCOVER",
  "INTERAC",
  "JCB",
  "MASTERCARD",
  "VISA",
];

const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

// 说明您允许的付款方式
const baseCardPaymentMethod = {
  type: "CARD",
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks,
  },
};

const cardPaymentMethod = Object.assign(
  { tokenizationSpecification: tokenizationSpecification },
  baseCardPaymentMethod
);

// 确定是否能使用 Google Pay API 进行付款
onMounted(() => {
  const isReadyToPayRequest = Object.assign({}, baseRequest);
  isReadyToPayRequest.allowedPaymentMethods = [cardPaymentMethod];
});

// 创建 PaymentDataRequest 对象
const paymentDataRequest = Object.assign({}, baseRequest);

paymentDataRequest.transactionInfo = {
  totalPriceStatus: "FINAL",
  totalPrice: "123.45",
  currencyCode: "USD",
  countryCode: "US",
};

// paymentDataRequest.merchantInfo = {
//   merchantName: "Example Merchant",
//   merchantId: "12345678901234567890",
// };

const handleClick = () => {
  initializePaymentsClient();
  // nextTick(() => {
  //   const button = paymentsClient.value.createButton({
  //     onClick: () => console.log("TODO: click handler"),
  //     allowedPaymentMethods: [],
  //   }); // make sure to provide an allowed payment method
  //   document.getElementById("container").appendChild(button);
  // });
  // 为用户手势注册事件处理程序
  paymentsClient.value
    .loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
      // 如果使用网关令牌化，则传递此令牌而不进行修改
      paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    })
    .catch(function (err) {
      // 在开发人员控制台中显示调试错误
      console.error(err);
    });
};
</script>
<style lang="scss" scoped></style>
