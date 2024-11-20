<template>
  <v-btn
    @click.prevent
    @click.stop
    class="menu-btn"
    icon
    size="small"
    rounded="pill"
    variant="text"
  >
    <slot name="icon">
      <v-icon icon="mdi:mdi-dots-vertical" />
    </slot>

    <v-menu activator="parent">
      <slot>
        <v-list density="compact">
          <slot name="prependItem" />

          <v-list-item
            :key="index"
            v-bind="item"
            v-for="(item, index) in items"
          >
            <template #prepend>
              <v-icon size="small" v-bind="item.icon" />
            </template>
          </v-list-item>

          <slot name="appendItem" />
        </v-list>
      </slot>
    </v-menu>
  </v-btn>
</template>

<script lang="ts" setup>
interface IItem {
  icon?: { class?: string; icon: string };
  onClick: () => void;
  prependIcon?: string;
  title: string;
}

defineProps<{ items?: IItem[] }>();
</script>
