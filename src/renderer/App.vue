<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        clipped
        fixed
        right
        v-model="rightDrawer"
        :width="200"
        app
        class="pa-3"
      >
        <v-flex xs9>
          <v-slider label="Main Grid" :max="32" v-model="mainGrid"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="mainGrid" type="number"></v-text-field>
        </v-flex>
        <v-flex xs9>
          <v-slider label="Sub Grid" :max="64" v-model="subGrid"></v-slider>
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="subGrid" type="number"></v-text-field>
        </v-flex>
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

<script>
  import MainContainer from './components/MainContainer.vue';

  export default {
    name: 'euclase-app',
    components: { MainContainer },
    data: () => ({
      saveValid: false,
      miniVariant: false,
      rightDrawer: false,
      title: 'Euclase',
      mainGrid: 4,
      subGrid: 16,
    }),
    watch: {
      mainGrid(val) {
        if (val > 0) {
          this.$store.dispatch('editor/assignPanelState', { mainGrid: val });
        }
      },
      subGrid(val) {
        if (val > 0) {
          this.$store.dispatch('editor/assignPanelState', { subGrid: val });
        }
      },
    },
  };
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
