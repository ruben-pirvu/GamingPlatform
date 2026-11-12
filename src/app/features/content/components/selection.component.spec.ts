import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LaunchService } from '../../launch/services/launch.service';
import { GAME_CONTENT_SOURCE } from '../services/game-content.service';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let fixture: ComponentFixture<SelectionComponent>;
  let eligibilityResult: { isEligible: boolean; message: string };
  const games = Array.from({ length: 7 }, (_, index) => ({
    id: index === 0 ? 'solar-spins' : `game-${index}`,
    title: index === 0 ? 'Solar Spins' : `Game ${index}`,
    category: 'Test',
    description: 'Test game',
  }));

  beforeEach(async () => {
    eligibilityResult = { isEligible: true, message: 'Game ready to load.' };

    await TestBed.configureTestingModule({
      imports: [SelectionComponent],
      providers: [
        {
          provide: GAME_CONTENT_SOURCE,
          useValue: { getAvailableGames: () => of(games) },
        },
        { provide: LaunchService, useValue: { checkEligibility: () => of(eligibilityResult) } },
      ],
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
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#game-modal-title').textContent).toContain('Solar Spins');
  });

  it('closes the game popup and returns to the grid', () => {
    fixture.nativeElement.querySelector('.game-card').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.cancel-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.game-card')).toHaveLength(7);
  });

  it('shows the launch window after an eligible age check', async () => {
    fixture.nativeElement.querySelector('.game-card').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.launch-button').click();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 750));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Game ready to load');

    await new Promise((resolve) => setTimeout(resolve, 950));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-content-launch')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Waiting for the external game service');
  });

  it('returns to game selection after a failed age check', async () => {
    eligibilityResult = { isEligible: false, message: 'Age verification failed.' };
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.game-card').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.launch-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Returning to game selection');

    await new Promise((resolve) => setTimeout(resolve, 1400));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Returning to game selection');

    await new Promise((resolve) => setTimeout(resolve, 200));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.launch-button')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Selected:');
  });
});
