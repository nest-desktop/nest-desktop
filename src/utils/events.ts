// events.ts
//
// https://stackoverflow.com/questions/69469814/how-can-i-throttle-a-resizeobserver
// https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/

export function throttle(callback: object, interval: number = 300) {
  let enableCall: boolean = true;

  return function (...props: any) {
    if (!enableCall) return;

    enableCall = false;
    // @ts-ignore - Property 'apply' does not exist on type 'object'.
    timer = setTimeout(() => callback.apply(this, props), delay);
    setTimeout(() => (enableCall = true), interval);
  };
}

export function debounce(callback: object, interval: number = 100) {
  let debounceTimeoutId: any;

  return function (...props: any) {
    clearTimeout(debounceTimeoutId);
    // @ts-ignore - Property 'apply' does not exist on type 'object'.
    debounceTimeoutId = setTimeout(() => callback.apply(this, props), interval);
  };
}
