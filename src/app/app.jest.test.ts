import { Directive } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

@Directive({
  selector: 'router-outlet',
  standalone: true,
})
class MockRouterOutlet {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideComponent(App, { set: { imports: [MockRouterOutlet] } })
      .compileComponents();
  });

  it('renders the app with a mocked router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });
});
