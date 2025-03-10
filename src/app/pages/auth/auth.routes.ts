import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login/login';
import { Register } from './register/register';
import { Error } from './error';
import { noAuthGuard } from '../../core/guards/auth.guard';

export default [
  // { path: 'access', component: Access },
  // { path: 'error', component: Error },
  {
    path: 'login',
    component: Login,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [noAuthGuard]
  }
] as Routes;
