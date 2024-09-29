import evenBus from "@/common/evenBus";
import { showToast } from "vant";
import { onMounted } from "vue";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

export const useZego = () => {
  const appIDnums = import.meta.env.VITE_ZEGO_APPID;
  // 项目唯一标识 AppID，Number 类型，请从 ZEGO 控制台获取
  let appID = Number(appIDnums);

  // 接入服务器地址 Server，String 类型，请从 ZEGO 控制台获取（获取方式请参考上文“前提条件”）
  let server = import.meta.env.VITE_APP_WS_SERVER;

  // 初始化实例
  const zg = new ZegoExpressEngine(appID, server);
  zg.setDebugVerbose(false);

  // 检查兼容性
  const checkSystem = async () => {
    const result = await zg.checkSystemRequirements();
    // 返回的 result 为兼容性检测结果。 webRTC 为 true 时表示支持 webRTC，其他属性含义可以参考接口 API 文档。
    console.log(result);

    if (!result.webRTC) {
      console.log("webRTC 兼容性检查不通过");
      return showToast(
        "getSystemRequirements 接口检测不通过，请检查浏览器是否支持 webRTC"
      );
    }
  };

  // 房间状态更新回调
  // 此处在登录房间成功后，立即进行推流。在实现具体业务时，您可选择其他时机进行推流，只要保证当前房间连接状态是连接成功的即可。
  // 房间状态更新回调

  const roomStateChanged = () => {
    zg.on(
      "roomStateChanged",
      async (roomID, reason, errorCode, extendedData) => {
        if (reason == "LOGINED") {
          console.log(
            "与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。"
          );
        }
      }
    );
  };

  const roomStreamUpdate = () => {
    return new Promise((resolve, reject) => {
      zg.on(
        "roomStreamUpdate",
        (roomID, updateType, streamList, extendedData) => {
          // 房间内其他用户音视频流变化的通知
          const res: any = {
            roomID,
            updateType,
            streamList,
            extendedData,
          };
          resolve(res);
        }
      );
    });
  };

  const loginRoom = async (
    roomID: string,
    token: string,
    userName: string,
    userID: string
  ) => {
    console.log(`output->roomID`, roomID);
    console.log(`output->token`, token);
    console.log(`output->userID`, userID);
    return new Promise(async (resolve, reject) => {
      await zg.logoutRoom();
      // showToast("已退出前面的房间");
      zg.loginRoom(
        roomID,
        token,
        { userID, userName: userID },
        { userUpdate: true }
      ).then((result) => {
        if (result == true) {
          resolve(result);
        } else {
          debugger;
          reject(result);
        }
      });
    });
  };

  // 发送广播消息
  const sendBroadcastMessage = async (
    roomID: string,
    message: string,
    userList: string[]
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isSent = await zg.sendCustomCommand(roomID, message, userList);
        resolve(isSent);
      } catch (error) {
        console.log(">>> sendMsg, error: ", error);
        reject(error);
      }
    });
  };

  onMounted(async () => {
    checkSystem();
    roomStateChanged();
  });

  return {
    loginRoom,
    zg,
    roomStreamUpdate,
    sendBroadcastMessage,
  };
};
