import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaibilityCompositionComponent } from './liability-composition.component';

describe('LiabilityCompositionComponent', () => {
  let component: LiabilityCompositionComponent;
  let fixture: ComponentFixture<LiabilityCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiabilityCompositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiabilityCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
