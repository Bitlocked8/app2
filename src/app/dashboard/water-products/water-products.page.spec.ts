import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterProductsPage } from './water-products.page';

describe('WaterProductsPage', () => {
  let component: WaterProductsPage;
  let fixture: ComponentFixture<WaterProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
