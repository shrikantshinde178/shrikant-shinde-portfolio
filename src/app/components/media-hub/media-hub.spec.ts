import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaHub } from './media-hub';

describe('MediaHub', () => {
  let component: MediaHub;
  let fixture: ComponentFixture<MediaHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
