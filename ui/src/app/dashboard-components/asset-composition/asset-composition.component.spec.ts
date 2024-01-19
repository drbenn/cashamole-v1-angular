import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCompositionComponent } from './asset-composition.component';

describe('AssetCompositionComponent', () => {
  let component: AssetCompositionComponent;
  let fixture: ComponentFixture<AssetCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCompositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
