<template>
  <v-card class="playground-item-group">
    <v-card-title>Item group</v-card-title>
    <v-card-text>
      <v-item-group selected-class="bg-primary">
        <v-container>
          <v-row>
            <v-col v-for="n in 3" :key="n" cols="12" md="4">
              <v-item v-slot="{ isSelected, selectedClass }">
                <v-card :class="['d-flex align-center', selectedClass]" dark height="200" _@click="toggle">
                  <div class="text-h3 flex-grow-1 text-center">
                    {{ isSelected ? "Selected" : "Click Me!" }}
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>

      <v-item-group multiple>
        <v-container>
          <v-row>
            <v-col v-for="n in 6" :key="n" cols="12" md="2">
              <v-item v-slot="{ isSelected }">
                <v-card
                  :color="isSelected ? 'primary' : ''"
                  _@click="toggle"
                  class="d-flex align-center"
                  dark
                  height="50"
                >
                  <div class="flex-grow-1 text-center">
                    {{ isSelected ? "Selected" : "Click Me!" }}
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
//
</script>
