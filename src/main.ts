import { createApp } from "vue";
import { createPinia } from 'pinia';
import TDesign from "tdesign-vue-next";
import "tdesign-vue-next/es/style/index.css";
// Import custom premium dark theme
import "./styles/theme.css";
import App from "./App.vue";
import i18n from "./i18n";

// Remove hardcoded theme setting
// document.documentElement.setAttribute('theme-mode', 'dark');

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(TDesign);
app.use(i18n);

app.mount("#app");
