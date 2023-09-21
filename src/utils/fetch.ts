// fetch.ts

export const getRuntimeConfig = async (path: string) => {
  const runtimeConfig = await fetch(path);
  return await runtimeConfig.json();
};
