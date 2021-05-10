/* eslint-disable no-useless-escape */
<template>
<div>
  <Header v-if="!loginVis" @logOut="logOut" />
  <el-container class="is-vertical window" v-if="loginVis">
    <el-container class="is-vertical form-container">
      <h2>nextNotes</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock="loading">
        <el-form-item prop="instance">
          <el-input spellcheck="false" v-model="loginForm.instance" placeholder="yourinstance.domain">
            <el-select v-model="http" slot="prepend" placeholder="https://">
              <el-option label="https://" value="1"></el-option>
              <el-option label="http://" value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input spellcheck="false" v-model="loginForm.username" placeholder="username"> </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off" @keyup.enter.native="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-alert v-if="error" class="error-alert" title="Invalid credentials" type="error" effect="light">
        </el-alert>
        <el-form-item>
          <el-button ref="loginBtn" class="login-btn" type="primary" @click="submitForm('loginForm')">Login</el-button>
          <el-checkbox v-model="loginForm.keep">Keep me signed in</el-checkbox>
        </el-form-item>
      </el-form>
    </el-container>
  </el-container>
  <Main v-bind:notes="notes" v-bind:creds="loginForm" v-if="!loginVis" @add="addNote" @deleteNote="deleteNote" />
</div>
</template>

<script>
import Main from "./Main.vue";
import Header from "./Header.vue";
import {
  ipcRenderer
} from "electron";


export default {
  name: 'Login',
  components: {
    Main,
    Header
  },
  data() {
    return {
      loginForm: {
        instance: 'nextcloud.robertsoldan.com',
        username: 'robert',
        password: '',
        keep: false,
      },
      loginVis: true,
      loading: false,
      error: false,
      http: "https://",
      notes: {
        empty: true
      },
      rules: {
        instance: [{
            required: true,
            message: 'Please provide an instance link',
            trigger: 'blur'
          },
          {
            min: 3,
            message: 'Please provide a valid link',
            trigger: 'blur'
          }
        ],
        username: [{
          required: true,
          message: 'Please fill in your username',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please fill in your password',
          trigger: 'blur'
        }]
      },
    }
  },
  methods: {
    submitForm: function(loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          this.error = false;
          const form = this.loginForm;
          let http = "https://";
          this.http === "2" ? http = "http://" : null;
          await fetch(`${http}${form.instance}/index.php/apps/notes/api/v1/notes`, {
              headers: {
                Authorization: "Basic " + btoa(form.username + ":" + form.password)
              }
            })
            .then(res => {
              if (res.status === 200) {
                return res.json();
              } else {
                this.error = true;
                return res.json();
              }
            })
            .then(async res => {
              if (this.error) {
                this.loading = false;
              } else {
                this.notes = res;
                this.loading = false;
                this.loginVis = false;
                this.loading = false;
                if (form.keep) {
                  await ipcRenderer.send('set-password', `${form.username}|${form.instance}`, form.password);
                }
              }
            })
            .catch(err => {
              this.loading = false;
              this.error = true;
              console.log(err)
            });
        } else {
          this.error = true;
          return false;
        }
      })
    },

    logOut: function() {
      const username = `${this.loginForm.username}|${this.loginForm.instance}`;
      console.log("username");
      ipcRenderer.invoke('delete-account', username)
        .then(res => console.log(res))
        .catch(err => console.log(err));
      this.loginVis = true;
    },

    addNote: function(note) {
      this.notes.unshift(note);
    },

    deleteNote: function(noteKey) {
      this.notes.map((note, index) => {
        if (note.id === noteKey) {
          this.notes.splice(index, 1);
        }
      })
    }
  },

  mounted: function() {
    ipcRenderer.invoke('find-all')
      .then(res => {
        const instPass = res[0].account.split('|');
        const instance = instPass[1];
        const username = instPass[0];
        const passwd = res[0].password;
        this.loginForm = {
          instance: instance,
          username: username,
          password: passwd,
          keep: false
        };
        setTimeout(() => this.$refs.loginBtn.$listeners.click(), 100);

      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.window {
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.el-select {
  width: 90px;
}

.error-alert {
  margin-bottom: 20px;
}

.form-container {
  justify-content: center;
  width: 50%;
  max-width: 450px;
}

.login-btn {
  margin-right: 20px;
}
</style>
