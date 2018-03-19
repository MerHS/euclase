<template>
  <aside id="sidebar-wrapper">
    <TestSidebar class="sidebar"></TestSidebar>
  </aside>
</template>

<script>
import TestSidebar from './TestSidebar';

export default {
  components: {
    TestSidebar,
  },
  data() {
    return {};
  },
};
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
