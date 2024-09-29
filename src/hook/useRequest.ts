import api from "./useHttp";
import qs from "qs";
import { closeToast, showLoadingToast } from "vant";
import { reactive, ref, toRefs, watch } from "vue";

export type RequestMethods = "get" | "put" | "post" | "delete";

export interface RequestOptions {
  url: string;
  method: RequestMethods;
  type?: "json";
  data?: any;
  page?: number;
  pageSize?: number;
  pagination?: boolean; // 是否分页
  cache?: boolean; // 是否开始缓存
  setExpireTime?: number; // 缓存时间
  cancelRequest?: boolean; // 是否开启取消重复请求
  query?: any;
}

export interface RequestState<
  T = Record<string, any>,
  K = Record<string, any | never>
> {
  code: number;
  success: boolean;
  data: T;
  msg: any;
  loading: boolean;
  query: K;
  filter: Record<string, any>;
  sort: { sort_key: string } | null;
  page: number;
  size: number;
  total: number;
  multiple: boolean;
  count: number;
}

/**
 * TODO：还需要封装取消请求的方法
 *
 * axios 请求状态封装，返回响应式数据 fetch(), loading, code, msg 等常用方法/状态
 *
 * 注意：不要在页面初次渲染的时候就开始使用 `handleFilterChange` 方法请求数据，否则数据将得不到缓存
 *
 * @param {Object} options 对象
 * @param {String} options.url 请求的URL
 * @param {String} options.method 请求的方法
 * @param {Object} options.data 请求的参数
 * @param {boolean} options.pagination 是否分页
 * @param {boolean} options.cache 是否开启缓存机制
 * @param {boolean} options.cacheKey 设置缓存唯一标识
 * @param {number} options.cacheTime 设置缓存的超时时间
 * @param {number} options.staleTime 设置缓存数据的新鲜度
 * @returns {Object} 返回fetch(), loading, code, msg
 */
export const useRequest = <K = any, T = any>(
  options: RequestOptions = {
    url: "/",
    method: "get",
    type: "json",
    data: {},
    query: {},
    pagination: false, // 是否分页
  }
) => {
  const isMutated = ref(false);
  const state = reactive<RequestState<T, K>>({
    code: 0, // 业务码
    success: false, // 请求是否成功
    data: options.data || {},
    msg: "",
    loading: false,
    query: options.query || {},
    filter: {},
    sort: null,
    page: options.page || 1,
    size: options.pageSize || 50,
    total: 0,
    multiple: true, // 请求多次
    count: 0, // 第几次请求
  });

  // 页码或每页多少条记录 更改时，请求一次数据
  watch([() => state.page, () => state.size, () => state.sort], () => {
    console.log("query", state.query);
    fetchData({
      ...state.query,
      page: state.page,
      size: state.size,
      sort: state.sort,
    } as K);
  });

  // 设置每页多少条记录/筛选搜索/排序 时，设置页码为1
  watch([() => state.size, () => state.filter, () => state.sort], () => {
    state.page = 1;
  });

  // 每页多少条记录
  const handleSizeChange = (val: number) => {
    state.size = val;
    isMutated.value = true;
  };

  // 当前第几页
  const handleCurrentChange = (val: number) => {
    isMutated.value = true;
    state.page = val;
  };

  /**
   * 筛选搜索
   * @param {Object} val  `{name:'ppx'}` name 为字段名，ppx 为字段内容
   */
  const handleFilterChange = (val: Record<string, any>) => {
    state.filter = val;
    isMutated.value = true;
    fetchData();
  };

  // 排序

  /**
   * 排序字段，排序方式
   * @param {String} val 排序字段
   * @param {String} sortOrder `desc` / `asc`
   */
  // eslint-disable-next-line
  const handleSort = (val: string, orderby = "desc") => {
    if (val != null) {
      state.sort = orderby
        ? {
            sort_key: `${orderby === "desc" ? "-" + val : val}`,
          }
        : null;
    }
  };

  // 请求函数
  const fetchData = async (subOptions?: K) => {
    state.loading = true;
    state.query = {
      ...state.filter,
      ...state.sort,
    };
    if (options.pagination) {
      state.query.page = state.page;
      state.query.size = state.size;
    }
    state.query = Object.assign({}, state.query, subOptions);
    // console.log("fetchData query", state.query);
    // const formData = new FormData();

    // Object.keys(state.query).forEach((key) => {
    //   formData.append(key, state.query[key]);
    // });

    const formData = new URLSearchParams();
    for (let key in state.query) {
      formData.append(key, state.query[key]);
    }

    try {
      const q = {
        ...options,
        ...{
          ...(options.method === "get"
            ? {
                params: state.query,
              }
            : { data: formData }),
        },
      };
      const result = await api.request(q);
      const { code, msg, data } = result.data;
      state.success = code === 200;
      // if (code === 200) {
      //   closeToast();
      // }
      state.code = code;

      state.msg = msg;
      state.data = data;
      state.total = data?.list ? data?.total : 0;
    } catch (e) {
      state.success = false;
      state.msg = e;
      // closeToast();
    }
    // closeToast();
    state.loading = false;
    isMutated.value = false;
  };

  return {
    handleSizeChange,
    handleCurrentChange,
    handleFilterChange,
    handleSort,
    fetchData,
    ...toRefs(state),
  };
};
