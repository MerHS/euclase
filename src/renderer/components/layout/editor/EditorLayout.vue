<template>
  <div id="editor-workspace">
    <timeline-canvas/>
    <!--<timeline-svg/>-->
    <note-wrapper/>
  </div>
</template>

<script>
// import { map}

import TimelineCanvas from './TimelineCanvas';
import NoteWrapper from './NoteWrapper';
import TimelineSvg from './TimelineSvg';

export default {
  components: {
    TimelineCanvas,
    NoteWrapper,
    TimelineSvg,
  },
  computed: {
    // TODO: HOW TO DO IT?
  },
};
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
