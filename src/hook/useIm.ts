import SDK from "@yxim/nim-web-sdk";
import { reactive, ref, watch } from "vue";
import evenBus from "@/common/evenBus";
import { closeToast, showLoadingToast } from "vant";
import useWebSocketHeartbeat from "./useWebScoket";
import { generateRandomString } from "../common/utils";

const dataObj = {
  body: {
    path: "active/on",
    code: 0,
  },
  ts: new Date().getTime(),
  tp: 10,
  id: generateRandomString(10),
};

const { connectWebSocket, sendMessage } = useWebSocketHeartbeat();

export const useImHook = () => {
  const hooksState = reactive({
    messageList: [],
    chartMsgList: [],
  });

  //   const initIm = () => {

  let userInfo: any;
  try {
    const info = localStorage.getItem("userInfo");
    userInfo = JSON.parse(info as string);
  } catch (e) {
    console.log("error::", e);
  }

  const nim: any = SDK.NIM.getInstance({
    appKey: import.meta.env.VITE_APP_IM_APPKEY,
    debug: import.meta.env.VITE_NODE_ENV === "prod" ? false : true,
    db: true,
    dbLog: true,
    account: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      userInfo?.info?.userId
    }`,
    token: userInfo?.info?.imLoginToken || "123",
    syncSessionUnread: true,
    onconnect: onConnect,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    onerror: onError,
    onsessions: onSessions,
    onupdatesession: onUpdateSession,
    // onusers: onUsers,
    // onupdateuser: onUpdateUser,
    onmsg: onMsg,
    onsyncdone: onSyncDone,
  });

  // }

  function onConnect() {
    console.log("im连接成功");
    evenBus.emit("onConnect");
  }
  function onWillReconnect(obj: any) {
    // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    console.log("im即将重连");
    console.log(obj.retryCount);
    console.log(obj.duration);
    nim?.setOptions({
      token: userInfo?.info?.imLoginToken as string, // 建议token生成逻辑在客户的服务器侧完成，以免AppSecret泄露。
      account: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
        userInfo?.info?.userId
      }`,
      appKey: import.meta.env.VITE_APP_IM_APPKEY,
    });
  }
  function onDisconnect(error: any) {
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    console.log("im丢失连接");
    console.log(error);

    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          //   initIm();
          onWillReconnect({ retryCount: 0, duration: 0 });
          break;
        // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
        case 417:
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case "kicked":
          break;
        default:
          break;
      }
    }
  }
  function onError(error: any) {
    console.log("im_error", error);
  }

  nim?.getLocalSessions({
    limit: 100,
    done: getLocalSessionsDone,
  });

  function getLocalSessionsDone(error: any, obj: any) {
    if (!error) {
      onSessions(obj.sessions);
    }
  }

  function onSessions(sessions: any) {
    console.log("收到会话列表", sessions);

    evenBus.emit("updateonSessions", sessions);
    hooksState.messageList = sessions;
    // debugger;
  }

  function onUpdateSession(session: any) {
    const newData: any = hooksState.messageList.filter(
      (item: any) => item.id !== session.id
    );

    newData.unshift(session);
    console.log("会话更新了", session);
    evenBus.emit("updateSession", session);
    evenBus.emit("updateSessionChatRoom", newData);
    evenBus.emit("updateTopNotification", session);
    closeToast();
  }

  // function onUpdateUser(user: any) {
  //   console.log("用户资料更新了", user);
  // }

  function onSyncDone() {
    console.log("同步完成");
    // debugger;
    const webToken = localStorage.getItem("web_token");
    // if (!webToken) {
    //   connectWebSocket();
    //   sendMessage(dataObj);
    // } else {
    //   connectWebSocket();
    // }
    evenBus.emit("setFunc", nim);
    connectWebSocket(true);
  }

  // 获取单聊消息
  const getRoomMsg = (userId: number) => {
    // showLoadingToast({
    //   duration: 0,
    //   message: "Loading...",
    //   forbidClick: true,
    // });
    return new Promise((resolve, reject) => {
      let msgHistoryArr: any = [];
      // getHistoryMsgs;  云端历史消息
      nim?.getLocalMsgs({
        scene: "p2p",
        limit: 500,
        // to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userId}`,
        sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userId}`,
        done: (error: any, obj: any) => {
          if (error) {
            reject(error);
            // closeToast();
          } else {
            msgHistoryArr = obj.msgs || [];
            closeToast();
            resolve(msgHistoryArr);
          }
        },
      });
    });
  };

  // 收到消息
  function onMsg(msg: any) {
    console.log("收到消息", msg.scene, msg.type, msg);
    // pushMsg(msg);
    evenBus.emit("onMsg", msg);
  }

  return {
    nim,
    hooksState,
    getRoomMsg,
  };
};
