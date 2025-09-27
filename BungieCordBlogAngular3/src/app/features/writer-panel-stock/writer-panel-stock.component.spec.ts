import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterPanelStockComponent } from './writer-panel-stock.component';

describe('WriterPanelStockComponent', () => {
  let component: WriterPanelStockComponent;
  let fixture: ComponentFixture<WriterPanelStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriterPanelStockComponent]
    });
    fixture = TestBed.createComponent(WriterPanelStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
