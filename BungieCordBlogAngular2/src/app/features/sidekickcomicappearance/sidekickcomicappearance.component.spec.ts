import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidekickcomicappearanceComponent } from './sidekickcomicappearance.component';

describe('SidekickcomicappearanceComponent', () => {
  let component: SidekickcomicappearanceComponent;
  let fixture: ComponentFixture<SidekickcomicappearanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidekickcomicappearanceComponent]
    });
    fixture = TestBed.createComponent(SidekickcomicappearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
