<template>
<div id="app">
  <Login />
</div>
</template>

<script>
import Login from './components/Login.vue'
import Main from './components/Main.vue'

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
  render() {
    return this.ViewComponent
  }
}
</script>

<style>
body {
  margin: 0 !important;
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
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
