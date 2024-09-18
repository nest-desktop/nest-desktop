<template>
  <v-menu class="param-menu">
    <template #activator="{ props }">
      <v-btn
        class="icon"
        icon="mdi:mdi-dots-vertical"
        size="x-small"
        v-bind="props"
        variant="text"
      />
    </template>

    <v-list density="compact">
      <v-list-item
        :key="index"
        :title="item.title"
        @click="item.onClick()"
        v-for="(item, index) in items"
      >
        <template #prepend>
          <v-icon :class="item.iconClass" :icon="item.icon" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
interface IItem {
  icon: string;
  iconClass?: string;
  onClick: () => void;
  title: string;
}

defineProps<{ items: IItem[] }>();
</script>

<style lang="scss">
.param-menu {
  .icon {
    opacity: 0;
  }

  &:hover {
    .icon {
      opacity: 1;
    }
  }
}
</style>
