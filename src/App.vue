<template>
  <div id="app">
    <Header />
    <template v-if="!this.$store.state.loggedIn">
      <Login v-if="this.showLogin" />
    </template>

    <Main v-if="this.$store.state.loggedIn" />
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Login,
    Main,
    Header
  },
  data() {
    return {
      showLogin: false,
    }
  },
  mounted: function() {
      setTimeout(() => {
        // This short delay is needed in order to make sure that the localization settings are loaded first;
        // The login form loads the errors / warning only once on render, so the delay will allow to grab them for the correct language
        this.showLogin = true;
      }, 100);
  }
}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}
#app {
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow-x: hidden;
}
</style>
