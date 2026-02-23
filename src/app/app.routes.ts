import { Routes } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees';
import { Login} from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './layout/layout';
import { Departments} from './pages/departments/departments';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'layout',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard},
      { path: 'employees', component: EmployeesComponent },
     { path: 'departments', component: Departments}

    ]
  }
];
