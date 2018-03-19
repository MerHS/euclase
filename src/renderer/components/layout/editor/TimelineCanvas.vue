<template>
  <canvas id="main-canvas" :width="widthPixel" :height="heightPixel">

  </canvas>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import CanvasUtil from '@/utils/canvasUtil';

  export default {
    name: 'back-canvas',
    data() {
      return {
        drawer: null,
      };
    },
    computed: {
      ...mapState('editor', ['isPanelDirty']),
      ...mapState('editor/themes', ['currentTheme']),
      ...mapState('editor/score', ['noteManager']),
      ...mapGetters('editor/score', ['measurePulseList']),
      ...mapGetters('editor', [
        'widthPixel', 'heightPixel', 'canvasInfo',
      ]),
    },
    watch: {
      isPanelDirty(val, oldVal) {
        if (val === true) {
          this.renderCanvas();
          this.$store.commit('editor/setPanelDirty', false);
        }
      },
    },
    methods: {
      renderCanvas() {
        this.drawer.drawEditor(this.canvasInfo, this.currentTheme);
      },
    },
    mounted() {
      this.drawer = CanvasUtil.getCanvasUtil(this.$el);
      this.renderCanvas();
    },
    updated() {
      this.renderCanvas();
    },
  };
</script>

<style scoped lang="stylus">
  #main-canvas
    position absolute

</style>
