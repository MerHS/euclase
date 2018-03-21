<template>
  <div id="editor-workspace">
    <timeline-canvas/>
    <!--<timeline-svg/>-->
    <note-wrapper/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TimelineCanvas from './TimelineCanvas.vue';
import NoteWrapper from './NoteWrapper.vue';
import TimelineSvg from './TimelineSvg.vue';

@Component({
  components: {
    TimelineCanvas,
    NoteWrapper,
    TimelineSvg,
  },
})
export default class EditorLayout extends Vue {
}
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
