<template>
<div>
  <el-aside class="aside" width="230px">
    <p class="new-category" @click="dialogVisible=true"><span>New category</span> <span class="plus"> + </span></p>
    <el-menu :default-openeds="['-1']">
      <el-submenu index="-1">
        <template slot="title"> Favorites </template>
        <template v-for="(note, index) in notes">
          <el-menu-item @click="$emit('option', note)" :index="'favorite' + index" v-if="note.favorite" :key="index" v-html="note.title" />
        </template>
      </el-submenu>
      <el-submenu :index="index.toString()" v-for="(category, index) in categories" :key="index">
        <template slot="title"> {{category === '' ? "Unassigned" : category}}</template>
        <el-menu-item-group>
          <template slot="title">
            <div class="add-note" @click="newNote(category)"><span>Create a new note</span> <span class="plus"> + </span></div>
          </template>
          <template v-for="(note, index) in notes">
            <el-menu-item @click="$emit('option', note)" :index="category + '-' + index" v-if="note.category === category" :key="index" v-html="note.title" />
          </template>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
  <el-dialog title="Add new category" :visible.sync="dialogVisible" width="30%">
    <el-input placeholder="Category name" v-model="newCategory" @keyup.enter.native="addCategory" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="addCategory">Confirm</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'Aside',
  props: ['categories', 'notes'],

  data() {
    return {
      dialogVisible: false,
      newCategory: ""
    }
  },

  methods: {
    newNote: function(category) {
      const element = document.getElementsByClassName('is-active el-menu-item')
      if (element[0]) {
        element[0].classList.remove('is-active');
      }
      this.$emit('newNote', category);
    },

    closeDialog: function() {
      this.dialogVisible = false;
      this.newCategory = '';
    },

    addCategory: function() {
      this.dialogVisible = false;
      this.$emit('newCategory', this.newCategory);
      this.newCategory = '';
    }
  }
}
</script>

<style scoped lang="scss">
.aside {
    border-right-style: solid;
    border-width: 1px;
    border-color: #DCDFE6;
    height: calc(100vh - 70px);
}

ul {
    border-right: none;
}

.new-category {
    font-size: 0.9rem;
    padding-left: 20px;
    color: #909399;
}

.plus {
    font-size: 1.2rem;
    margin-left: 10px;
}

.add-note {
    display: flex;
    align-items: center;
}

.add-note:hover,
.new-category:hover {
    cursor: pointer;
    color: #409EFF;
}
</style>
