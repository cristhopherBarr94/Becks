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
    path: 'admin',
    loadChildren: () => import('./_modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuardService] 
  },
  {
    path: 'home',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./_modules/home/_modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./_modules/utils/_pages/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./_modules/utils/_pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule),
  },
  {
    path: "**",
    loadChildren: () =>
      import("./_modules/not-found/not-found.module").then(
        (m) => m.NotFoundPageModule
      ),
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
