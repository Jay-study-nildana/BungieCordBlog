import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUserTableComponent } from './product-user-table.component';

describe('ProductUserTableComponent', () => {
  let component: ProductUserTableComponent;
  let fixture: ComponentFixture<ProductUserTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductUserTableComponent]
    });
    fixture = TestBed.createComponent(ProductUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
