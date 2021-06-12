<template>
<div id="app">
  <Login />
</div>
</template>

<script>
import Login from './components/Login.vue'
import Main from './components/Main.vue'
import i18n from "@/i18n";

const routes = {
  '/': Login,
  '/app': Main
}

export default {
  components: {
    Login
  },
  name: 'app',
  data() {
    return {
      currentRoute: window.location.pathname
    }
  },

  computed: {
    ViewComponent() {
      return routes[this.currentRoute] || Login
    }
  },

  mounted: function () {
    localStorage.getItem("locale") ? i18n.locale = localStorage.getItem("locale") : null;
  },

  render() {
    return this.ViewComponent
  }
}
</script>

<style lang="scss">
$--font-path: '~element-ui/lib/theme-chalk/fonts';
@import "~element-ui/packages/theme-chalk/src/index";

body {
  margin: 0 !important;
}

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

table,
td,
th {
  padding: 10px;
  margin: 20px;
  border-collapse: collapse;
  border: 1px solid #606266;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  margin: 0;
  padding: 0;
}

</style>
