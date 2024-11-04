import { useRequest } from "@/hook/useRequest";

// 获取列表
export const logindevice = () => {
  return useRequest({
    url: "/login/deviceV2",
    method: "post",
  });
};

// 上传图片
export const fileupload = () => {
  return useRequest({
    url: "/file/upload",
    method: "post",
  });
};

// 设备激活
export const deviceactivate = () => {
  return useRequest({
    url: "/device/activate",
    method: "post",
  });
};

// 保存基本信息

export const userfillInfo = () => {
  return useRequest({
    url: "/user/fillInfo",
    method: "post",
  });
};

// 主播墙发现列表
export const userrecommendList = () => {
  return useRequest({
    url: "/user/recommendList",
    method: "get",
  });
};

//获取我关注的用户列表
export const userfollowfollowingList = () => {
  return useRequest({
    url: "/user/follow/followingList",
    method: "get",
  });
};

// 获取其他用户信息
export const userget = () => {
  return useRequest({
    url: "/user/detail",
    method: "get",
  });
};

// 获取通话记录
export const callrecordlist = () => {
  return useRequest({
    url: "/call/record/list",
    method: "get",
  });
};

// 关注用户
export const userfollow = () => {
  return useRequest({
    url: "/user/follow",
    method: "post",
  });
};

// 获取自己信息
export const userDetail = () => {
  return useRequest({
    url: "/user",
    method: "get",
  });
};

// 更新个人信息
export const userPost = () => {
  return useRequest({
    url: "/user",
    method: "post",
  });
};

// 获取钱包信息
export const userwallet = () => {
  return useRequest({
    url: "/wallet",
    method: "get",
  });
};

// 获取礼物盘
export const giftlist = () => {
  return useRequest({
    url: "/gift/list",
    method: "get",
  });
};

// 获取其他用户信息
export const userdetail = () => {
  return useRequest({
    url: "/user/detail",
    method: "get",
  });
};

// 获取用户礼物墙(收礼统计)
export const userreceiveStats = () => {
  return useRequest({
    url: "/gift/user/receiveStats",
    method: "get",
  });
};

// 接听
export const callpickUp = () => {
  return useRequest({
    url: "/call/pickUp",
    method: "post",
  });
};

// 挂断
export const callhangUp = () => {
  return useRequest({
    url: "/call/hangUp",
    method: "post",
  });
};

// 拨打电话
export const calldial = () => {
  return useRequest({
    url: "/call/dial",
    method: "post",
  });
};

// 送礼
export const giftsend = () => {
  return useRequest({
    url: "/gift/send",
    method: "post",
  });
};

// 提交反馈
export const callfeedback = () => {
  return useRequest({
    url: "/call/feedback",
    method: "post",
  });
};

// 获取通话详情
export const callDetail = () => {
  return useRequest({
    url: "/call",
    method: "get",
  });
};

// 获取VIP配置
export const vipconfig = () => {
  return useRequest({
    url: "/vip/config",
    method: "get",
  });
};

// 判断是否需要弹出反馈
export const callfeedbackget = () => {
  return useRequest({
    url: "/call/feedback",
    method: "get",
  });
};

// 推荐动态列表
export const postrecommendList = () => {
  return useRequest({
    url: "/post/recommendList",
    method: "get",
  });
};

// 喜欢动态
export const postlikepost = () => {
  return useRequest({
    url: "/post/like",
    method: "post",
  });
};

// 取消喜欢动态
export const postlikedelete = () => {
  return useRequest({
    url: "/post/like",
    method: "delete",
  });
};

// 翻译
export const datatranslate = () => {
  return useRequest({
    url: "/data/translate",
    method: "post",
  });
};

// 举报
export const usercomplaint = () => {
  return useRequest({
    url: "/user/complaint",
    method: "post",
  });
};

// 拉黑用户
export const userblock = () => {
  return useRequest({
    url: "/user/block",
    method: "post",
  });
};

