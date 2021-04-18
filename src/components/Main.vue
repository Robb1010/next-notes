<template>
<div>
  <el-container>
    <Aside v-bind:categories="categories" v-bind:notes="notes" @newNote="newNote" @option="option" @newCategory="newNote" />
    <el-container direction="vertical">
      <el-header>
        <el-container class="title" direction="horizontal">
          <p v-if="!editingTitle" v-html="note.title" />
          <el-input class="title-input" v-if="editingTitle" @keyup.enter.native="editTitle" v-bind:value="titleValue" @input="changeTitle"></el-input>
          <el-tooltip effect="dark" content="Edit title" placement="top" v-if="!editingTitle && note.title">
            <i class="el-icon-edit" @click="editTitle" />
          </el-tooltip>
          <i class="el-icon-right" @click="editTitle" v-if="editingTitle" />
          <el-tooltip effect="dark" content="Add to favorites" placement="right" v-if="!note.favorite && note.title">
            <i class="el-icon-star-off" @click="favoriteNote" />
          </el-tooltip>
          <el-tooltip effect="dark" content="Remove from favorites" placement="right" v-if="note.favorite && note.title">
            <i class="el-icon-star-on" @click="favoriteNote" />
          </el-tooltip>
        </el-container>
        <el-popover placement="top" width="160" v-model="deletePop">
          <p>Are you sure to delete this?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="deletePop = false">No</el-button>
            <el-button type="danger" size="mini" @click="deleteItem">Yes</el-button>
          </div>
          <i slot="reference" class="el-icon-delete" />
        </el-popover>
        <el-tooltip effect="dark" content="Cycle through views" placement="top-start">
          <div class="switcher" @click="cycleView">
            <i class="el-icon-c-scale-to-original"> </i>
            <i class="el-icon-edit-outline"> </i>
            <i class="el-icon-view"> </i>
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" class="save-to-cloud" content="Save to cloud" placement="top-start">
          <div @click="saveToCloud">
            <i class="el-icon-upload" v-if="!saving"> </i>
            <i class="el-icon-loading" v-if="saving"> </i>
          </div>
        </el-tooltip>
      </el-header>

      <el-row :gutter="20">
        <el-col :md="{span: span}" :sm="{span: 24}" v-if="editorVisibility">
          <MDEditor v-bind:content="note.content" @textArea="textUpdate" @scrolled="scroll" @save="saveToCloud" :key="activeKey" />
        </el-col>
        <el-col :md="{span: span}" :sm="{span: 24}" v-if="viewerVisibility">
          <MDViewer v-bind:content="note.content" v-bind:scrollTo="scrollTo" />
        </el-col>
      </el-row>
    </el-container>
  </el-container>
</div>
</template>

<script>
import MDEditor from "./MDEditor.vue";
import MDViewer from "./MDViewer.vue";
import Aside from "./Aside.vue"

