import { Component, Input } from '@angular/core';

export type AgeCheckState = 'checking' | 'ready' | 'denied';

@Component({
  selector: 'app-age-check-status',
  templateUrl: './age-check-status.component.html',
  styleUrl: './age-check-status.component.css',
})
export class AgeCheckStatusComponent {
  @Input({ required: true }) state!: AgeCheckState;
}
