import { createRouter, createWebHashHistory } from "vue-router";
import mainPage from "@/views/mainPage";

const routes = [
  {
    path: "/",
    name: "table",
    component: mainPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
