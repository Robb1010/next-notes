<template>
  <div>
    <el-input
      type="textarea"
      placeholder="Please input"
      v-model="editable"
      @input="$emit('textArea', $event)"
      @keydown.ctrl.83="testCtrl"
      @keyup.alt.83="testCtrl"
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
      },
      testCtrl: function() {
        console.log("pressed");
      }
    },

      mounted: function() {
        this.editable = this.content;
        document.getElementsByTagName("TEXTAREA")[0].addEventListener('scroll', this.scroll);
        document.getElementsByTagName("TEXTAREA")[0].addEventListener('keydown', function(event) {
          if(event.code === "KeyS" && event.ctrlKey) {
            this.$emit('save');
          }
        }.bind(this));
      }
  }
 </script>

 <style scoped lang="scss">
  ::v-deep textarea {
    width: 100% !important;
    height: calc(100vh - 70px - 50px);
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
