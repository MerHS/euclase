<template>
  <v-layout id="editor-workspace" v-scroll:#editor-workspace="onScroll">
    <timeline-canvas :width="widthPixel" :height="heightPixel"/>
    <div id="lane-caption-container" :style="{ color: currGridColors.captionColor }">
      <div v-for="(stylePart, index) in currLaneStyles"
        :key="index" class="lane-caption" :style="{ left: `${ laneXList[index] + 2 }px` }">
        {{ stylePart.caption }}
      </div>
    </div>
    <!--<timeline-svg/>-->
    <note-wrapper :width="widthPixel" :height="heightPixel"/>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';

import TimelineCanvas from './TimelineCanvas.vue';
import NoteWrapper from './NoteWrapper.vue';
import TimelineSvg from './TimelineSvg.vue';

export default Vue.extend({
  data: () => ({
    offsetTop: 0,
  }),
  components: {
    TimelineCanvas,
    NoteWrapper,
    TimelineSvg,
  },
  computed: {
    // ...mapState('editor/panel', ['horizontalZoom']),
    ...mapGetters('editor', [
      'widthPixel', 'heightPixel', 'currLaneStyles', 'laneXList', 'currGridColors',
    ]),
  },
  methods: {
    onScroll(e: WheelEvent) {
      this.offsetTop = (e.target as Element).scrollTop;
    },
  },
});
</script>

<style lang="stylus">
#editor-workspace
  position: relative
  overflow: auto
  height: 100%
  width: 100%
  background-color: black

#lane-caption-container
  position: sticky 
  top: 0
  font-size: 12px

.lane-caption
  position: absolute
  top: 0
  
</style>
