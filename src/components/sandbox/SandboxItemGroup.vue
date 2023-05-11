<template>
  <v-card class="playground-item-group">
    <v-card-title>Item group</v-card-title>
    <v-card-text>
      <v-item-group mandatory>
        <v-container>
          <v-row>
            <v-col v-for="n in 6" :key="n" cols="12" md="2">
              <v-item v-slot="{ isSelected, toggle }">
                <v-card
                  :color="isSelected ? 'primary' : ''"
                  class="d-flex align-center"
                  dark
                  height="50"
                  @click="toggle"
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

      <v-item-group multiple>
        <v-container>
          <v-row>
            <v-col v-for="n in 6" :key="n" cols="12" md="2">
              <v-item v-slot="{ isSelected, toggle }">
                <v-card
                  :color="isSelected ? 'primary' : ''"
                  class="d-flex align-center"
                  dark
                  height="50"
                  @click="toggle"
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

<script lang="ts" setup>
//
</script>
