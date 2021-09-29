<template>
  <div>
    <el-input
      type="textarea"
      :placeholder="$t('editor.input')"
      v-model="editable"
      @input="input"
    >
    </el-input>
  </div>
</template>

<script>
export default {
  name: "MDEditor",
  data: function () {
    return {
      editable: "",
      current: this.$store.state.current,
    };
  },

  methods: {
    scroll: function () {
      return this.$emit(
        "scrolled",
        (event.target.scrollTop * 100) / event.target.scrollHeight
      );
    },
    input: function (input) {
      let note = this.$store.getters.note(this.$store.getters.current);
      note.content = input;
      this.$store.commit("updateNote", note);
      this.$emit('textArea', input);
    }
  },

  mounted: function () {
    this.editable = this.$store.getters.note(this.current).content;
    this.$emit('textArea', this.$store.getters.note(this.$store.getters.current).content);
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
  computed: {
    watchCurrent() {
      return this.$store.state.current;
    }
  },
  watch: {
    watchCurrent() {
      if(this.current !== null) {
        this.editable = this.$store.getters.note(this.$store.getters.current).content;
        this.$emit('textArea', this.$store.getters.note(this.$store.getters.current).content);
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep textarea {
  width: 100% !important;
  height: calc(100vh - 60px - 60px);
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
