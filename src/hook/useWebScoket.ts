import { ref, onMounted, onUnmounted, watch } from "vue";
import eventBus from "@/common/evenBus";
import { generateRandomString } from "@/common/utils";
const dataObj = {
  body: {
    path: "active/on",
    code: 0,
  },
  ts: new Date().getTime(),
  tp: 10,
  id: generateRandomString(10),
};
// 心跳间隔时间（单位：毫秒）
const HEARTBEAT_INTERVAL = 5000;
// 最初重连等待时间（单位：毫秒）
const INITIAL_RECONNECT_DELAY = 1000;
// 重连的最大延迟时间（单位：毫秒），避免无限增加延迟
const MAX_RECONNECT_DELAY = 10000;

type HeartbeatMessage = {
  type: "heartbeat";
};

const isConnect = ref(false);

const useWebSocketHeartbeat = () => {
  const ws = ref<WebSocket | null | any>(null);
  let heartbeatTimer: NodeJS.Timeout | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let reconnectDelay = INITIAL_RECONNECT_DELAY;

  // 连接WebSocket服务器
  const connectWebSocket = (isSend: boolean = false) => {
    let userInfo: any;
    try {
      const info = localStorage.getItem("userInfo");
      userInfo = JSON.parse(info as string);
    } catch (e) {
      console.log("error::", e);
    }

    if ("WebSocket" in window) {
      ws.value = new WebSocket(
        `${import.meta.env.VITE_APP_WS_SERVER_URL}?authorization=${
          userInfo?.token
        }`
        // `ws://hnybgz.asuscomm.com:6688/eve/ws?authorization=${userInfo?.token}`
      );

      // 监听WebSocket连接打开事件
      ws.value.addEventListener("open", () => {
        console.log("websocket 连接成功");
        isConnect.value = true;
        // if (window.performance.navigation.type !== 1) {
        if (isSend) {
          ws.value.send(JSON.stringify(dataObj));
        }
        // }

        startHeartbeat();
        reconnectDelay = INITIAL_RECONNECT_DELAY; // 重置重连延迟时间
        clearTimeout(reconnectTimer); // 取消重连定时器
        window.wsConnet = ws.value;
      });

      // 监听WebSocket消息接收事件
      ws.value.addEventListener("message", (event) => {
        console.log("收到WebSocket消息:", JSON.parse(event.data));
        eventBus.emit("inviteCall", JSON.parse(event?.data || {}));

        const data = JSON.parse(event.data);

        if (
          data[0].body.type === "im/p2p/msg/insert" &&
          (data[0].body.data.subType === 0 ||
            data[0]?.body?.data?.type === "maps")
        ) {
          let newWsMsgArr: any = [];
          try {
            newWsMsgArr = JSON.parse(localStorage.getItem("wsMsgArr") || "[]");
          } catch (e) {
            console.log(e);
          }
          newWsMsgArr.push(data[0].body.data);
          localStorage.setItem("wsMsgArr", JSON.stringify(newWsMsgArr));
        }
        if (
          data[0].body.type === "im/p2p/msg/insert" &&
          data[0].body.data.subType === 2
        ) {
          eventBus.emit("insetCallMsg", data[0].body.data);
        }
        if (data[0].body.type === "gift/askFor") {
          eventBus.emit("askForGift", data[0].body.data);
        }
        // if (data[0].body.type === "live/endLive") {
        //   eventBus.emit("liveEnd", data[0].body.data);
        // }
        eventBus.emit("onSendMsg", data);
      });

      // 监听WebSocket连接关闭事件
      ws.value.addEventListener("close", () => {
        console.log("WebSocket 连接已关闭");
        isConnect.value = false;
        stopHeartbeat();
        console.log(`output->`, ws.value);
        // connectWebSocket(true);
        // attemptReconnect();
      });

      // 监听WebSocket错误事件
      ws.value.addEventListener("error", (error) => {
        console.error("WebSocket 错误:", error);
        isConnect.value = false;
        stopHeartbeat();
        // attemptReconnect();
      });
    } else {
      console.error("WebSocket is not supported by your browser.");
    }
  };

  // 尝试重连
  const attemptReconnect = () => {
    if (reconnectDelay <= MAX_RECONNECT_DELAY) {
      reconnectDelay *= 2; // 每次失败后增加等待时间
    }
    reconnectTimer = setTimeout(() => {
      console.log(`尝试重新连接 WebSocket...`);
      connectWebSocket();
    }, reconnectDelay);
  };

  // 开始心跳
  const startHeartbeat = () => {
    if (!heartbeatTimer && ws.value?.readyState === WebSocket.OPEN) {
      heartbeatTimer = setInterval(() => {
        sendHeartbeat();
      }, HEARTBEAT_INTERVAL);
    }
  };

  // 停止心跳
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  // 发送心跳消息
  const sendHeartbeat = () => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({ type: "heartbeat" as const }));
      // console.log("Heartbeat sent");
    }
  };

  const sendMessage = (message: any) => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message));
      console.log("Message sent:", message);
    }
  };

  const stopConnect = () => {
    ws.value?.close();
  };

  // 清理资源
  const disconnectWebSocket = () => {
    if (ws.value) {
      ws.value.close();
    }

    stopHeartbeat();
    clearTimeout(reconnectTimer);
  };

  // onMounted(connectWebSocket);
  // onUnmounted(disconnectWebSocket);

  return {
    ws,
    isConnect,
    connectWebSocket,
    sendMessage,
    stopConnect,
    disconnectWebSocket,
  };
};

export default useWebSocketHeartbeat;
