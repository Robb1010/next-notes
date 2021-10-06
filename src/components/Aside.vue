<template>
<el-aside width="220px" class="aside">
  <div class="search-box">
    <el-input v-model="search" :placeholder="$t('aside_component.search')" class="search"></el-input>
  </div>

  <el-dialog
      title="New category"
      :visible.sync="categoryVisible"
      width="30%">
    <el-input
        :placeholder="$t('aside_component.category_name')"
        v-model="categoryName"
        @keyup.enter.native="newCategory"
    />
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="newCategory">Confirm</el-button>
  </span>
  </el-dialog>
  <p class="new-category" @click="categoryVisible = true">{{ $t("aside_component.new_category") }}&nbsp;&nbsp;&nbsp;+</p>
  <el-menu :default-openeds="layout">
    <el-submenu index="1">
      <template slot="title"> {{ $t("aside_component.favorites") }} </template>
      <el-menu-item-group >
        <template v-for="(id, index) in favorites">
          <el-menu-item
              :index="'item-' + index"
              :key="index"
              v-html="$store.state.notes[id].title"
              @click="clickNote(id)"
          />
        </template>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title"> {{ $t("aside_component.unassigned") }} </template>
      <el-menu-item-group>
        <template slot="title">
          <div class="new-note" @click="createNote('')">
            {{ $t("aside_component.new_note") }}&nbsp;&nbsp;&nbsp;+
          </div>
        </template>
        <template v-for="(id, index) in notesArr">
          <el-menu-item
              v-if="$store.state.notes[id].category === ''"
              :index="'item-' + index"
              :key="index"
              v-html="$store.state.notes[id].title"
              @click="clickNote(id)"
          />
        </template>
      </el-menu-item-group>
    </el-submenu>
    <template v-for="(category, index) in categories">
      <el-submenu :index="(index + 3).toString()" :key="index">
        <template slot="title"> {{ category }} </template>
        <el-menu-item-group>
          <template slot="title">
            <div class="new-note" @click="createNote(category)">
              {{ $t("aside_component.new_note") }}&nbsp;&nbsp;&nbsp;+
            </div>
          </template>
          <template v-for="(id) in notesArr">
            <el-menu-item
              v-if="$store.state.notes[id].category === category"
              :index="'item-' + id"
              :key="id"
              v-html="$store.state.notes[id].title"
              @click="clickNote(id)"
            ></el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>
    </template>
  </el-menu>
</el-aside>
</template>

<script>
import { setLayout, getLayout } from '../helpers/localstorageoperations';
import { ipcRenderer } from "electron";

export default {
  name: "Aside",
  props: ['newNoteCategory'],
  data() {
    return {
      notes: this.$store.state.notes,
      layout: ['1'],
      categories: this.$store.state.categories,
      categoryName: '',
      categoryVisible: false,
      favorites: this.$store.getters.favorites,
      notesArr: this.$store.state.notesArr,
      search: '',
      oldLayout: []
    }
  },
  methods: {
    clickNote(noteId) {
      this.$store.commit('setCurrent', noteId);
    },
    async createNote(category) {
      this.$store.commit("setNoteLoading", true);
      await ipcRenderer.invoke("new-note",
          this.$store.state.credentials,
          category)
      .then(async res => {
          if (res.error) {
            await this.$store.dispatch("triggerError", {
              message: this.$t("errors.new_note"),
              timeout: 3000
            });
          } else {
            // Success
            await this.$store.commit("createNote", res);
            if(this.categories.indexOf(category) < 0 && category !== "") {
              this.categories = [...this.categories, category];
            }
            this.$store.commit("updateNotesArr");
            this.$store.commit("setCurrent", res.id);
          }
      })
      .catch(async err => {
        console.log(err);
        await this.$store.dispatch("triggerError", {
          message: this.$t("errors.new_note"),
          timeout: 3000
        });
      });
      this.$store.commit("setNoteLoading", false);
      },
    newCategory() {
      this.createNote(this.categoryName);
      this.categoryVisible = false;
      this.categoryName = '';
      this.$store.commit("updateNotesArr");
    }
  },

  computed: {
    watchNotes() {
      return this.$store.state.noteLoading;
    },
    watchCategories() {
      return this.$store.state.categories;
    },
    watchFavorites() {
      return this.$store.state.favorites;
    },
    watchNotesArr() {
      return this.$store.state.notesArr;
    }
  },

  watch: {
    newNoteCategory: function() {
      if(this.newNoteCategory !== null) {
        this.createNote(this.newNoteCategory);
      }
    },

    async watchNotes() {
      this.notes = {};
      this.notes = this.$store.state.notes;
    },
    async watchCategories() {
      this.notes = {};
      this.notes = this.$store.state.notes;
      this.categories = this.$store.state.categories;
    },
    async watchFavorites() {
      this.favorites = this.$store.state.favorites;
    },
    async watchNotesArr() {
      this.notesArr = this.$store.state.notesArr;
    },
    async search() {
      if(this.search.length === 0) {
        this.favorites = this.$store.getters.favorites;
        this.notesArr = this.$store.state.notesArr;
        this.layout = this.oldLayout;
        this.oldLayout = [];
      } else {
        if(this.oldLayout.length === 0) {
          this.oldLayout = await getLayout();
        }
        this.favorites = this.$store.getters.favorites;
        this.notesArr = this.$store.state.notesArr;
        const noOfCategories = this.categories.length + 2;
        let layout = [];
        for(let i = 1; i <= noOfCategories; i++) {
          layout.push(i.toString());
        }
        this.layout = layout;
        this.favorites = this.favorites.filter(id => {
           if (this.$store.state.notes[id].title.toLowerCase().includes(this.search.toLowerCase())) {
             return id;
           }
        });
        this.notesArr = this.notesArr.filter(id => {
          if (this.$store.state.notes[id].title.toLowerCase().includes(this.search.toLowerCase())) {
            return id;
          }
        });
      }
    }
  },
  mounted: async function () {
    await this.$store.commit("updateNotesArr");
    await this.$store.commit("updateCategories");
    const memLayout = await getLayout();
    if(memLayout) {
      this.layout = memLayout;
    }
    const categories = document.getElementsByClassName("el-submenu");
    [].map.call(categories, function (category) {
      category.onclick = function () {
        let layout = [];
        [].map.call(categories, function(category) {
          if(category.classList.contains("is-opened")) {
            layout.push(([].indexOf.call(categories, category) + 1).toString());
          }
        });
        setLayout(layout);
      }
    });
  }
}
</script>

<style scoped lang="scss">
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

.aside {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: left;
  border-right-style: solid;
  border-width: 1px;
  border-color: #dcdfe6;
  height: calc(100vh - 60px);

  .search-box {
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left: 20px;
    .search {
      width: 160px;
    }
  }

  ul {
    border-right: none;
  }

  .new-category {
    font-size: 15px;
    margin-left: 20px;
  }

  .new-category, .new-note {
    cursor: pointer;
  }

  .new-category:hover, .new-note:hover {
    color: #409eff;
  }
}
</style>