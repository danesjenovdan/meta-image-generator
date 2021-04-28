const ParlameterGeneric = () => import('./views/parlameter/Generic.vue');
const ParlameterCircle = () => import('./views/parlameter/Circle.vue');

const routes = [
  { path: '/parlameter/generic', component: ParlameterGeneric },
  { path: '/parlameter/circle', component: ParlameterCircle },
];

// eslint-disable-next-line import/prefer-default-export
export { routes };
