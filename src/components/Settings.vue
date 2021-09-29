<template>
  <div class="settings-btn">
    <el-button @click="settingsVisible = true">Settings <i class="el-icon-setting"/></el-button>
  <el-dialog
      :title="$t('settings.settings')"
      :visible.sync="settingsVisible"
      width="20%"
      class="settings"
  >

    <el-container class="theme-switcher">
      <p>{{ $t('settings.theme') }}</p>
      <div>
      <i class="el-icon-moon" v-if="!theme" />
      <i class="el-icon-sunny" v-if="theme" />
      <el-switch
          v-model="theme"
          class="theme-switch"
          @change="changeTheme"
      />
      </div>
    </el-container>

    <el-container class="language-switcher">
    <p>{{ $t('settings.language') }}</p>
    <el-select v-model="locale" class="lang-select">

      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    </el-container>
  </el-dialog>
  </div>
</template>

<script>
import i18n from "../i18n";
import { getLocale, setLocale, getTheme, setTheme } from "../helpers/localstorageoperations";

export default {
  name: "Settings",
  data() {
    return {
      options: [],
      locale: 'en',
      theme: true,
      settingsVisible: false
    }
  },
  methods: {
    changeTheme: function () {
      window.location.reload();
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
    const locale = await getLocale();
    if(locale === null) {
      await setLocale('en');
    } else {
      this.locale = locale;
      i18n.locale = locale;
    }

    const theme = await getTheme();
    if(theme) {
      this.theme = theme === "true";
    }
  },
  watch: {
    locale: async function() {
      i18n.locale = this.locale;
      await setLocale(this.locale);
      this.$store.commit("setLocale", this.locale);
    },
    theme: async function() {
      await setTheme(this.theme);
      if (!this.theme) {
        import("element-theme-dark");
      } else {
        import("element-theme-chalk");
      }
    }
  }
}
</script>

<style scoped>
h3:hover {
  cursor: pointer;
}

.el-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.el-switch {
  margin-left: 10px;
}

.settings-btn {
  width: 10%;
}

.lang-select {
  width: 80px;
}
</style>