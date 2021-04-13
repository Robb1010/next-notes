<template>
  <div>
    <el-input
      type="textarea"
      placeholder="Please input"
      v-model="editable"
      @input="$emit('textArea', $event)"
      >
    </el-input>
  </div>
 </template>

 <script>
  export default {
    name: "MDEditor",
    props: ['content'],

    data: function () {
      return {
        editable: ''
      }
    },

    methods: {
      scroll: function() {
        return this.$emit('scrolled', (event.target.scrollTop * 100)/event.target.scrollHeight);
      }
    },

      mounted: function() {
        this.editable = this.content;
        document.getElementsByTagName("TEXTAREA")[0].addEventListener('scroll', this.scroll);
      }
  }
 </script>

 <style scoped>
  ::v-deep textarea {
    width: 100% !important;
    height: 80vh;
    border: none;
    border-right: solid;
    border-radius: 0;
    border-color: #DCDFE6;
    border-width: 1px;
    resize: none;
  }

  ::v-deep textarea:hover {
    border-color: #DCDFE6;
  }
 </style>