export default {
  name: "Main",
  components: {
    MDEditor,
    MDViewer,
    Aside
  },
  props: ['notes', 'loginVis', 'creds'],

  data() {
    return {
      categories: [""],
      active: "",
      activeKey: -1,
      scrollTo: 0,
      span: 12,
      editorVisibility: true,
      viewerVisibility: true,
      viewCycle: 0,
      saving: false,
      note: {
        content: "",
        title: ""
      },
      editingTitle: false,
      titleValue: "",
      deletePop: false,
      timer: false,
      timeouts: []
    }
  },

  methods: {
    scroll: function(value) {
      this.scrollTo = value;
    },

    cycleView: function() {
      if (this.viewCycle === 0) {
        this.viewCycle = 1;
        this.span = 24;
        this.viewerVisibility = false;
      } else if (this.viewCycle === 1) {
        this.viewCycle = 2;
        this.editorVisibility = false;
        this.viewerVisibility = true;
      } else if (this.viewCycle === 2) {
        this.viewCycle = 0;
        this.editorVisibility = true;
        this.viewerVisibility = true;
        this.span = 12;
      }
    },

    callCloud: async function(method, id, body) {
      const {
        instance,
        username,
        password
      } = this.creds;

      await fetch(`https://${instance}/index.php/apps/notes/api/v1/notes/${id.toString()}`, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Basic " + btoa(username + ":" + password)
          },
          body: JSON.stringify(body)
        })
        .then(res => {
          console.log(res);
          this.saving = false;
        })
        .catch(err => {
          console.log(err);
          this.saving = false;
        });
    },

    editTitle: function() {
      if (!this.editingTitle) {
        this.titleValue = this.note.title;
      }
      if (this.editingTitle) {
        this.saving = true;
        this.callCloud('PUT', this.activeKey, {
          title: this.titleValue
        });
        this.note.title = this.titleValue;
      }
      this.editingTitle = !this.editingTitle;
    },

    changeTitle: function(event) {
      this.titleValue = event;
    },

    saveToCloud: async function(event, id, body) {
      if (!this.saving && this.activeKey !== -1) {
        this.saving = true;
        body ? this.callCloud('PUT', id, {
          content: body
        }) : this.callCloud('PUT', this.activeKey, {
          content: this.note.content
        })
      }
    },

    deleteItem: function() {
      this.saving = true;
      this.deletePop = false;
      this.callCloud('DELETE', this.activeKey, {});
      this.$emit('deleteNote', this.activeKey);
      this.activeKey = -1;
      this.titleValue = "";
      this.note = {
        content: "",
        title: ""
      };
      this.categories = [""];
      this.notes.map(item => {
        if (item.category != "" && this.categories.indexOf(item.category) < 0) {
          this.categories.push(item.category);
        }
      });
    },

    newNote: async function(category) {
      this.saving = true;
      const {
        instance,
        username,
        password
      } = this.creds;

      await fetch(`https://${instance}/index.php/apps/notes/api/v1/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Basic " + btoa(username + ":" + password)
          },
          body: JSON.stringify({
            title: "New note",
            content: "Type your note...",
            favorite: false,
            category: category
          })
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.saving = false;
          this.activeKey = data.id;
          this.note.content = data.content;
          this.note = {
            id: data.id,
            title: data.title,
            content: data.content,
            favorite: false,
            category: category
          }
          this.$emit('add', this.note);
        })
        .catch(err => {
          this.saving = false;
          console.log(err);
        });
    },

    setTimer: function() {
      this.timer = !this.timer;
    },

    textUpdate: function(value) {
      this.note.content = value;

      if (!this.timer) {
        this.timer = true;
        const params = {
          id: this.activeKey
        };

        this.timeouts[this.activeKey.toString()] = setTimeout(function() {
          this.setTimer();
          let content = "";
          this.notes.map(note => {
            if (note.id === params.id) {
              content = note.content;
              console.log(note);
            }
          });
          this.saveToCloud(null, params.id, content);
        }.bind(this), 10000, params);
      }
    },

    option: function(note) {
      this.timer = false;
      this.activeKey = note.id;
      this.note = note;
      this.editingTitle = false;
    },

    favoriteNote: function() {
      this.note.favorite = !this.note.favorite;
      this.saving = true;
      this.callCloud('PUT', this.activeKey, {
        favorite: this.note.favorite
      });
    }
  },

  computed: {
    getTitle: function() {
      return (note, category) => {
        if (note.category === category) {
          return note.title
        }
      };
    }
  },

  watch: {
    "notes": function() {
      if (this.notes.length > 0) {
        this.notes.map(item => {
          if (item.category != "" && this.categories.indexOf(item.category) < 0) {
            this.categories.push(item.category);
          }
        });
      }
    }
  },

  mounted() {
    this.notes.map(item => {
      if (item.category != "" && this.categories.indexOf(item.category) < 0) {
        this.categories.push(item.category);
      }
    });
  }
}
</script>

<style scoped>
.aside {
  border-right-style: solid;
  border-width: 1px;
  border-color: #DCDFE6;
}

.el-menu {
  border-right: 0px;
}

.el-row {
  width: 100%;
}

.el-header {
  height: 50px !important;
  border-bottom-style: solid;
  border-width: 1px;
  border-color: #DCDFE6;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  height: 100%;
}

.title-input {
  width: 250px;
}


.el-icon-right {
  font-size: 1.3rem;
}

.el-icon-delete {
  font-size: 1.5rem;
  margin-right: 20px;
}

.switcher {
  width: 40px;
  height: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5px;
}

.el-tooltip {
  width: 40px;
  text-align: center;
}

.el-icon-upload {
  font-size: 2rem;
}

.save-to-cloud,
.el-icon-edit {
  margin-left: 20px;
}

.el-tooltip:hover,
.el-icon-right:hover,
.el-icon-delete:hover {
  color: #409EFF;
  cursor: pointer;
}
</style>
