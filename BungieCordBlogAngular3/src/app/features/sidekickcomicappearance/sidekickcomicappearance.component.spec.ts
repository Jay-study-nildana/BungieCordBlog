import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidekickComicAppearanceComponent } from './sidekickcomicappearance.component';

describe('SidekickcomicappearanceComponent', () => {
  let component: SidekickComicAppearanceComponent;
  let fixture: ComponentFixture<SidekickComicAppearanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidekickComicAppearanceComponent]
    });
    fixture = TestBed.createComponent(SidekickComicAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
