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

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'back-svg',
    data() {
      return {};
    },
    computed: {
      ...mapState('editor/themes', {
        gridColors: state => state.currentTheme.gridColors,
        laneStyles: state => state.currentTheme.laneStyles,
      }),
      ...mapState('editor/score', ['noteManager']),
      ...mapState('editor/panel', ['verticalZoom', 'horizontalZoom']),
      ...mapGetters('editor/score', ['measurePulseList']),
      ...mapGetters('editor', [
        'widthPixel', 'heightPixel', 'canvasInfo',
      ]),
    },
    methods: {},
  };
</script>

<style lang="stylus">
.lane-rect
  height 100%
</style>
