<template>
<el-main v-html="mdToHTML" direction="vertical" id="reader"></el-main>
</template>

<script>
import marked from 'marked';

export default {
  components: {},
  name: "MDViewer",
  props: ['content', 'scrollTo'],

  computed: {
    mdToHTML: function() {
      return marked(this.content);
    }
  },

  watch: {
    scrollTo: function() {
      const reader = document.getElementById("reader");
      const targetPos = this.scrollTo * reader.scrollHeight / 100;
      reader.scrollTo(0, targetPos);
    }
  }
}
</script>

<style scoped>
.el-main {
  height: 80vh;
}
</style>
