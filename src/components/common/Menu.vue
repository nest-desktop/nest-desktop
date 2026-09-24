<template>
  <v-icon-btn class="ma-auto menu-btn" icon="mdi:mdi-dots-vertical" variant="text" @click.prevent @click.stop>
    <slot name="icon">
      <v-icon icon="mdi:mdi-dots-vertical" />
    </slot>

    <v-menu activator="parent">
      <slot>
        <v-list density="compact">
          <slot name="prependItem" />

          <v-list-item v-for="(item, index) in items" :key="index" :prepend-icon="item.prependIcon" v-bind="item">
            <template #prepend>
              <v-icon :icon="item.icon" size="small" v-bind="item.iconProps" />
            </template>
          </v-list-item>

          <slot name="appendItem" />
        </v-list>
      </slot>
    </v-menu>
  </v-icon-btn>
</template>

<script setup lang="ts">
interface IItem {
  iconProps?: { class?: string; icon: string };
  icon?: string;
  onClick: () => void;
  prependIcon?: string;
  title: string;
}

defineProps<{ items?: IItem[] }>();
</script>
