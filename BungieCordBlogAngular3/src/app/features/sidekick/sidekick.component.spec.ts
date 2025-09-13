import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidekickComponent } from './sidekick.component';

describe('SidekickComponent', () => {
  let component: SidekickComponent;
  let fixture: ComponentFixture<SidekickComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidekickComponent]
    });
    fixture = TestBed.createComponent(SidekickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
