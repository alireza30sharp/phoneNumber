import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxIntlTelInputPureComponent } from './ngx-pure-intl-tel.component';

describe('NgxIntlTelInputPureComponent', () => {
  let component: NgxIntlTelInputPureComponent;
  let fixture: ComponentFixture<NgxIntlTelInputPureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxIntlTelInputPureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxIntlTelInputPureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
