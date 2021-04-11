<template>
<el-main v-html="mdToHTML" direction="vertical" v-on:scroll.native="scroll" id="reader"></el-main>
</template>

<script>
import marked from 'marked';

export default {
  components: {},
  name: "MDViewer",
  props: ['content', 'scrollTo'],

  methods: {
    scroll: function(event) {
      console.log((event.target.scrollTop * 100) / event.target.scrollHeight);
    }
  },

  computed: {
    mdToHTML: function() {
      return marked(this.content);
    }
  },

  watch: {
    scrollTo: function() {
      const reader = document.getElementById("reader");
      console.log(reader.scrollDown);
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
