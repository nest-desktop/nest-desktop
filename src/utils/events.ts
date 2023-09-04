// events.ts
//
// https://stackoverflow.com/questions/69469814/how-can-i-throttle-a-resizeobserver
// https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/

export function throttle(callback: object, interval: number = 300) {
  let enableCall: boolean = true;

  return function (...args: any) {
    if (!enableCall) return;

    enableCall = false;
    // @ts-ignore
    timer = setTimeout(() => callback.apply(this, args), delay);
    setTimeout(() => enableCall = true, interval);
  };
}

export function debounce(callback: object, interval: number = 100) {
  let debounceTimeoutId: any;

  return function(...args: any) {
    clearTimeout(debounceTimeoutId);
    // @ts-ignore
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
  };
}