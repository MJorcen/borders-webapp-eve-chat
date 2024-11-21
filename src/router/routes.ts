const routes: any = [
  {
    path: "/",
    name: "HostList",
    meta: {
      title: "",
    },
    component: async () => await import("@/pages/hostList/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "",
    },
    component: async () => await import("@/pages/login/index.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "home page",
    },
    component: async () => await import("@/pages/home/index.vue"),
  },
  {
    path: "/mine",
    name: "Mine",
    meta: {
      title: "",
    },
    component: async () => await import("@/pages/mine/index.vue"),
  },

  {
    path: "/editProfile",
    name: "EditProfile",
    meta: {
      title: "Edit Profile",
    },
    component: async () => await import("@/pages/editProfile/index.vue"),
  },
  {
    path: "/messages",
    name: "Messages",
    meta: {
      title: "Messages",
    },
    component: async () => await import("@/pages/messages/index.vue"),
  },
  {
    path: "/followAndFans",
    name: "FollowAndFans",
    meta: {
      title: "Follow And Fans",
    },
    component: async () => await import("@/pages/followAndFans/index.vue"),
  },
  {
    path: "/visitor",
    name: "Visitor",
    meta: {
      // 访客
      title: "",
    },
    component: async () => await import("@/pages/visitor/index.vue"),
  },
  {
    path: "/chatRoom",
    name: "ChatRoom",
    meta: {
      // 私聊
      title: "",
    },
    component: async () => await import("@/pages/chatRoom/index.vue"),
  },
  {
    path: "/anchorDetail",
    name: "AnchorDetail",
    meta: {
      // 主播主页
      title: "",
    },
    component: async () => await import("@/pages/anchorDetail/index.vue"),
  },
  {
    path: "/blockList",
    name: "BlockList",
    meta: {
      // 黑名单
      title: "",
    },
    component: async () => await import("@/pages/blockList/index.vue"),
  },
  {
    path: "/dynamic",
    name: "Dynamic",
    meta: {
      // 动态
      title: "",
    },
    component: async () => await import("@/pages/dynamic/index.vue"),
  },
  {
    path: "/blockAndReport",
    name: "BlockAndReport",
    meta: {
      // 拉黑、举报
      title: "",
    },
    component: async () => await import("@/pages/blockAndReport/index.vue"),
  },
  {
    path: "/videoUploadDynamic",
    name: "VideoUploadDynamic",
    meta: {
      // 发表视频动态
      title: "",
    },
    component: async () => await import("@/pages/videoUploadDynamic/index.vue"),
  },
  {
    path: "/userDynamicList",
    name: "UserDynamicList",
    meta: {
      // 用户动态列表
      title: "",
    },
    component: async () => await import("@/pages/userDynamicList/index.vue"),
  },
  {
    path: "/notification",
    name: "Notification",
    meta: {
      // 官方消息
      title: "",
    },
    component: async () => await import("@/pages/notification/index.vue"),
  },
  {
    path: "/signDetail",
    name: "SignDetail",
    meta: {
      // 签到页面
      title: "",
    },
    component: async () => await import("@/pages/signDetail/index.vue"),
  },
  {
    path: "/wallect",
    name: "Wallect",
    meta: {
      // 钱包
      title: "",
    },
    component: async () => await import("@/pages/wallect/index.vue"),
  },
  {
    path: "/walletDetail",
    name: "WalletDetail",
    meta: {
      // 钱包流水
      title: "",
    },
    component: async () => await import("@/pages/walletDetail/index.vue"),
  },
  {
    path: "/feedBack",
    name: "FeedBack",
    meta: {
      // 反馈
      title: "",
    },
    component: async () => await import("@/pages/feedBack/index.vue"),
  },
  {
    path: "/matchHome",
    name: "MatchHome",
    meta: {
      // 匹配首页
      title: "",
    },
    component: async () => await import("@/pages/matchHome/index.vue"),
  },
  {
    path: "/gameCat",
    name: "GameCat",
    meta: {
      // 游戏
      title: "",
    },
    component: async () => await import("@/pages/gameCat/index.vue"),
  },
  {
    path: "/livePage",
    name: "LivePage",
    meta: {
      // 直播页面列表
      title: "",
    },
    component: async () => await import("@/pages/livePage/index.vue"),
  },
  {
    path: "/liveRoom",
    name: "LiveRoom",
    meta: {
      // 直播房间页面
      title: "",
    },
    component: async () => await import("@/pages/liveRoom/index.vue"),
  },
];

export default routes;
