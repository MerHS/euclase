<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field label="Title" v-model="title" required></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field label="Main Grid" :rules="[gridValueValidator]"
          type="number" v-model="mainGrid" required></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field label="Sub Grid" :rules="[gridValueValidator]"
          type="number" v-model="subGrid" required></v-text-field>
      </v-flex>
      <v-flex xs2 class="icon-arrow">
        <v-icon>fas fa-arrows-alt-v</v-icon>
      </v-flex>
      <v-flex xs10>
        <v-slider class="no-details" thumb-label
          :max="2" :min="0.2" :step="0.1" v-model="verticalZoom"/>
      </v-flex>
      <v-flex xs2 class="icon-arrow">
        <v-icon>fas fa-arrows-alt-h</v-icon>
      </v-flex>
      <v-flex xs10>
        <v-slider class="no-details" thumb-label
          :max="2" :min="0.2" :step="0.1" v-model="horizontalZoom"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import { PanelState } from 'src/renderer/store/editor/panel';

export default Vue.extend({
  data() {
    return {
      title: '',
      mainGrid: 4,
      subGrid: 16,
      gridMax: 64,
      verticalZoom: 1,
      horizontalZoom: 1,
    };
  },
  methods: {
    gridValueValidator(value: number): boolean | string {
      value = +value;
      if ((value <= 0) || (value != Math.floor(value))) {
        return 'must be positive integer';
      } else if (value > this.gridMax) {
        return `should be less than ${this.gridMax}`
      }
      return true;
    },
    assignPanelState(payload: Partial<PanelState>) {
      this.$store.commit('editor/assignPanelState', payload);
    }
  },
  watch: {
    mainGrid(val: number) {
      if (this.gridMax >= val && val > 0) {
        val = Math.floor(val);
        this.assignPanelState({ mainGrid: val });
      }
    },
    subGrid(val: number) {
      if (this.gridMax >= val && val > 0) {
        val = Math.floor(val);
        this.assignPanelState({ subGrid: val });
      }
    },
    verticalZoom(val: number) {
      if (val > 0) {
        this.assignPanelState({ verticalZoom: val });
      }
    },
    horizontalZoom(val: number) {
      if (val > 0) {
        this.assignPanelState({ horizontalZoom: val });
      }
    },
    title(val: string) {
      
    },
  },
});
</script>

<style lang="stylus">
#sidebar-wrapper
  position absolute
  height 100%
  width 200px
  right 0
  top 0
  margin-left 5px
  z-index 100
  transition all 0.3s
  background white
  box-shadow 0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12);

.sidebar
  width 100%
  height 100%
  padding 7px

.no-details
  padding 0px 9px 14px 4px

  & > .input-group__details
    display none

.icon-arrow
  margin-top 1px
  text-align center



</style>
