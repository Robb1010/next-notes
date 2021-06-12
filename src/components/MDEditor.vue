<template>
  <div>
    <el-input
      type="textarea"
      :placeholder="$t('editor.input')"
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
  props: ["content"],

  data: function () {
    return {
      editable: "",
    };
  },

  methods: {
    scroll: function () {
      return this.$emit(
        "scrolled",
        (event.target.scrollTop * 100) / event.target.scrollHeight
      );
    },
    testCtrl: function () {
      console.log("pressed");
    },
  },

  mounted: function () {
    this.editable = this.content;
    document
      .getElementsByTagName("TEXTAREA")[0]
      .addEventListener("scroll", this.scroll);
    document.getElementsByTagName("TEXTAREA")[0].addEventListener(
      "keydown",
      function (event) {
        if (event.code === "KeyS" && event.ctrlKey) {
          this.$emit("save");
        }
      }.bind(this)
    );
  },
};
</script>

<style scoped lang="scss">
::v-deep textarea {
  width: 100% !important;
  height: calc(100vh - 70px - 50px);
  border-radius: 0;
  border: 1px none #dcdfe6;
  border-right-style: solid;
  resize: none;
}

.el-textarea {
  ::-webkit-scrollbar {
    width: 4px;
    -webkit-border-radius: 4px;
  }

  ::-webkit-scrollbar:hover {
    width: 8px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    width: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    background-color: #dcdfe6;
  }

  ::-webkit-scrollbar-thumb:hover {
    width: 8px;
  }
}
</style>
