<template>
  <canvas id="main-canvas" :width="width" :height="height">

  </canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';

import CanvasUtil from '../../../utils/canvasUtil';
import { LaneTheme } from '../../../utils/types/themeTypes';
import { CanvasInfo } from '../../../store/editor/EditorGetters';

export default Vue.extend({
  name: 'back-canvas',
  props: {
    width: Number,
    height: Number,
  },
  data(): { drawer: CanvasUtil | null } {
    return {
      drawer: null,
    };
  },
  computed: {
    currentTheme(): LaneTheme {
      return this.$store.state.editor.theme.currentTheme;
    },
    canvasInfo(): CanvasInfo {
      return this.$store.getters['editor/canvasInfo'];
    },
  },
  watch: {
    canvasInfo(newVal) {
      this.renderCanvas();
    },
    currentTheme(newVal) {
      this.renderCanvas();
    },
  },
  methods: {
    renderCanvas() {
      if (this.drawer !== null) {
        this.drawer.drawEditor(this.canvasInfo, this.currentTheme);
      }
    },
  },
  mounted() {
    this.drawer = CanvasUtil.getCanvasUtil(this.$el as HTMLCanvasElement);
    this.renderCanvas();
  },
  updated() {
    this.renderCanvas();
  },
});
</script>

<style scoped lang="stylus">
  #main-canvas
    position absolute

</style>
