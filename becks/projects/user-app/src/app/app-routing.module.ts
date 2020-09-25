import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./_modules/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "recovery",
    loadChildren: () =>
      import("./_modules/user/_modules/profile/profile.module").then(
        (m) => m.ProfileModule
      ),
  },

  {
    path: "age-gate",
    loadChildren: () =>
      import("./_modules/age-gate/age-gate.module").then(
        (m) => m.AgeGateModule
      ),
  },
  {
    path: "",
    redirectTo: "age-gate",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
