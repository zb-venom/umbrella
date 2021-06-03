import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Umbrella | Login",
      guest: true,
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/Signup.vue"),
    meta: {
      title: "Umbrella | Signup",
      guest: true,
    },
  },

  //
  // Pages for auth users
  //
  {
    path: "/dialogs",
    name: "Dialogs",
    component: () => import("../views/Dialogs.vue"),
    meta: {
      title: "Umbrella | Dialogs",
      requiresAuth: true,
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: {
      beforeRouteEnter(to, from, next) {
        console.log(localStorage);
        localStorage.jwt = "";
        next({ path: "/" });
      },
    },
    meta: {
      title: "Umbrella | Logout",
      requiresAuth: true,
    },
  },

  //
  // Page not found (ERROR 404)
  //
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!localStorage.jwt) next({ path: "/login" });
    else next();
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.jwt) next({ path: "/dialogs" });
    else next();
  } else {
    next();
  }
});

export default router;
