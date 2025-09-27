import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterPanelComponent } from './writer-panel.component';

describe('WriterPanelComponent', () => {
  let component: WriterPanelComponent;
  let fixture: ComponentFixture<WriterPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriterPanelComponent]
    });
    fixture = TestBed.createComponent(WriterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
