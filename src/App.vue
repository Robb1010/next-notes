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
  color: #DCDFE6;
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

::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: #DCDFE6;

}

::-webkit-scrollbar-thumb:window-inactive {
  background: #DCDFE6;
}
</style>
