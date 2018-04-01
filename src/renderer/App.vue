<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer
        clipped
        fixed
        stateless
        hide-overlay
        right
        v-model="rightDrawer"
        app
        class="pa-2 blue-grey lighten-5"
        :width="240"
      >
        <sidebar-layout/>
      </v-navigation-drawer>

      <v-toolbar fixed app clipped-right dark class="primary">
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

      <v-footer id="footer" fixed app dark class="primary">
        <v-icon class="pl-1">{{ editModeIcon }}</v-icon>
        <v-spacer></v-spacer>
        <span id="span-copyright">&copy; 2018 KINETC </span>
      </v-footer>
      
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import MainContainer from './components/MainContainer.vue';
import SidebarLayout from './components/layout/sidebar/SidebarLayout.vue';
import { EditMode } from './utils/scoreTypes';

export default Vue.extend({
  components: { MainContainer, SidebarLayout },
  name: 'euclase-app',
  data() {
    return {
      saveValid: false,
      miniVariant: false,
      rightDrawer: false,
      title: 'Euclase',
    }
  },
  computed: {
    editMode(): EditMode {
      return this.$store.state.editor.editMode;
    },
    editModeIcon(): string {
      // TODO: move to EditMode class
      switch (this.editMode) {
        case EditMode.TIME_SELECT_MODE:
          return 'timer';
        case EditMode.SELECT_MODE:
          return 'crop'; 
        case EditMode.WRITE_MODE:
          return 'edit'
        default: 
          return 'edit';
      }
    },
  },
});
</script>

<style lang="stylus">
@import './assets/stylus/main.styl'
html, body
  overflow hidden
#span-copyright
  margin-right 10px
#footer
  height: 32px
  min-height: 32px

</style>


<style>
@import url('./assets/css/fontawesome-all.min.css');
@import url('./assets/roboto.css');
/* Global CSS */
</style>
