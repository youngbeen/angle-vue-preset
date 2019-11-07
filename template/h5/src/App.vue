<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import ToastMsg from '@youngbeen/angle-vue-component/ToastMsg.vue'

export default {
  components: {
    // ToastMsg
  }
}
</script>

<style lang="less">
html, body {
  min-height: 100%;
}
#app {
  position: relative;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
</style>
