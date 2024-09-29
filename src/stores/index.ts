import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

// 创建pinia实例
const pinia = createPinia();
// 使用pinia插件
pinia.use(piniaPersist);
// 导出pinia实例，给main使用
export default pinia;
export * from "./keepAlive";
export * from "./user";
export * from "./userDetail";
