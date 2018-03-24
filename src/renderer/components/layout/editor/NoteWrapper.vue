<template>
  <div id="note-wrapper" tabindex="-1">
    <div id="selected-range" v-show="dragging"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      dragging: false,
    };
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
  
#selected-range
  position: absolute
  border: 1px solid green
  
</style>
