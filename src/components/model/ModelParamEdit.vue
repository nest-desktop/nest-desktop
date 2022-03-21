<template>
  <div class="modelParamEdit" v-if="state.model">
    <ParameterEdit
      :key="param.id"
      :param="param"
      :value.sync="param.value"
      @update:value="state.model.modelChanges()"
      v-for="param of state.model.filteredParams"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { CopyModel } from '@/core/model/copyModel';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'modelParamEdit',
  components: {
    ParameterEdit,
  },
  props: {
    model: CopyModel,
  },
  setup(props) {
    const state = reactive({
      model: props.model as CopyModel,
    });

    const update = () => {
      state.model = props.model as CopyModel;
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.model,
      () => {
        state.model = props.model as CopyModel;
        update();
      }
    );

    return {
      state,
    };
  },
});
</script>
