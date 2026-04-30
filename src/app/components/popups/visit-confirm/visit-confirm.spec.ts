import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitConfirm } from './visit-confirm';

describe('VisitConfirm', () => {
  let component: VisitConfirm;
  let fixture: ComponentFixture<VisitConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
