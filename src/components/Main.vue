<template>
<div>
  <el-container>
    <Aside v-bind:categories="categories" v-bind:notes="notes" @newNote="newNote" @option="option" />
    <el-container direction="vertical">

      <el-header>
        <el-container class="title" direction="horizontal">
          <p v-if="!editingTitle" v-html="note.title" />
          <el-input class="title-input" v-if="editingTitle" @keyup.enter.native="editTitle" v-bind:value="titleValue" @input="changeTitle"></el-input>
          <el-tooltip effect="dark" content="Edit title" placement="right" v-if="!editingTitle && note.title">
            <i class="el-icon-edit" @click="editTitle" />
          </el-tooltip>
          <i class="el-icon-right" @click="editTitle" v-if="editingTitle" />
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
          <MDEditor v-bind:content="active" @textArea="textUpdate" @scrolled="scroll" :key="activeKey" />
        </el-col>
        <el-col :md="{span: span}" :sm="{span: 24}" v-if="viewerVisibility">
          <MDViewer v-bind:content="active" v-bind:scrollTo="scrollTo" />
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
      note: {},
      editingTitle: false,
      titleValue: "",
      deletePop: false,
    }
  },

  methods: {
    option: function(note) {
      this.active = note.content;
      this.activeKey = note.id;
      this.note = note;
      this.editingTitle = false;
    },

    textUpdate: function(value) {
      this.active = value;
      this.note.content = value;
    },

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

    callCloud: async function(method, body) {
      const {
        instance,
        username,
        password
      } = this.creds;

      await fetch(`https://${instance}/index.php/apps/notes/api/v1/notes/${this.activeKey}`, {
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
        this.callCloud('PUT', {
          title: this.titleValue
        });
        this.note.title = this.titleValue;
      }
      this.editingTitle = !this.editingTitle;
    },

    changeTitle: function(event) {
      this.titleValue = event;
    },

    saveToCloud: async function() {
      if (!this.saving && this.activeKey !== -1) {
        this.saving = true;

        this.callCloud('PUT', {
          content: this.active
        });

        this.note.content = this.active;
      }
    },

    deleteItem: function() {
      this.saving = true;
      this.deletePop = false;
      this.callCloud('DELETE', {});
      this.$emit('deleteNote', this.activeKey);
      this.activeKey = -1;
    },

    newNote: async function() {
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
            category: ""
          })
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.saving = false;
          this.activeKey = data.id;
          this.active = data.content;
          this.note = {
            id: data.id,
            title: data.title,
            content: data.content,
            favorite: false,
            category: ""
          }
          this.$emit('add', this.note);
        })
        .catch(err => {
          this.saving = false;
          console.log(err);
        });
    },
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
