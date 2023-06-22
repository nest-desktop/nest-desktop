// resizeObserver.ts

import { onMounted, onBeforeUnmount, reactive } from "vue";

export default function useResizeObserver(element: any) {
  const state = reactive({
    elementWidth: 0,
    elementHeight: 0,
  });
  let resizeObserver: ResizeObserver;

  onMounted(() => {
    if (element.value) {
      resizeObserver = new ResizeObserver((entries) => {
        console.log(entries)
        const entry = entries[0];
        state.elementHeight = entry.contentRect.height
        state.elementWidth = entry.contentRect.width
      });
      resizeObserver.observe(element.value);
    }
  });

  onBeforeUnmount(() => {
    if (resizeObserver) resizeObserver.disconnect();
  });

  return state;
}
