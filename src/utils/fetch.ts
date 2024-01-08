// fetch.ts

/**
 * Get runtime fetch data from json.
 * @param path
 * @returns
 */
export const getRuntimeConfig = async (path: string) => {
  const data = await fetch(path);
  return await data.json();
};
