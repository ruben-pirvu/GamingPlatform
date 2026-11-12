import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EligibilityCheckState, EligibilityCheckStatusComponent } from './eligibility-check-status.component';
import { Game } from '../services/game-content.service';

@Component({
  imports: [EligibilityCheckStatusComponent],
  selector: 'app-game-selection-modal',
  templateUrl: './game-selection-modal.component.html',
  styleUrl: './game-selection-modal.component.css',
})
export class GameSelectionModalComponent {
  @Input({ required: true }) game!: Game;
  @Input() eligibilityCheckState: EligibilityCheckState | null = null;
  @Input() eligibilityCheckMessage: string | null = null;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() eligibilityCheckRequested = new EventEmitter<void>();

  protected requestClose(): void {
    if (this.eligibilityCheckState === null) {
      this.closeRequested.emit();
    }
  }

  protected requestEligibilityCheck(): void {
    if (this.eligibilityCheckState === null) {
      this.eligibilityCheckRequested.emit();
    }
  }

  @HostListener('document:keydown.escape')
  protected handleEscape(): void {
    this.requestClose();
  }
}
