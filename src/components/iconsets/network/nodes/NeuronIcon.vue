<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
    <path
      fill="currentColor"
      d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Zm0 176H48V48h160v160Z"
    />
  </svg>
</template>

<!-- <script lang="ts">
const rectPath = (
  width: number,
  height: number,
  margin: number,
  radius: number
) => {
  const d1 = [
    "M" + (margin + width + radius) + "," + margin,
    "H" + 3 * radius,
    "a" + radius + "," + radius + " 0 0 0 " + -radius + "," + radius,
    "v" + height,
    "a" + radius + "," + radius + " 0 0 0 " + radius + "," + radius,
    "h" + width,
    "a" + radius + "," + radius + " 0 0 0 " + radius + "," + -radius,
    "V" + 3 * radius,
    "a" + radius + "," + radius + " 0 0 0 " + -radius + "," + -radius + "Z",
  ];

  const d2 = [
    "m" + 0 + "," + (height + radius),
    "H" + 3 * radius,
    "V" + 3 * radius,
    "h" + width,
    "v" + height,
    "Z",
  ];

  return d1.join("") + d2.join("");
};
</script> -->
