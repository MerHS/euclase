<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        clipped
        fixed
        stateless
        hide-overlay
        right
        v-model="rightDrawer"
        app
        class="pa-3"
      >
        <v-container fluid grid-list-sm>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field label="Main Grid" :rules="[gridValueValidator]"
                type="number" v-model="mainGrid" required></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field label="Sub Grid" :rules="[gridValueValidator]"
                type="number" v-model="subGrid" required></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-navigation-drawer>

      <v-toolbar fixed app clipped-right>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click.native.stop="rightDrawer = !rightDrawer"
        >
          <v-icon>menu</v-icon>
        </v-btn>
      </v-toolbar>

      <v-content>
        <main-container></main-container>
      </v-content>

      <v-footer fixed app>
        <v-spacer></v-spacer>
        <span id="span-copyright">&copy; 2018 KINETC </span>
      </v-footer>
      
    </v-app>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapActions } from 'vuex';
  import MainContainer from './components/MainContainer.vue';

  export default Vue.extend({
    components: { MainContainer },
    name: 'euclase-app',
    watch: {
      mainGrid(val: number) {
        if (val > 0) {
          val = Math.floor(val);
          this.assignPanelState({ mainGrid: val });
        }
      },
      subGrid(val: number) {
        if (val > 0) {
          val = Math.floor(val);
          this.assignPanelState({ subGrid: val });
        }
      },
    },
    methods: {
      assignPanelState(payload: any) {
        this.$store.dispatch('editor/assignPanelState', payload);
      },
      gridValueValidator(value: number): boolean | string {
        value = +value;
        if ((value <= 0) || (value != Math.floor(value))) {
          return 'must be positive integer'
        }
        return true;
      },
    },
    data() {
      return {
        saveValid: false,
        miniVariant: false,
        rightDrawer: false,
        title: 'Euclase',
        mainGrid: 4,
        subGrid: 16,
      }
    }
    
  });
</script>

<style lang="stylus">
  @import './assets/stylus/main.styl'
  html, body
    overflow hidden
  #span-copyright
    margin-right 10px

</style>


<style>
@import url('./assets/roboto.css');
/* Global CSS */
</style>
