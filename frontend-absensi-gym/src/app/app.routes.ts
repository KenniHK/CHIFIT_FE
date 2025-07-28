import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardUserComponent } from './pages/user-dashboard/user-dashboard.component';
import { authGuard } from './services/auth.guard';
import { DashboardAdminComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard-user', component: DashboardUserComponent, canActivate: [authGuard]},
  { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [authGuard]}
  // nanti tambahkan route dashboard di sini
];
