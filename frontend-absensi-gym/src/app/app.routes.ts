import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardUserComponent } from './pages/user-dashboard/user-dashboard.component';
import { authGuard } from './services/auth.guard';
import { DashboardAdminComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { StopwatchComponent } from './pages/stopwatch/stopwatch.component';
import { UserLayoutComponent } from './pages/user-dashboard/user-layout/user-layout.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user-layout', 
    component: UserLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardUserComponent },
      { path: 'user-layout', component: UserLayoutComponent },
      { path: 'dashboard-user', component: DashboardUserComponent },
      { path: 'stopwatch', component: StopwatchComponent },
    ]
  },
  { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [authGuard]},

  // nanti tambahkan route dashboard di sini
];
