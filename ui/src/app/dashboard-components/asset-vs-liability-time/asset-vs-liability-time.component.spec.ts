import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetVsLiabilityTimeComponent } from './asset-vs-liability-time.component';

describe('AssetVsLiabilityTimeComponent', () => {
  let component: AssetVsLiabilityTimeComponent;
  let fixture: ComponentFixture<AssetVsLiabilityTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetVsLiabilityTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetVsLiabilityTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
