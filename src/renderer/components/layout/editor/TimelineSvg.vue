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
  import { State, Action, Getter } from 'vuex-class';
  import Component from 'vue-class-component';
  import { mapGetters, mapState } from 'vuex';

  @Component
  export default class TimelineSVG extends Vue {
    @State('noteManager', { namespace: 'editor/score' }) noteManager: any;
    // computed: {
    //   ...mapState('editor/themes', {
    //     gridColors: state => state.currentTheme.gridColors,
    //     laneStyles: state => state.currentTheme.laneStyles,
    //   }),
    //   ...mapState('editor/score', ['noteManager']),
    //   ...mapState('editor/panel', ['verticalZoom', 'horizontalZoom']),
    //   ...mapGetters('editor/score', ['measurePulseList']),
    //   ...mapGetters('editor', [
    //     'widthPixel', 'heightPixel', 'canvasInfo',
    //   ]),
    // },
  }
</script>

<style lang="stylus">
.lane-rect
  height 100%
</style>
