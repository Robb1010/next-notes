import Vue from "vue";
import Element from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import { ipcRenderer } from "electron";

async function setTheme() {
  if (window.localStorage.getItem("theme") === "true") {
    import("element-theme-chalk");
  } else if (window.localStorage.getItem("theme") === "false") {
    import("element-theme-dark");
  } else {
    const darkTheme = await ipcRenderer
      .invoke("handle-theme")
      .then((res) => res);
    window.localStorage.setItem("theme", (!darkTheme).toString());
    setTheme().then(r => console.log(r));
  }
}

setTheme().then(r => console.log(r));

Vue.use(Element, { locale });
