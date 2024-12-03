<template>
  <v-card class="playground-card">
    <v-card-title>Card</v-card-title>
    <v-card-text>
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :color="card.color"
        :title="card.title"
      >
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(item, itemIdx) in card.items"
              :key="itemIdx"
            >
              {{ item.title }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </Card>
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
