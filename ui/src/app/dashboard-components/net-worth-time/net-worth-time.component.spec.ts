import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetWorthTimeComponent } from './net-worth-time.component';

describe('NetWorthTimeComponent', () => {
  let component: NetWorthTimeComponent;
  let fixture: ComponentFixture<NetWorthTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetWorthTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetWorthTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
