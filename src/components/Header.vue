<template>
  <div>
    <el-header class="header-container" height="70px">
      <el-container class="header">
        <h2>nextNotes</h2>
        <div>
          <i class="el-icon-moon-night" v-if="!theme" />
          <i class="el-icon-sunny" v-if="theme" />
          <el-switch v-model="theme" class="theme-switch" />
          <el-button type="primary" class="logout-btn" @click="$emit('logOut')"
            >Logout</el-button
          >
        </div>
      </el-container>
    </el-header>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

console.log(window.localStorage.getItem("test"));
export default {
  name: "Header",
  data() {
    return {
      theme: true,
    };
  },
  watch: {
    theme: function () {
      window.localStorage.setItem("theme", this.theme);
      if (!this.theme) {
        import("../style/element-theme-dark/lib/index.css");
      } else {
        import("element-ui/lib/theme-chalk/index.css");
      }
    },
  },
  mounted: async function () {
    window.addEventListener("storage", (event) => console.log(event));
    if (window.localStorage.getItem("theme")) {
      if (window.localStorage.getItem("theme") === "true") {
        this.theme = false;
      } else this.theme = true;
    } else {
      const darkTheme = await ipcRenderer
        .invoke("handle-theme")
        .then((res) => res);
      darkTheme ? (this.theme = false) : (this.theme = true);
      window.localStorage.setItem("theme", darkTheme);
    }
  },
};
</script>

<style scoped>
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
