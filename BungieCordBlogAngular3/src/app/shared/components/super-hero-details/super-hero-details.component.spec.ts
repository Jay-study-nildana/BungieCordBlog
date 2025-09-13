import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperHeroDetailsComponent } from './super-hero-details.component';

describe('SuperHeroDetailsComponent', () => {
  let component: SuperHeroDetailsComponent;
  let fixture: ComponentFixture<SuperHeroDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperHeroDetailsComponent]
    });
    fixture = TestBed.createComponent(SuperHeroDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
