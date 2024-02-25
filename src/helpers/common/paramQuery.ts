import { RouteLocationNormalizedLoaded } from "vue-router";

/**
 * Get parameter from URL.
 */
export const getParamFromURL = (
  route: RouteLocationNormalizedLoaded,
  paramKey: string
) => {
  let param: string | null;
  if (route.query[paramKey]) {
    param = route.query[paramKey] as string;
  } else if (route.params[paramKey]) {
    param = route.params[paramKey] as string;
  } else {
    param = new URLSearchParams(window.location.search).get(paramKey);
  }
  return param;
};
