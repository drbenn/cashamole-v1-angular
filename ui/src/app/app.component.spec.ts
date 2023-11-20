import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'ui'`, () => {
    expect(component.title).toEqual('ui');
  });
});