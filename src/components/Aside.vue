<template>
  <div>
    <el-aside class="aside" width="230px">
      <p class="new-category unselectable" @click="dialogVisible = true">
        <span>{{ $t("aside.new_category") }}</span> <span class="plus"> + </span>
      </p>
      <el-menu :default-active="defaultOpen">
        <el-submenu index="-1" class="unselectable">
          <template slot="title"> {{ $t("aside.favorites") }} </template>
          <template v-for="(note, index) in notes">
            <el-menu-item
              @click="menuClick(note, index)"
              :index="'item-' + index"
              v-if="note.favorite"
              :key="index"
              v-html="note.title"
              class="unselectable"
            />
          </template>
        </el-submenu>
        <el-submenu
          :index="index.toString()"
          v-for="(category, index) in categories"
          :key="index"
          class="unselectable"
        >
          <template slot="title" class="unselectable">
            {{ category === "" ? $t("aside.unassigned") : category }}</template
          >
          <el-menu-item-group>
            <template slot="title">
              <div class="add-note" @click="newNote(category)">
                <span class="unselectable">{{ $t("aside.new_note") }}</span> <span class="plus unselectable"> + </span>
              </div>
            </template>
            <template v-for="(note, index) in notes">
              <el-menu-item
                @click="menuClick(note, index)"
                :index="'item-' + index"
                v-if="note.category === category"
                :key="index"
                v-html="note.title"
                class="unselectable"
              />
            </template>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-dialog
      :title="$t('aside.add_category')"
      :visible.sync="dialogVisible"
      width="30%"
      class="unselectable"
    >
      <el-input
        :placeholder="$t('aside.category_name')"
        v-model="newCategory"
        @keyup.enter.native="addCategory"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t("actions.cancel") }}</el-button>
        <el-button type="primary" @click="addCategory">{{ $t("actions.confirm") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Aside",
  props: ["categories", "notes"],

  data() {
    return {
      dialogVisible: false,
      newCategory: "",
      defaultOpen: "menu-0",
      notesSize: 0,
    };
  },

  methods: {
    newNote: function (category) {
      const element = document.getElementsByClassName("is-active el-menu-item");
      if (element[0]) {
        element[0].classList.remove("is-active");
      }
      this.$emit("newNote", category);
      this.defaultOpen = "item-0";
    },

    closeDialog: function () {
      this.dialogVisible = false;
      this.newCategory = "";
    },

    addCategory: function () {
      this.dialogVisible = false;
      this.$emit("newCategory", this.newCategory);
      this.newCategory = "";
    },

    menuClick: function (note, index) {
      localStorage.defaultOpen = `item-${index}`;
      localStorage.activeId = note.id;
      this.$emit("option", note, index);
      this.defaultOpen = `item-${index}`;
    },
  },

  mounted() {
    if (localStorage.defaultOpen) {
      this.defaultOpen = localStorage.defaultOpen;
    }
  },

  watch: {
    notes: function () {
      if (this.noteSize === 0) {
        this.noteSize = this.notes.length;
      } else if (this.noteSize < this.notes.length) {
        this.defaultOpen = "item-0";
        localStorage.defaultOpen = "0";
      } else if (this.noteSize > this.notes.length) {
        this.defaultOpen = "-1";
        localStorage.defaultOpen = "-1";
      }

      this.noteSize = this.notes.length;
    },
  },
};
</script>

<style scoped lang="scss">
.aside {
  border-right-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  height: calc(100vh - 70px);
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}

ul {
  border-right: none;
}

.new-category {
  font-size: 0.9rem;
  padding-left: 20px;
  color: #909399;
}

.plus {
  font-size: 1.2rem;
  margin-left: 10px;
}

.add-note {
  display: flex;
  align-items: center;
}

.add-note:hover,
.new-category:hover {
  cursor: pointer;
  color: #409eff;
}
</style>
