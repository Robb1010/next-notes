<template>
  <el-container class="login-form">
    <el-container class="login-fields">
      <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          element-loading-background="rgba(0, 0, 0, 0.7)"
          v-loading.fullscreen.lock="this.$store.state.loading"
      >
        <el-form-item prop="instance">
          <el-input
              spellcheck="false"
              v-model="loginForm.instance"
              :placeholder="$t('login_page.instance')"
          >
            <el-select v-model="http" slot="prepend" placeholder="https://" class="http">
              <el-option label="https://" value="1"></el-option>
              <el-option label="http://" value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
              spellcheck="false"
              v-model="loginForm.username"
              :placeholder="$t('login_page.username')"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
              @keyup.enter.native="submitForm('loginForm')"
              :placeholder="$t('login_page.password')"
          ></el-input>
        </el-form-item>
        <el-alert
            v-if="error"
            class="error-alert"
            :title="$t('errors.invalid_credentials')"
            type="error"
            effect="light"
        >
        </el-alert>
        <el-form-item>
          <el-button
              ref="loginBtn"
              class="login-btn"
              type="primary"
              @click="submitForm('loginForm')"
          >{{ $t("login_page.login") }}</el-button
          >
          <el-checkbox v-model="loginForm.keep"
          >{{ $t("login_page.keep_signed_in") }}</el-checkbox
          >
        </el-form-item>
      </el-form>
    </el-container>
  </el-container>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        instance: "",
        username: "",
        password: "",
        keep: false,
      },
      http: "https://",
      loading: false,
      rules: {
        instance: [
          {
            required: true,
            message: this.$t("errors.invalid_credentials"),
            trigger: "blur",
          },
          {
            min: 3,
            message: this.$t("errors.instance_link"),
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: this.$t("errors.fill_username"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("errors.fill_password"),
            trigger: "blur",
          },
        ],
      },
      error: false
    }
  },
  methods: {
    submitForm: async function(loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          this.error = false;
          this.$store.commit("setLoading", true);

          const form = this.loginForm;
          let http = "https://";
          this.http === "2" ? (http = "http://") : null;
          const credentials = {
            instance: form.instance,
            url: `${http}${form.instance}/index.php/apps/notes/api/v1/notes`,
            username: form.username,
            password: form.password,
            keep: form.keep
          }
          await ipcRenderer.invoke("login", credentials)
          .then(res => {
            if(res.message) {
              this.error = true;
            } else {
              this.$store.commit("setNotes", res);
              this.$store.commit("updateNotesArr");
              this.$store.commit("changeLogStatus");
              delete credentials["password"];
              this.$store.commit("setCredentials", credentials);
            }
          })
          this.$store.commit("setLoading", false);
        } else {
          this.error = true;
        }
      });
    }
  },
  computed: {
    watchLoading() {
      return this.$store.state.loading;
    },
    watchError() {
      return this.$store.state.error;
    },
    watchLocale() {
      return this.$store.state.locale;
    },
    watchKeep() {
      return this.$store.state.keep;
    }
  },
  watch: {
    watchLoading() {
      this.loading = this.$store.state.loading;
    },
    watchError() {
      this.error = this.$store.state.error;
    },
    watchLocale() {
      window.location.reload();
    },
    watchKeep() {
      this.keep = this.$store.state.keep;
    }
  },
  mounted: function () {
    ipcRenderer
        .invoke("find-all")
        .then((res) => {
          const instPass = res[0].account.split("|");
          const instance = instPass[1];
          const username = instPass[0];
          const passwd = res[0].password;
          this.loginForm = {
            instance: instance,
            username: username,
            password: passwd,
            keep: true,
          };
          setTimeout(() => this.$refs.loginBtn.$listeners.click(), 200);
        })
        .catch((err) => {
          console.log(err);
        });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-form {
  display: flex;
  height: calc(100vh - 80px); // 80px is the total height of the header (60px height + 20px padding)
  justify-content: center;
  align-items: center;
  .http {
    width: 100px;
  }
  .login-btn {
    margin-right: 20px;
  }
  .login-fields {
    display: flex;
    flex-direction: column;
    max-width: 50%;
  }
}
</style>
