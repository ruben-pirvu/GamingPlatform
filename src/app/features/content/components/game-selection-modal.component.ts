import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AgeCheckState, AgeCheckStatusComponent } from './age-check-status.component';
import { Game } from '../services/game-content.service';

@Component({
  imports: [AgeCheckStatusComponent],
  selector: 'app-game-selection-modal',
  templateUrl: './game-selection-modal.component.html',
  styleUrl: './game-selection-modal.component.css',
})
export class GameSelectionModalComponent {
  @Input({ required: true }) game!: Game;
  @Input() preflightState: AgeCheckState | null = null;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() launchRequested = new EventEmitter<void>();

  protected requestClose(): void {
    if (this.preflightState === null) {
      this.closeRequested.emit();
    }
  }

  protected requestLaunch(): void {
    if (this.preflightState === null) {
      this.launchRequested.emit();
    }
  }

  @HostListener('document:keydown.escape')
  protected handleEscape(): void {
    this.requestClose();
  }
}
