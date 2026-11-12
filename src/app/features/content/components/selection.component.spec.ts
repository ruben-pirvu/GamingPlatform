import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { AuthenticatedUser } from '../../auth/services/auth.models';
import { AuthService } from '../../auth/services/auth.service';
import { GAME_CONTENT_SOURCE, GameContentService } from '../services/game-content.service';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let fixture: ComponentFixture<SelectionComponent>;
  let currentUser: WritableSignal<AuthenticatedUser | null>;

  beforeEach(async () => {
    currentUser = signal({
      id: 'player-1',
      username: 'demo',
      isEligibleToPlay: true,
      isOfLegalAge: true,
      walletBalance: 125.5,
      country: 'US',
    });

    await TestBed.configureTestingModule({
      imports: [SelectionComponent],
      providers: [
        { provide: GAME_CONTENT_SOURCE, useClass: GameContentService },
        { provide: AuthService, useValue: { currentUser } },
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
    const user = currentUser();
    if (!user) {
      throw new Error('Test user must be available');
    }

    currentUser.set({ ...user, isOfLegalAge: false });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.game-card').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.launch-button').click();

    await new Promise((resolve) => setTimeout(resolve, 750));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Returning to game selection');

    await new Promise((resolve) => setTimeout(resolve, 550));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.launch-button')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Selected:');
  });
});
