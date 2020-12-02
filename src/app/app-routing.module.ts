import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AuthGuardService } from './modules/auth/auth.gaurd';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PermissionComponent } from './modules/permission/permission.component';


const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [
    {
      path: '',
      component: DashboardComponent,
      canActivate: [AuthGuardService]
    },
    {
      path: 'permission',
      component: PermissionComponent,
      canActivate: [AuthGuardService]
    },
    {
      path: 'auth',
      component: AuthComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
