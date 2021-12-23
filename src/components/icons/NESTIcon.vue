<template>
  <div class="nest icon">
    <svg viewBox="0 0 24 24">
      <g transform="translate(-353.26166,-545.8422)" style="display: inline">
        <path
          id="background"
          d="m 377.26166,566.04715 c 0,1.95725 -1.61484,3.79511 -3.54368,3.79511 H 353.2619 l -2.4e-4,-20.45644 c 0,-1.95696 1.56309,-3.54362 3.49193,-3.54362 h 16.96439 c 1.92884,0 3.54368,1.97403 3.54368,3.54374 z"
        />
        <path
          class="content"
          d="m 364.25701,559.99905 v -2.91687 c 0,-2.29055 -0.87685,-3.43583 -2.77372,-3.43583 -1.10948,0 -1.91475,0.42948 -2.4695,1.27054 v -0.68001 c 0,-0.23263 -0.16105,-0.37579 -0.50105,-0.37579 h -1.48528 c -0.73369,0 -1.09159,0.23263 -1.09159,0.96632 0,0.62633 0.32211,0.94844 0.94843,0.94844 0.0358,0 0.0895,0 0.14316,0 v 4.2232 c -0.0358,0 -0.0716,0 -0.10737,0 -0.66211,0 -0.98422,0.32211 -0.98422,0.96633 0,0.71579 0.34,0.96632 1.09159,0.96632 h 2.16528 c 0.75159,0 1.09159,-0.25053 1.09159,-0.96632 0,-0.64422 -0.32211,-0.96633 -0.98422,-0.96633 -0.0358,0 -0.0716,0 -0.10737,0 v -2.52318 c 0,-1.23475 0.7337,-1.93266 1.64634,-1.93266 1.00211,0 1.27054,0.66212 1.27054,1.93266 v 2.52318 c -0.0358,0 -0.0716,0 -0.10737,0 -0.66211,0 -1.00212,0.32211 -1.00212,0.96633 0,0.71579 0.3579,0.96632 1.10949,0.96632 h 2.14739 c 0.75158,0 1.09159,-0.25053 1.09159,-0.96632 0,-0.64422 -0.32211,-0.96633 -0.98422,-0.96633 -0.0358,0 -0.0716,0 -0.10737,0"
        />
        <circle class="content" cx="368.43753" cy="555.05078" r="1.5718517" />
        <circle class="content" cx="373.75766" cy="555.05078" r="1.5718517" />
        <circle class="content" cx="373.75766" cy="560.37091" r="1.5718517" />
        <circle class="content" cx="368.43753" cy="560.37091" r="1.5718517" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NESTIcon',
});
</script>

<style>
.nest.icon #background {
  fill-opacity: 1;
  fill-rule: nonzero;
  fill: currentColor;
  stroke-width: 0.241823;
  stroke: none;
}
.nest.icon path.content {
  -inkscape-font-specification: 'Courier 10 Pitch Bold';
  fill-opacity: 1;
  fill: white;
  font-family: 'Courier 10 Pitch';
  font-size: 74px;
  font-stretch: normal;
  font-style: normal;
  font-variant: normal;
  font-weight: bold;
  letter-spacing: -2.5px;
  line-height: 0%;
  stroke-width: 0.241823;
  stroke: none;
  text-align: start;
  text-anchor: start;
  word-spacing: 0px;
  writing-mode: lr-tb;
}
.nest.icon circle.content {
  fill-opacity: 1;
  fill: #ffffff;
  stroke-width: 0.17476;
  stroke: none;
}

.theme--dark .nest.icon #background {
  fill: none;
}

.theme--dark .nest.icon .content {
  fill: currentColor;
}
</style>
