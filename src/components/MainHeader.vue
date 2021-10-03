<template>
<el-header class="header" >
  <el-row v-if="current" class="note-actions">
    <el-col :md="{span: 12}" class="left-side">
      <p v-if="!editingTitle" v-html="note.title" />
      <el-input
          class="title-input"
          v-if="editingTitle"
          @keyup.enter.native="editTitle"
          v-bind:value="titleValue"
          @input="changeTitle"
      ></el-input>
      <el-tooltip
          effect="dark"
          :content="$t('actions.edit_title')"
          placement="top"
          v-if="!editingTitle && note.title"
      >
        <i class="el-icon-edit clickable" @click="editTitle" />
      </el-tooltip>
      <i class="el-icon-right" @click="editTitle" v-if="editingTitle" />

      <el-tooltip
          effect="dark"
          :content="$t('actions.add_favorite')"
          placement="right"
          v-if="!note.favorite && note.title"
      >
        <i class="el-icon-star-off clickable" @click="favoriteNote" />
      </el-tooltip>
      <el-tooltip
          effect="dark"
          :content="$t('actions.remove_favorite')"
          placement="right"
          class="unselectable"
          v-if="note.favorite && note.title"
      >
        <i class="el-icon-star-on clickable" @click="favoriteNote" />
      </el-tooltip>
    </el-col>

    <el-col :md="{span: 12}" class="right-side">
  <el-popover placement="top" width="260" v-model="deletePop">
    <p>{{ $t("actions.delete_confirmation") }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="deletePop = false"
      >{{ $t("actions.no") }}</el-button
      >
      <el-button type="danger" size="mini" @click="deleteNote"
      >{{ $t("actions.yes") }}</el-button
      >
    </div>
    <i slot="reference" class="el-icon-delete clickable" />
  </el-popover>
    <div @click="saveNote">
      <i class="el-icon-upload clickable" v-if="!loading"> </i>
      <i class="el-icon-loading" v-if="loading"> </i>
    </div>

  <el-tooltip
      effect="dark"
      :content="$t('actions.views')"
      placement="top-start"
  >
    <div class="switcher clickable" @click="cycleView">
      <i class="el-icon-c-scale-to-original"> </i>
      <i class="el-icon-edit-outline"> </i>
      <i class="el-icon-view"> </i>
    </div>
  </el-tooltip>
    </el-col>
  </el-row>
</el-header>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "MainHeader",
  data() {
    return {
      deletePop: false,
      loading: false,
      note: {},
      span: this.$store.state.span,
      editingTitle: false,
      titleValue: '',
      current: null
    }
  },
  methods: {
    async updateNote() {
      await ipcRenderer.invoke(
          "update-note",
          this.$store.state.credentials,
          this.note
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
    },
    async deleteNote() {
      this.$store.commit("setNoteLoading", true);
      const noteId = this.$store.state.current;
      this.deletePop = false;
      await ipcRenderer.invoke("delete-note",
          this.$store.state.credentials,
          noteId
      )
      .then(async res => {
        if (res.error) {
          await this.$store.dispatch("triggerError", {
            message: this.$t("errors.delete_note"),
            timeout: 3000
          });
        } else {
          // Success
          await this.$store.commit("deleteNote", this.$store.state.current);
          this.$store.commit("updateNotesArr");
        }
      });
      this.$store.commit("setCurrent", null);
      this.$store.commit("setNoteLoading", false);
    },
    async favoriteNote() {
      this.$store.state.noteLoading = true;
      this.note.favorite = !this.note.favorite;
      await this.updateNote();
      await this.$store.commit("updateFavorites");
      await this.$store.commit("updateNote", this.note);
      this.$store.state.noteLoading = false;
    },
    cycleView() {
      const viewCycle = this.$store.state.viewCycle;
      if (viewCycle === 0) {
        this.$store.commit("setViewCycle", 1);
        this.$store.commit("setSpan", 24);
        this.$store.commit("setViewerVisibility", false);
      } else if (viewCycle === 1) {
        this.$store.commit("setViewCycle", 2);
        this.$store.commit("setViewerVisibility", true);
        this.$store.commit("setEditorVisibility", false);
      } else if (viewCycle === 2) {
        this.$store.commit("setViewCycle", 0);
        this.$store.commit("setEditorVisibility", true);
        this.$store.commit("setViewerVisibility", true);
        this.$store.commit("setSpan", 12);
      }
    },
    async editTitle() {
      this.$store.state.noteLoading = true;
      if (!this.editingTitle) {
        this.titleValue = this.note.title;
      }
      if (this.editingTitle) {
        this.note.title = this.titleValue;
      }
      this.editingTitle = !this.editingTitle;
      await this.updateNote();
      await this.$store.commit("updateNote", this.note);
      this.$store.state.noteLoading = false;
    },
    changeTitle: function (event) {
      this.titleValue = event;
    },
    async saveNote() {
      this.$store.state.noteLoading = true;
      this.note = this.$store.getters.note(this.$store.state.current);
      await this.updateNote();
      this.$store.state.noteLoading = false;
    }
  },
  computed: {
    watchLoading() {
      return this.$store.state.noteLoading;
    },
    watchCurrent() {
      return this.$store.state.current;
    }
  },
  watch: {
    watchLoading() {
      this.loading = this.$store.state.noteLoading;
    },
    watchCurrent() {
      this.current = this.$store.state.current;
      this.note = this.$store.getters.note(this.$store.state.current);
    }
  }
}
</script>

<style scoped lang="scss">
  header {
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: #dcdfe6;
    display: flex;
    align-items: center;
  }

  .note-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .clickable {
    cursor: pointer;
  }

  i {
    font-size: 1.7rem;
    margin-left: 10px;
    margin-right: 10px;
  }

  .left-side {
    i {
      font-size: 1.2rem;
    }
  }

  .el-row {
    width: 100%;
  }

  .el-col {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .right-side {
    justify-content: flex-end;
  }

  .title-input {
    width: 150px;
  }

  .switcher {
    i {
      font-size: 0.9rem;
      margin-left: 0px;
      margin-right: 0px;
    }
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 30px;
  }
</style>