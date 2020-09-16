import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActiveListPage } from './active-list.page';

describe('ActiveListPage', () => {
  let component: ActiveListPage;
  let fixture: ComponentFixture<ActiveListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
