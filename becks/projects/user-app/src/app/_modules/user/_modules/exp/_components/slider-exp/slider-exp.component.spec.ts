import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SliderExpComponent } from './slider-exp.component';

describe('SliderExpComponent', () => {
  let component: SliderExpComponent;
  let fixture: ComponentFixture<SliderExpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderExpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SliderExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
