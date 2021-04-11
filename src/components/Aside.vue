<template>
<el-aside class="aside" width="230px">
  <el-menu>
    <el-submenu :index="index.toString()" v-for="(category, index) in categories" :key="index">
      <template #title>{{category === '' ? "Unassigned" : category}}</template>
      <el-menu-item-group>
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
}
</script>

<style scoped>
.aside {
  border-right-style: solid;
  border-width: 1px;
  border-color: #DCDFE6;
}
</style>
