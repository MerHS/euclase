<template>
  <svg :width="widthPixel * verticalZoom"
       :height="heightPixel * horizontalZoom"
       :style="{ backgroundColor: gridColors.backgroundColor }">
    <!-- Lanes -->
    <rect v-for="(style, index) in laneStyles" :width="style.width"
          :x="canvasInfo.laneXList[index]" :style="{
            fill: style.laneBackgroundColor,
          }" class="lane-rect" :key="`lane${index}`"></rect>
  </svg>
</template>

<script lang="ts">
  import Vue from 'vue';

  import { mapGetters, mapState } from 'vuex';
  import { ThemeState } from 'src/renderer/store/editor/theme';

  export default Vue.extend({
    computed: {
      ...mapState('editor/theme', {
        gridColors: (state: ThemeState) => state.currentTheme.gridColors,
        laneStyles: (state: ThemeState) => state.currentTheme.laneStyles,
      }),
      ...mapState('editor/score', ['noteManager']),
      ...mapState('editor/panel', ['verticalZoom', 'horizontalZoom']),
      ...mapGetters('editor/score', ['measurePulsePosList']),
      ...mapGetters('editor', [
        'widthPixel', 'heightPixel', 'canvasInfo',
      ]),
    },
  });
</script>

<style lang="stylus">
.lane-rect
  height 100%
</style>
