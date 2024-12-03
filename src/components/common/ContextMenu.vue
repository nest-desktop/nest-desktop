<template>
  <v-menu @focusout="closeMenu()">
    <template #activator="{ props }">
      <slot
        name="activator"
        v-bind="{
          props: {
            ...props,
            onClick: closeMenu(),
            onContextmenu: (e: any) => onContextmenuPipe(props.onClick, e),
            tabindex: '0',
          },
        }"
      />
    </template>

    <slot>
      <v-list density="compact">
        <slot name="prependItem" />

        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          v-bind="item"
        >
          <template #prepend>
            <v-icon v-bind="item.icon" />
          </template>
        </v-list-item>

        <slot name="appendItem" />
      </v-list>
    </slot>
  </v-menu>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

interface IItem {
  icon?: { class?: string; icon: string };
  onClick: () => void;
  prependIcon?: string;
  title: string;
}

defineProps<{ items?: IItem[] }>();

const state = reactive<{
  show: boolean;
}>({
  show: false,
});

/**
 * Close menu.
 */
const closeMenu = () => {
  state.show = false;
};

const onContextmenuPipe = (fn: (e: any) => void, e: any) => {
  e.preventDefault();
  fn(e);
};
</script>
