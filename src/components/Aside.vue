<template>
<el-aside class="aside" width="230px">
  <el-menu :default-openeds="['0']">
    <el-submenu :index="index.toString()" v-for="(category, index) in categories" :key="index">
      <template #title>{{category === '' ? "Unassigned" : category}}</template>
      <el-menu-item-group>
        <template slot="title">
          <div class="add-note" @click="newNote"><span>Create a new note</span> <span class="plus">+</span></div>
        </template>
        <template v-for="(note, index) in notes">
          <el-menu-item @click="$emit('option', note)" :index="category + '-' + index" v-if="note.category === category" :key="index" v-html="note.title" />
        </template>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</el-aside>
</template>

<script>
export default {
  name: 'Aside',
  props: ['categories', 'notes'],

  methods: {
    newNote: function() {
      const element = document.getElementsByClassName('is-active el-menu-item')
      if (element[0]) {
        element[0].classList.remove('is-active');
      }
      this.$emit('newNote');
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

.plus {
  font-size: 1.2rem;
  margin-left: 10px;
}

.add-note {
  display: flex;
  align-items: center;
}

.add-note:hover {
  cursor: pointer;
  color: #409EFF;
}
</style>
