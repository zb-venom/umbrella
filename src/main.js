import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { dragscrollNext } from "vue-dragscroll";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faSync,
  faCheck,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faFileWord,
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileExcel,
  faFilePowerpoint,
  faFilePdf,
  faFileArchive,
  faFileAlt,
  faFileCode,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUser,
  faSync,
  faCheck,
  faPaperclip,
  faFileWord,
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileExcel,
  faFilePowerpoint,
  faFilePdf,
  faFileArchive,
  faFileAlt,
  faFileCode
);
dom.watch();

createApp(App)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .directive("dragscroll", dragscrollNext)
  .mount("#app");
