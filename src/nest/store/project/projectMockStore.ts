// projectMockStore.ts

import { reactive } from "vue";
import { defineStore } from "pinia";

import { Project } from "@nest/core/project/project";

export const useProjectMockStore = defineStore("nest-project-mock", () => {
  const state = reactive({
    project: new Project(),
  });

  fetch(
    "https://raw.githubusercontent.com/nest-desktop/nest-desktop-projects/main/single_neuron_models/neuron_time_constant.json"
  )
    .then((response) => response.json())
    .then((data) => {
      state.project = new Project(data[0]);
    })
    .catch((error) => {
      console.log(error);
    });

  return state;
});
