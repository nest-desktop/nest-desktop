<template>
  <v-card class="playground-card">
    <v-card-title> Card </v-card-title>
    <v-card-text>
      <card
        :color="card.color"
        :key="index"
        v-for="(card, index) in cards"
      >
        <v-card-title>
          {{ card.title }}
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item :key="index" v-for="(item, index) in card.items">
              {{ item.title }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import Card from "@/components/common/Card.vue";

const items = [
  { title: "Item 1" },
  { title: "Item 2" },
  { title: "Item 3" },
  { title: "Item 4" },
];

const cards = [
  { items, color: "blue", title: "card 1" },
  { items, color: "orange", title: "card 2" },
  { items, color: "green", title: "card 3" },
];
</script>