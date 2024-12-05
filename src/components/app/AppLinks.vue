<template>
  <v-list density="compact">
    <v-list-item
      v-for="(item, index) in linkItems"
      :key="index"
      append-icon="mdi:mdi-open-in-new"
      target="_blank"
      v-bind="item"
      :title="item.title"
      :subtitle="item.href"
    />
  </v-list>
</template>

<script lang="ts" setup>
const linkItems = [
  {
    href: "https://nest-desktop.github.io",
    prependIcon: "mdi:mdi-web",
    title: "Project website",
  },
  {
    href: "https://nest-desktop.readthedocs.io",
    prependIcon: "mdi:mdi-lifebuoy",
    title: "Help",
  },
  {
    href: "https://github.com/nest-desktop/nest-desktop/issues",
    prependIcon: "mdi:mdi-flag",
    title: "Report an issue",
  },
  {
    href: "https://nest-desktop.readthedocs.io/en/latest/contribute.html",
    prependIcon: "mdi:mdi-tools",
    title: "Contribute to the app",
  },
];
</script>
