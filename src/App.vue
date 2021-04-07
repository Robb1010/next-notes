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
  components: { Login },
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
  render () { return this.ViewComponent }
}
</script>

<style>
body {
  margin: 0 !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
