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
        class="pa-2"
      >
        <sidebar-layout/>
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

import MainContainer from './components/MainContainer.vue';
import SidebarLayout from './components/layout/sidebar/SidebarLayout.vue';

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
