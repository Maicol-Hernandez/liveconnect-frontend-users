import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { CrudUsers } from './crud/users/crud.users';
import { Empty } from './empty/empty';
import { authGuard } from '../core/guards/auth.guard';

export default [
  // { path: 'documentation', component: Documentation },
  // { path: 'crud', component: Crud },
  {
    path: 'users',
    component: CrudUsers,
    // canActivate: [authGuard]
  },
  { path: 'empty', component: Empty },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
