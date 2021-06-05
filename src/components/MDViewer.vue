<template>
  <el-main v-html="mdToHTML" direction="vertical" id="reader" />
</template>

<script>
import marked from "marked";

export default {
  components: {},
  name: "MDViewer",
  props: ["content", "scrollTo"],

  computed: {
    mdToHTML: function () {
      return marked(this.content);
    },
  },

  watch: {
    scrollTo: function () {
      const reader = document.getElementById("reader");
      const targetPos = (this.scrollTo * reader.scrollHeight) / 100;
      reader.scrollTo(0, targetPos);
    },
  },
};
</script>

<style scoped lang="scss">
.el-main {
  height: calc(100vh - 70px - 50px);
}
</style>
