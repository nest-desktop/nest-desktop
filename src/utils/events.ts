// events.ts
//
// https://stackoverflow.com/questions/69469814/how-can-i-throttle-a-resizeobserver
// https://programmingwithmosh.com/javascript/javascript-throttle-and-debounce-patterns/

export function throttle(callback: any, interval: number = 300) {
  let enableCall: boolean = true;

  return function (...props: any) {
    if (!enableCall) return;

    enableCall = false;
    // @ts-expect-error Property 'this' implicitly has type 'any' because it does not have a type annotation.
    setTimeout(() => callback.apply(this, props), delay);
    setTimeout(() => (enableCall = true), interval);
  };
}

export function debounce(callback: any, interval: number = 100) {
  let debounceTimeoutId: NodeJS.Timeout;

  return function (...props: any) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = setTimeout(() => callback.apply(this, props), interval);
  };
}
