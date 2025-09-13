import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedUserManagementComponent } from './advanced-user-management.component';

describe('AdvancedUserManagementComponent', () => {
  let component: AdvancedUserManagementComponent;
  let fixture: ComponentFixture<AdvancedUserManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedUserManagementComponent]
    });
    fixture = TestBed.createComponent(AdvancedUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
