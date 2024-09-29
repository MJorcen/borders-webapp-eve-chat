import { onBeforeUnmount, ref } from "vue";

export function usePolling(interval: number, callback: () => void) {
  const isPolling = ref(false);

  let timerId: ReturnType<typeof setInterval>;

  function startPolling() {
    isPolling.value = true;
    timerId = setInterval(callback, interval);
  }

  function stopPolling() {
    isPolling.value = false;
    clearInterval(timerId);
  }

  onBeforeUnmount(stopPolling);

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
}
