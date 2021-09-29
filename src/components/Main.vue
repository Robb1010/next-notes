<template>
<div>
    <el-container>
      <el-alert v-if="error"
                class="error-alert"
                :title="$store.state.errorMsg"
                type="error"
                effect="light" />
      <Aside />

      <el-container class="content">
        <MainHeader />
      <el-row :gutter="10" v-if="this.$store.getters.current !== null">
        <el-col
            :md="{ span: span }"
            :sm="{ span: 24 }"
            v-if="editorVisibility"
        >

        <MDEditor
            @save="save"
            @scrolled="scroll"
            @textArea="textUpdate"
        />
        </el-col>

          <el-col
              :md="{ span: span }"
              :sm="{ span: 24 }"
              v-if="viewerVisibility"
          >
        <MDViewer
            v-bind:content="noteContent"
            v-bind:scrollTo="scrollTo"
        />

        </el-col>
      </el-row>
      </el-container>
    </el-container>
</div>
</template>

<script>
import Aside from './Aside';
import MDEditor from './MDEditor';
import MDViewer from './MDViewer';
import MainHeader from './MainHeader';
import { ipcRenderer } from 'electron';

export default {
  name: "Main",
  components: {
    Aside,
    MDEditor,
    MDViewer,
    MainHeader
  },
  data() {
    return {
      noteContent: "",
      scrollTo: 0,
      error: false,
      errorMsg: '',
      span: 12,
      editorVisibility: true,
      viewerVisibility: true,
    }
  },
  methods: {
    save: async function () {
      this.$store.state.noteLoading = true;
      await ipcRenderer.invoke(
          "update-note",
          this.$store.state.credentials,
          this.$store.getters.note(this.$store.getters.current)
      )
      .then(async res => {
            if(res.error) {
              await this.$store.dispatch("triggerError", {
                message: this.$t("errors.new_note"),
                timeout: 3000
              });
            }
      })
          .catch(async err => {
            console.log(err);
            await this.$store.dispatch("triggerError", {
              message: this.$t("errors.new_note"),
              timeout: 3000
            });
          });
      this.$store.state.noteLoading = false;
    },

    scroll: function (value) {
      this.scrollTo = value;
    },

    textUpdate: function () {
      this.noteContent = this.$store.getters.note(this.$store.state.current).content;
    }
  },
  computed: {
    watchError() {
      return this.$store.state.error;
    },
    watchSpan() {
      return this.$store.state.span;
    },
    watchViewerVisibility() {
      return this.$store.state.viewerVisibility;
    },
    watchEditorVisibility() {
      return this.$store.state.editorVisibility;
    }
  },
  watch: {
    watchError() {
      this.error = this.$store.state.error;
    },
    watchSpan() {
      this.span = this.$store.state.span;
    },
    watchViewerVisibility() {
      this.viewerVisibility = this.$store.state.viewerVisibility;
    },
    watchEditorVisibility() {
      this.editorVisibility = this.$store.state.editorVisibility;
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;

  .el-row {
    width: 100%;
  }
}
</style>