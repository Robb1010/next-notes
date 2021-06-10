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
          <el-select v-model="locale">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" class="logout-btn" @click="$emit('logOut')">
            {{ $t("actions.logout") }}
          </el-button>
        </div>
      </el-container>
    </el-header>
  </div>
</template>

<script>
//import { ipcRenderer } from "electron";

import i18n from "@/i18n";

export default {
  name: "Header",
  data() {
    return {
      theme: true,
      options: [],
      locale: 'en'
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
    locale: async function () {
      i18n.locale = this.locale;
      await window.localStorage.setItem("locale", this.locale);
    }
  },

  mounted: async function () {
    const locales = i18n.availableLocales;
    let options = [];
    locales.map((item) => {
      options.push({
        value: item,
        label: item
      });
    });
    this.options = options;

    if(await localStorage.getItem("locale")) {
      this.locale = await localStorage.getItem("locale");
    } else this.locale = options[0].value;
    if (await window.localStorage.getItem("theme")) {
      this.theme = await window.localStorage.getItem("theme") === "true";
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

.el-select {
  width: 70px;
  margin-right: 20px;
}

</style>
