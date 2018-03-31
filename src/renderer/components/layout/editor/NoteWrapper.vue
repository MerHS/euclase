<template>
  <div id="note-wrapper" tabindex="-1" :style="wrapperStyle"
    @mousedown.left.self.stop="mouseDown">
    <div id="drag-zone" v-show="dragZone.showDragZone" :style="dragZoneStyle">

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { DragZoneState } from 'src/renderer/store/editor';
import { EditMode, Coord } from 'src/renderer/utils/scoreTypes';

export default Vue.extend({
  props: {
    width: Number,
    height: Number,
  },
  data() {
    return {
      isDragging: false,
      dragPosX: 0,
      dragPosY: 0,
    };
  },
  computed: {
    wrapperStyle(): Object {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };
    },
    dragZoneStyle(): Object {
      return {
        left: `${this.dragZone.dragRect[0][0]}px`,
        bottom: `${this.dragZone.dragRect[0][1]}px`,
        width: `${this.dragZone.dragRect[1][0]}px`,
        height: `${this.dragZone.dragRect[1][1]}px`,
      };
    },
    dragZone(): DragZoneState {
      return this.$store.state.editor.dragZone;
    },
    editMode(): EditMode {
      return this.$store.state.editor.editMode;
    },
  },
  methods: {
    mouseDown(e: MouseEvent) {
      this.isDragging = true;
      this.getPosition(e);
      this.$store.commit('editor/dragStart', {
        coord: [this.dragPosX, this.height - this.dragPosY],
        isExclusive: e.ctrlKey,
      });
    },
    mouseMove(e: MouseEvent) {
      if (this.isDragging) {
        e.preventDefault();
        this.getPosition(e);
        this.$store.commit('editor/dragMove', [this.dragPosX, this.height - this.dragPosY]);
      }
    },
    mouseUp(e: MouseEvent) {
      if (this.isDragging) {
        e.preventDefault();
        this.getPosition(e);
        this.$store.commit('editor/dragEnd', [this.dragPosX, this.height - this.dragPosY]);
      }
      this.isDragging = false;
    },
    getPosition(e: MouseEvent) {
      const el = this.$el.parentElement!!;
      this.dragPosX = e.pageX + el.scrollLeft - el.offsetLeft;
      this.dragPosY = e.pageY + el.scrollTop - el.offsetTop;
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
  },
  beforeDestroy() {
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
  
  &:hover
    border-color: red
  
#drag-zone
  position: absolute
  border: 1px solid green
  
</style>