// 发动态
export const postDynamic = () => {
  return useRequest({
    url: "/post",
    method: "post",
  });
};

// 获取黑名单列表
export const userblocklist = () => {
  return useRequest({
    url: "/user/block/list",
    method: "get",
  });
};

// 取消拉黑用户
export const userblockno = () => {
  return useRequest({
    url: "/user/block",
    method: "delete",
  });
};

// 获取用户动态列表
export const postuser = () => {
  return useRequest({
    url: "/post/user",
    method: "get",
  });
};

// 官方消息获取
export const notiflist = () => {
  return useRequest({
    url: "/notif/list",
    method: "get",
  });
};

// 获取关注我的用户列表
export const userfollowfansList = () => {
  return useRequest({
    url: "/user/follow/fansList",
    method: "get",
  });
};

// 获取看过我的用户列表
export const userviewedLog = () => {
  return useRequest({
    url: "/user/viewedLog",
    method: "get",
  });
};

// 获取VIP价格列表
export const vippriceList = () => {
  return useRequest({
    url: "/vip/priceList",
    method: "get",
  });
};

// 购买VIP
export const vipbuy = () => {
  return useRequest({
    url: "/payment/buyVip",
    method: "post",
  });
};

// VIP签到
export const checkInvip = () => {
  return useRequest({
    url: "/checkIn/vip",
    method: "post",
  });
};

// 获取VIP签到详情
export const checkInvipget = () => {
  return useRequest({
    url: "/checkIn/vip",
    method: "get",
  });
};

// 充值价格列表（V2）
export const rechargeV2priceList = () => {
  return useRequest({
    url: "/rechargeV2/priceList",
    method: "get",
  });
};

// 充值金币（V2）
export const rechargeV2pricesubmit = () => {
  return useRequest({
    url: "/rechargeV2/submit",
    method: "post",
  });
};

// 获取金币变动记录
export const walletloggold = () => {
  return useRequest({
    url: "/wallet/log/gold",
    method: "get",
  });
};

// 获取我的相册
export const useralbum = () => {
  return useRequest({
    url: "/user/album",
    method: "get",
  });
};

//相册图片删除
export const useralbumdelete = () => {
  return useRequest({
    url: "/user/album",
    method: "delete",
  });
};

// 相册图片上传
export const useralbumpost = () => {
  return useRequest({
    url: "/user/album",
    method: "post",
  });
};

// 反馈
export const settingfeedback = () => {
  return useRequest({
    url: "/setting/feedback",
    method: "post",
  });
};

// 免费通话接听
export const freeCallpickUp = () => {
  return useRequest({
    url: "/freeCall/pickUp",
    method: "post",
  });
};

// 免费通话挂断
export const freeCallhangUp = () => {
  return useRequest({
    url: "/freeCall/hangUp",
    method: "post",
  });
};

// 视频匹配获取价格
export const matchprice = () => {
  return useRequest({
    url: "/match2/price",
    method: "get",
  });
};

// 开始匹配
export const matchstart = () => {
  return useRequest({
    url: "/match2/start",
    method: "post",
  });
};

// 停止匹配
export const matchstop = () => {
  return useRequest({
    url: "/match2/stop",
    method: "post",
  });
};

// 获取用户配置
export const userconfig = () => {
  return useRequest({
    url: "/user/config",
    method: "get",
  });
};

// 删除关注
export const userunfollow = () => {
  return useRequest({
    url: "/user/follow",
    method: "delete",
  });
};

// 获取版本号
export const webconfig = () => {
  return useRequest({
    url: "/web/config",
    method: "get",
  });
};

// 获取download地址
export const webdownload = () => {
  return useRequest({
    url: "/user/token/jwt/getPwaReferer",
    method: "get",
  });
};

// 获取游戏token
export const gametoken = () => {
  return useRequest({
    url: "/user/token/jwt/games",
    method: "get",
  });
};
