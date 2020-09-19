import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./_modules/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'activation',
    pathMatch: 'full'
  },
  {
    path: 'activation',
    loadChildren: () => import('./_modules/activation/activation.module').then( m => m.ActivationPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
