<template>
  <canvas id="main-canvas" :width="widthPixel" :height="heightPixel">

  </canvas>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { mapGetters, mapState } from 'vuex';
  import CanvasUtil from '../../../utils/canvasUtil';

  @Component({
    computed: {
      ...mapState('editor', ['isPanelDirty']),
      ...mapState('editor/themes', ['currentTheme']),
      ...mapState('editor/score', ['noteManager']),
      ...mapGetters('score', ['measurePulseList']),
      ...mapGetters('editor', [
        'widthPixel', 'heightPixel', 'canvasInfo',
      ]),
    },
    watch: {
      isPanelDirty(val, oldVal) {
        if (val === true) {
          //this.renderCanvas();
          this.$store.commit('editor/setPanelDirty', false);
        }
      },
    },
    name: 'back-canvas',
  })
  export default class TimelineCanvas extends Vue {
    drawer: CanvasUtil | null = null;
    
    renderCanvas() {
      if (this.drawer !== null) {
        // this.drawer.drawEditor(this.canvasInfo, this.currentTheme);
      }
    }
    mounted() {
      this.drawer = CanvasUtil.getCanvasUtil(this.$el as HTMLCanvasElement);
      this.renderCanvas();
    }
    updated() {
      this.renderCanvas();
    }
  };
</script>

<style scoped lang="stylus">
  #main-canvas
    position absolute

</style>
