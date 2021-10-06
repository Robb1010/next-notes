<template>
<div>
    <el-container>
      <h1 class="hide-btn-left" v-if="hideAside" @click="hideAside = !hideAside"><i class="el-icon-d-arrow-left" /></h1>
      <h1 class="hide-btn-right" v-if="!hideAside" @click="hideAside = !hideAside"><i class="el-icon-d-arrow-right" /></h1>
      <h1 class="search-btn" v-if="!hideAside" @click="minnedSearch"><i class="el-icon-search"></i></h1>
      <h1 class="plus-btn" @click="minnedNewNote" v-if="!hideAside"><i class="el-icon-plus"></i></h1>
      <el-alert v-if="error"
                class="error-alert"
                :title="$store.state.errorMsg"
                type="error"
                effect="light" />

        <AsideMin v-if="!hideAside" />
        <Aside v-if="hideAside" :newNoteCategory="newNoteCategory" />

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
import AsideMin from './AsideMin';
import MDEditor from './MDEditor';
import MDViewer from './MDViewer';
import MainHeader from './MainHeader';
import { ipcRenderer } from 'electron';

export default {
  name: "Main",
  components: {
    Aside,
    AsideMin,
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
      hideAside: true,
      newNoteCategory: null
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
    },

    minnedSearch: function () {
      this.hideAside = !this.hideAside;
      setTimeout(() => document.getElementsByClassName("el-input__inner")[0].focus(), 200);
    },
    minnedNewNote: function () {
      let category = '';
      this.hideAside = !this.hideAside;

      if(this.$store.state.current) {
        category = this.$store.state.notes[this.$store.state.current].category;
      }

      setTimeout(() => {
        this.newNoteCategory = category;
      }, 200);
      this.newNoteCategory = null;
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

  .plus-btn, .search-btn, .hide-btn-right {
    position: absolute;
    z-index: 99;
    margin-left: 7px;
    cursor: pointer;
  }
  .hide-btn-left, .hide-btn-right {
    position: absolute;
    z-index: 99;
    margin-top: 5px;
    margin-left: 7px;
    cursor: pointer;
  }

.plus-btn:hover, .search-btn:hover, .hide-btn-right:hover, .hide-btn-left:hover {
  color: #1fa1ff;
}

  .hide-btn-left {
    margin-left: 190px;
  }

  .search-btn {
    margin-top: 40px;
  }

  .plus-btn {
    margin-top: 80px;
  }
</style>
