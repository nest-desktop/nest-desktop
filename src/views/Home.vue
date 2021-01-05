<template>
  <div>
    <!-- <v-app-bar app clipped-left color="primary" dark dense flat>
      NEST Desktop
    </v-app-bar> -->

    <hello-world />
  </div>
</template>

<script>
import Vue from 'vue';
import HelloWorld from '../components/HelloWorld.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    HelloWorld,
  },
});
</script>
