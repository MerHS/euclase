<template>
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
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {

    },
  components: {
    
  },
  data() {
    return {};
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

//transform
.sidebar
  width 100%
  height 100%
  padding 7px

</style>
