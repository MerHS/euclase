<template>
  <div id="editor-workspace">
    <timeline-canvas/>
    <!--<timeline-svg/>-->
    <note-wrapper/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import TimelineCanvas from './TimelineCanvas.vue';
import NoteWrapper from './NoteWrapper.vue';
import TimelineSvg from './TimelineSvg.vue';


export default Vue.extend({
  components: {
    TimelineCanvas,
    NoteWrapper,
    TimelineSvg,
  },
});
</script>

<style lang="stylus">
#editor-workspace
  position: absolute
  top: 0
  left: 0
  overflow: auto
  height: 100%
  width: 100%

</style>
