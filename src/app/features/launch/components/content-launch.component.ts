import { Component, Input } from '@angular/core';
import { Game } from '../../content/services/game-content.service';

@Component({
  selector: 'app-content-launch',
  templateUrl: './content-launch.component.html',
  styleUrl: './content-launch.component.css',
})
export class ContentLaunchComponent {
  @Input({ required: true }) game!: Game;
}
