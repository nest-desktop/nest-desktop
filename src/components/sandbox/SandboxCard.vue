<template>
  <v-card class="playground-card">
    <v-card-title>Card</v-card-title>
    <v-card-text>
      <Card :color="card.color" :key="index" v-for="(card, index) in cards">
        <v-card-title :text="card.title" />

        <v-card-text>
          <v-list>
            <v-list-item
              :key="index"
              :text="item.title"
              v-for="(item, index) in card.items"
            />
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
