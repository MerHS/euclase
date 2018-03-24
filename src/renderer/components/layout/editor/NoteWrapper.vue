<template>
  <div id="note-wrapper" tabindex="-1" :style="wrapperStyle">
    <div id="drag-zone" v-show="dragZone.isDragging"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  props: {
    width: Number,
    height: Number,
  },
  computed: {
    wrapperStyle(): Object {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };
    },
    dragZoneStyle(): Object {
      return {};
    },
    ...mapState('editor', ['editMode', 'dragZone']),
  },
  methods: {
    mouseDown(e: MouseEvent) {

    },
    mouseMove(e: MouseEvent) {
      
    },
    mouseUp(e: MouseEvent) {
      
    },
  },
  mounted() {
    this.$el.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
  },
  beforeDestroy() {
    this.$el.removeEventListener('mousedown', this.mouseDown);
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.mouseUp);
  },
});
</script>

<style lang="stylus">
#note-wrapper
  position: absolute
  top: 0
  left: 0
  overflow: hidden

  &:focus
    outline: none

.note
  position: absolute
  border: 1px solid green
  width: 25px
  height: 10px
  background: #c3d9ff
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none
  
  &.selected &:hover
    border-color: red
  
#drag-zone
  position: absolute
  border: 1px solid green
  
</style>
