import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicappearanceComponent } from './comicappearance.component';

describe('ComicappearanceComponent', () => {
  let component: ComicappearanceComponent;
  let fixture: ComponentFixture<ComicappearanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComicappearanceComponent]
    });
    fixture = TestBed.createComponent(ComicappearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
