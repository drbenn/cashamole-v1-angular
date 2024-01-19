import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaibilityCompositionComponent } from './liaibility-composition.component';

describe('LiaibilityCompositionComponent', () => {
  let component: LiaibilityCompositionComponent;
  let fixture: ComponentFixture<LiaibilityCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiaibilityCompositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiaibilityCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
