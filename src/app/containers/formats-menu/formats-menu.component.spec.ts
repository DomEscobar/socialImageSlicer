import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatsMenuComponent } from './formats-menu.component';

describe('FormatsMenuComponent', () => {
  let component: FormatsMenuComponent;
  let fixture: ComponentFixture<FormatsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
