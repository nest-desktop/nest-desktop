<template>
  <router-link :to="{ name: 'home' }" class="navItem">
    <span class="prependIcon">
      <slot name="prependIcon" />
    </span>

    <slot></slot>

    <span class="appendIcon">
      <slot name="appendIcon" />
    </span>
  </router-link>
</template>

<style lang="scss">
.navItem {
  flex: none;
  text-decoration: none;
  color: inherit;
  padding: 8px 12px;

  &:hover {
    background-color: var(--baklava-toolbar-background);
    color: var(--baklava-toolbar-foreground);
  }

  &.active {
    background-color: var(--baklava-control-color-primary);
  }

  .prependIcon {
    svg {
      display: inline;
      height: 1rem;
      vertical-align: middle;
    }
  }

  .appendIcon {
    svg {
      display: inline;
      height: 1rem;
      vertical-align: middle;
    }
  }
}
</style>
