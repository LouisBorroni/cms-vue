import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Cart from "../views/Cart.vue";
import Orders from "../views/Orders.vue";
import AdminUser from "../views/AdminUser.vue";
import AdminArticles from "../views/AdminArticle.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    component: AdminUser,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/articles",
    name: "AdminArticles",
    component: AdminArticles,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
