import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthNetAssetBannerComponent } from './month-net-asset-banner.component';

describe('MonthNetAssetBannerComponent', () => {
  let component: MonthNetAssetBannerComponent;
  let fixture: ComponentFixture<MonthNetAssetBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthNetAssetBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthNetAssetBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
