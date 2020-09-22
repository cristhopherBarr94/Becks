import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './_services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./_modules/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'activation',
    loadChildren: () => import('./_modules/activation/activation.module').then(m => m.ActivationPageModule),
    canActivate: [AuthGuardService] 
  },
  {
    path: 'login',
    loadChildren: () => import('./_modules/login/login.module').then(m => m.LoginModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
