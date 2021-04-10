<template>

    <div>
      <el-container>
      <el-aside class="aside" width="230px">
        <el-menu>
      <el-submenu :index="index.toString()" v-for="(category, index) in categories" :key="index">
        <template #title>{{category === '' ? "Unassigned" : category}}</template>
         <el-menu-item-group >
           <template v-for="(note, index) in notes">
           <el-menu-item @click="option(note)" :index="category + '-' + index" v-if="note.category === category" :key="index"> {{note.title}} </el-menu-item>
           </template>
        </el-menu-item-group>
      </el-submenu>
        </el-menu>
      </el-aside>
      <el-container direction="vertical">
      <el-header>
         <el-tooltip class="item" effect="dark" content="Cycle through views" placement="top-start">
        <div class="switcher" @click="cycleView">
          <i class="el-icon-c-scale-to-original"> </i>
          <i class="el-icon-edit-outline"> </i>
          <i class="el-icon-view"> </i>
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

export default {
    name: "Main",
    components: { MDEditor, MDViewer },
    props: ['notes', 'loginVis'],

    data () {
      return {
        categories: [""],
        active: "",
        activeKey: "",
        scrollTo: 0,
        span: 12,
        editorVisibility: true,
        viewerVisibility: true,
        viewCycle: 0
      }
    },

    methods: {
      option: function(note) {
        this.active = note.content;
        this.activeKey = note.id;
      },

      textUpdate: function(value) {
        this.active = value;
      },

      scroll: function(value) {
        this.scrollTo = value;
      },

      cycleView: function() {
        if(this.viewCycle === 0) {
          this.viewCycle = 1;
          this.span = 24;
          this.viewerVisibility = false;
        } else if(this.viewCycle === 1) {
          this.viewCycle = 2;
          this.editorVisibility = false;
          this.viewerVisibility = true;
        } else if(this.viewCycle === 2) {
          this.viewCycle = 0;
          this.editorVisibility = true;
          this.viewerVisibility = true;
          this.span = 12;
        }
      }
    },

    computed: {
     getTitle: function () {
       return (note, category) => {if(note.category === category) {return note.title}};
     }
    },

    beforeMount: function() {
      this.notes.map(item => {
        if(item.category != "" && this.categories.indexOf(item.category) < 0) {
          this.categories.push(item.category);
        }
      });
    },


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
    height: 40px !important;
    border-bottom-style: solid;
    border-width: 1px;
    border-color: #DCDFE6;
  }

  .switcher {
    width: 40px;
    height: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 5px;
  }

  .switcher:hover {
    color: #409EFF;
    cursor: pointer;
  }


</style>
