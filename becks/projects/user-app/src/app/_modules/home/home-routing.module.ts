import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoadingComponent } from "../utils/_components/loading/loading.component";
import { SectionForgetPassComponent } from './_components/section-forget-pass/section-forget-pass.component';
import { SectionRequestConfirmComponent } from './_components/section-request-confirm/section-request-confirm.component';
import { HomePage } from "./_pages/home/home.page";
import { OnboardingPagePage } from './_pages/onboarding-page/onboarding-page.page';

const routes: Routes = [
    { path: "", component: HomePage },
    {path: "onboarding", component: OnboardingPagePage},
    { path: "recovery", component: SectionForgetPassComponent },
    { path: "recovery-confirm", component: SectionRequestConfirmComponent },
    
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
//
