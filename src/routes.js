import ParlameterGeneric from './views/parlameter/Generic.vue';
import ParlameterCircle from './views/parlameter/Circle.vue';

// TODO: Convert to dynamic import when this bug is fixed https://github.com/vitejs/vite/issues/3101
// const ParlameterGeneric = () => import('./views/parlameter/Generic.vue');
// const ParlameterCircle = () => import('./views/parlameter/Circle.vue');

const routes = [
  { path: '/parlameter/generic', component: ParlameterGeneric },
  { path: '/parlameter/circle', component: ParlameterCircle },
];

// eslint-disable-next-line import/prefer-default-export
export { routes };
