import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserextrainfoComponent } from './userextrainfo.component';

describe('UserextrainfoComponent', () => {
  let component: UserextrainfoComponent;
  let fixture: ComponentFixture<UserextrainfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserextrainfoComponent]
    });
    fixture = TestBed.createComponent(UserextrainfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
