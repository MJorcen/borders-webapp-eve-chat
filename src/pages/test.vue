<template>
  <div class="bigBox">
    <div id="google-pay-button"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

onMounted(() => {
  nextTick(() => {
    initGooglePay();
  });
});

const paymentDataRequest = ref<any>();

const initGooglePay = () => {
  const client = new google.payments.api.PaymentsClient({
    environment: "TEST",
  });

  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "DISCOVER", "MASTERCARD", "VISA"],
        },
        // 令牌化（Tokenization）的方式
        // tokenizationSpecification: {
        //   // 使用支付网关
        //   type: "PAYMENT_GATEWAY",
        //   // 支付网关的配置参数
        //   parameters: {
        //     gateway: "example",
        //     gatewayMerchantId: "exampleGatewayMerchantId",
        //   },
        // },
      },
    ],
    merchantInfo: {
      // 商家的名称
      merchantName: "Example Merchant",
      // Google Pay 商家账户的 ID
      merchantId: "your-merchant-id",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      // 交易的总价格
      totalPrice: "10.00",
      // 货币代码
      currencyCode: "USD",
    },
  };
  // 检查 Google Pay 是否可用
  client
    .isReadyToPay(paymentDataRequest)
    .then(function (response) {
      if (response.result) {
        const button = client.createButton({
          onClick: onGooglePayButtonClicked,
        });
        document.getElementById("google-pay-button").appendChild(button);
      }
    })
    .catch(function (err) {
      console.error("Google Pay API error", err);
    });
};

// Google Pay 按钮点击处理函数
const onGooglePayButtonClicked = () => {
  const client = new google.payments.api.PaymentsClient({
    environment: "TEST",
  });
  client
    .loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
      processPayment(paymentData);
    })
    .catch(function (err) {
      console.error("Payment failed", err);
    });
};

// 处理支付数据
const processPayment = (paymentData) => {
  // 将支付数据发送到你的服务器进行处理
  console.log(paymentData);
};
</script>
<style lang="scss" scoped>
.bigBox {
  width: 100%;
  min-height: 100vh;
  background: #fff;
}
</style>
