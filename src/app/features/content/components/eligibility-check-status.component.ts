import { Component, Input } from '@angular/core';

export type EligibilityCheckState = 'checking' | 'ready' | 'denied';

@Component({
  selector: 'app-eligibility-check-status',
  templateUrl: './eligibility-check-status.component.html',
  styleUrl: './eligibility-check-status.component.css',
})
export class EligibilityCheckStatusComponent {
  @Input({ required: true }) state!: EligibilityCheckState;
  @Input() message: string | null = null;
}
