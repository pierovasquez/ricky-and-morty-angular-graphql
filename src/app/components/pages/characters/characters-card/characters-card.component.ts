import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Character } from '@app/shared/interfaces/data.interface';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersCardComponent {

  @Input() character: Character = <Character>{};

  constructor() { }


  onToggleFavorite(): void {
    this.character.isFavorite = !this.character.isFavorite;
    this.getIcon();
  }


  getIcon(): string {
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg';
  }
}
