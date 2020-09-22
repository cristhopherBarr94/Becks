import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './_services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'activation',
    loadChildren: () => import('./_modules/activation/activation.module').then(m => m.ActivationPageModule),
    // canActivate: [AuthGuardService] 
  },
  {
    path: 'login',
    loadChildren: () => import('./_modules/login/login.module').then(m => m.LoginModule)
  },


];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 150]
}

@NgModule({
  imports: [
    RouterModule.forRoot( routes, routerOptions )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
