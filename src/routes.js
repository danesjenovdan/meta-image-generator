const ParlameterGeneric = () => import('./views/parlameter/Generic.vue');
const ParlameterCircle = () => import('./views/parlameter/Circle.vue');

export const routes = [
  { path: '/parlameter/generic', component: ParlameterGeneric },
  { path: '/parlameter/circle', component: ParlameterCircle },
];
