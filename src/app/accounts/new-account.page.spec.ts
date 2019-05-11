import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountPage } from './new-account.page';

describe('NewAccountPage', () => {
  let component: NewAccountPage;
  let fixture: ComponentFixture<NewAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
