import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import CalendarView from '../views/CalendarView.vue';
import TeamsView from '../views/TeamsView.vue';
import LeaguesView from '../views/LeaguesView.vue';
import EventsView from '../views/EventsView.vue';
import TeamDetail from '../views/TeamDetail.vue';
import LeagueDetail from '../views/LeagueDetail.vue';
import ResetPassword from '../views/ResetPassword.vue';
import RequestPasswordReset from '../views/RequestPasswordReset.vue';
import Register from '../views/Register.vue';
import EventDetail from '../views/EventDetail.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/calendar', component: CalendarView },
  { path: '/teams', component: TeamsView },
  { path: '/leagues', component: LeaguesView },
  { path: '/events', component: EventsView },
  { path: '/teams/:id', component: TeamDetail },
  { path: '/register', component: Register},
  { path: '/leagues/:id', component: LeagueDetail },
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/request-password-reset/', component: RequestPasswordReset },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Login },
  { path: '/events/:id', name: 'EventDetail', component: EventDetail}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;
