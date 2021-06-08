<template>
  <div>
    <el-header class="header-container" height="70px">
      <el-container class="header">
        <h2>nextNotes</h2>
        <div>
          <i class="el-icon-moon" v-if="!theme" />
          <i class="el-icon-sunny" v-if="theme" />
          <el-switch
            v-model="theme"
            class="theme-switch"
            @change="changeTheme"
          />
          <el-button type="primary" class="logout-btn" @click="$emit('logOut')">
            Logout
          </el-button>
        </div>
      </el-container>
    </el-header>
  </div>
</template>

<script>
//import { ipcRenderer } from "electron";

export default {
  name: "Header",
  data() {
    return {
      theme: true,
    };
  },

  methods: {
    changeTheme: function () {
      window.location.reload();
    }
  },

  watch: {
    theme: function () {
      window.localStorage.setItem("theme", this.theme);
      if (!this.theme) {
        import("element-theme-dark");
      } else {
        import("element-theme-chalk");
      }
    },
  },

  mounted: async function () {
    if (window.localStorage.getItem("theme")) {
      this.theme = window.localStorage.getItem("theme") === "true";
    }
  },
};
</script>

<style lang="scss" scoped>

.header-container {
  border-bottom: solid;
  border-color: #dcdfe6;
  border-width: 1px;
  border-radius: 0px;
}

.theme-switch {
  margin-right: 20px;
  margin-left: 20px;
}

.header {
  align-items: center;
  justify-content: space-between;
}

.logout-btn {
  height: 40px;
}
</style>
