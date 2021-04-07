<template>

    <div>
      <Header />

      <el-container>
      <el-aside class="aside" width="230px">
        <el-menu>
      
      <el-submenu :index="index.toString()" v-for="(category, index) in categories" :key="index">
        <template #title>{{category === '' ? "Unassigned" : category}}</template>
         <el-menu-item-group >
           <template v-for="(note, index) in notes">
           <el-menu-item @click="option(note.content)" :index="category + '-' + index" v-if="note.category === category" :key="index"> {{note.title}} </el-menu-item>
           </template>
        </el-menu-item-group>
      </el-submenu>
        </el-menu>
      </el-aside>
      
      <el-container>
       
       <Content v-bind:content="active" />
 
      </el-container>
      </el-container>
        </div>
</template>

<script>
import Header from "./Header.vue"
import Content from "./Content.vue"

export default {
    name: "Main",
    components: { Header, Content },
    props: ['notes'],
    
    data () {
      return {
        categories: [""],
        active: ""
      }
    },

    methods: {
      option: function(content) {
        this.active = content;
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
    }
}
</script>

<style scoped>
  .aside {
    border-right-style: solid;
    border-width: 1px;
    border-color: #DCDFE6;
    height: calc("100vh - 70px");
  }

  .el-menu {
    border-right: 0px;
  }
</style>