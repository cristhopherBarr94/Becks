import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnboardingPagePage } from './onboarding-page.page';

describe('OnboardingPagePage', () => {
  let component: OnboardingPagePage;
  let fixture: ComponentFixture<OnboardingPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
