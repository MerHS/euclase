<template>
  <v-container id="main-container" fluid fill-height>
    <div class="editor-frame">
      <editor-layout></editor-layout>
    </div>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import EditorLayout from './layout/editor/EditorLayout.vue';

  @Component({
    components: { EditorLayout },
  })
  export default class MainContainer extends Vue {
    
  }
</script>

<style lang="stylus">
#main-container
  align-items baseline
  margin 0
  padding 0

.editor-frame
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
</style>
