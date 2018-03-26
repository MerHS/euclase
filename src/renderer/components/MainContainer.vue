<template>
  <v-container id="main-container" fluid fill-height>
      <editor-layout></editor-layout>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import EditorLayout from './layout/editor/EditorLayout.vue';

  export default Vue.extend({
    components: { EditorLayout },
  });
</script>

<style lang="stylus">
#main-container
  align-items baseline
  margin 0
  padding 0

</style>
