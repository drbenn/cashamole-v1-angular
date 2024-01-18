import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBsRecordComponent } from './new-bs-record.component';

describe('NewBsRecordComponent', () => {
  let component: NewBsRecordComponent;
  let fixture: ComponentFixture<NewBsRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBsRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewBsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
