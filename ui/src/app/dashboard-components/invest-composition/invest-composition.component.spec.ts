import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestCompositionComponent } from './invest-composition.component';

describe('InvestCompositionComponent', () => {
  let component: InvestCompositionComponent;
  let fixture: ComponentFixture<InvestCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestCompositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
