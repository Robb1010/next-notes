<template>
  <el-header class="header">
    <el-row :gutter="20">
      <el-col :md="{span: 4}">
        <h2>Next Notes</h2>
      </el-col>
      <el-col :md="{span: 5}">
        <h4>{{ this.$store.state.credentials.instance }}</h4>
      </el-col>
      <el-col :md="{span: 10}" />
      <el-col :md="{span: 3}">
        <div>
          <Settings />
        </div>
      </el-col>
      <el-col :md="{span: 2}">
        <div>
          <el-button v-if="this.$store.state.loggedIn" v-on:click="logOut" type="primary">
            {{ $t("header_component.logout_btn") }}
          </el-button>
        </div>
    </el-col>
    </el-row>
  </el-header>
</template>

<script>
import Settings from './Settings';
import { ipcRenderer } from "electron";

export default {
  name: 'Header',
  components: {
    Settings
  },
  methods: {
    logOut: function () {
      ipcRenderer.invoke("delete-account", `${this.$store.state.credentials.username}|${this.$store.state.credentials.url}`)
          .then(async (res) => {
              if(!res) {
                this.$store.commit("triggerError", {
                  message: "Err",
                  timeout: 3000
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$store.commit("triggerError", {
                message: "Err",
                timeout: 3000
              });
            })
          .catch((err) => console.log(err));
      this.$store.commit('setKeep', false);
      this.$store.commit('changeLogStatus');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-row {
  height: 100%;
  width: 100%;
}

.el-col {
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: end;
  align-items: center;
  div {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .right-container {
    width: 30%;
    height: 70%;
  }

  .el-button {
    height: 65%;
  }
}
</style>
