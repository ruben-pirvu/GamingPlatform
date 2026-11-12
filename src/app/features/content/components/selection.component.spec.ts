import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let fixture: ComponentFixture<SelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionComponent);
    fixture.detectChanges();
  });

  it('shows seven game cards', () => {
    expect(fixture.nativeElement.querySelectorAll('.game-card')).toHaveLength(7);
  });

  it('marks a chosen game as selected', () => {
    const firstGame = fixture.nativeElement.querySelector('.game-card') as HTMLButtonElement;

    firstGame.click();
    fixture.detectChanges();

    expect(firstGame.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Solar Spins');
  });
});
