import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoadingComponent } from "../utils/_components/loading/loading.component";
import { HomePage } from "./_pages/home/home.page";

const routes: Routes = [
  { path: "", component: HomePage },
  { path: "loading", component: LoadingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
//
