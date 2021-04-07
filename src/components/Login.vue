/* eslint-disable no-useless-escape */
<template>
  <div> 
    <el-container class="is-vertical window" v-if="loginVis"> 
      <el-container class="is-vertical form-container"> 
        <h2>nextNotes</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginForm"  v-loading="loading"> 
          <el-form-item prop="instance">
            <el-input spellcheck="false" v-model="loginForm.instance" placeholder="yourinstance.domain"> 
              <template slot="prepend">https://</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input spellcheck="false" v-model="loginForm.username" placeholder="username"> </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-alert
            v-if="error"
            class="error-alert"
            title="Invalid credentials"
            type="error"
            effect="dark">
          </el-alert>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="submitForm('loginForm')">Login</el-button>
            <el-checkbox v-model="loginForm.keep">Keep me signed in</el-checkbox>
          </el-form-item>
        </el-form>
      </el-container>
    </el-container>
    <Main v-bind:notes="mockNotes" v-if="!loginVis"/>
  </div>
</template>

<script>
import Main from "./Main.vue";

export default {
  name: 'Login',
  components: { Main },
  data() {
    return {
      loginForm: {
        instance: 'nextcloud.robertsoldan.com',
        username: 'robert',
        password: '',
        keep: false
      },
      loginVis: false,
      loading: false,
      error: false,
     
      mockNotes: [
         // eslint-disable-next-line no-useless-escape
        {"id":78094,"title":"#GitHub Series","modified":1614419301,"category":"","favorite":false,"error":false,"errorMessage":"","content":"#GitHub Series\n\nhttps:\/\/www.youtube.com\/watch?v=evgZPMWqpHc&list=PLzAGFfNxKFuZYVHQeb6Y4vc4hKgU7Kflo&index=1"},
         // eslint-disable-next-line no-useless-escape
        {"id":81009,"title":"Vue Electron","modified":1617725839,"category":"Test","favorite":false,"error":false,"errorMessage":"","content":"Testtttdsgsd\n\nhttps:\/\/www.smashingmagazine.com\/2020\/07\/desktop-apps-electron-vue-javascript\/\nElemnt ui: https:\/\/element.eleme.io\/?ref=madewithvuejs.com#\/en-US\/component\/layout\n\nFetch : \/index.php\/apps\/notes\/api\/v1\/notes\nFetch auth: Authorization: \"Basic \" + btoa(this.username + \":\" + this.password)\n"},
         // eslint-disable-next-line no-useless-escape
        {"id":78094,"title":"Nafadfsfd","modified":1614419301,"category":"","favorite":false,"error":false,"errorMessage":"","content":"Nlasda\n\nhttps:\/\/www.youtube.com\/watch?v=evgZPMWqpHc&list=PLzAGFfNxKFuZYVHQeb6Y4vc4hKgU7Kflo&index=1"},
         // eslint-disable-next-line no-useless-escape
        {"id":81009,"title":"Blahhhh","modified":1617725839,"category":"Test","favorite":false,"error":false,"errorMessage":"","content":"Vue Electron\n\nhttps:\/\/www.smashingmagazine.com\/2020\/07\/desktop-apps-electron-vue-javascript\/\nElemnt ui: https:\/\/element.eleme.io\/?ref=madewithvuejs.com#\/en-US\/component\/layout\n\nFetch : \/index.php\/apps\/notes\/api\/v1\/notes\nFetch auth: Authorization: \"Basic \" + btoa(this.username + \":\" + this.password)\n"}
        ],
      notes: {empty: true},
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
          await fetch(`https://${form.instance}/index.php/apps/notes/api/v1/notes`, {
            headers: {
              Authorization: "Basic " + btoa(form.username + ":" + form.password)
            }
          })
            .then(res => {
              if(res.ok) {
                this.loading = false;
                this.loginVis = false;
                return res.json();
              } else {
                this.loading = false;
                this.error = true;
                return false;
              }
            })
            .then(res => {
              // TODO
              // Add password saving if keep is ticked
              console.log(res);
              this.notes = res;
              this.loading = false;
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
    }
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
