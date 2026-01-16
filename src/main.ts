import { createApp } from "vue";
import { createPinia } from 'pinia';
// TDesign styles only (components are auto-imported)
import "tdesign-vue-next/es/style/index.css";
// Import custom premium dark theme
import "./styles/theme.css";
import App from "./App.vue";
import i18n from "./i18n";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);

app.mount("#app");
