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
    path: "",
    redirectTo: "home",
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
