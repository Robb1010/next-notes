<template>
<el-container direction="vertical" class="aside-min">
</el-container>
</template>

<script>
export default {
  name: "AsideMin"
}
</script>

<style scoped>
  .aside-min {
    min-width: 40px;
    max-width: 40px;
    border-right: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    height: calc(100vh - 60px)
  }
</style>