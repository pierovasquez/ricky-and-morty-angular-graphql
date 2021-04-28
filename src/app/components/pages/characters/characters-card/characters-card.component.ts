import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Character } from '@app/shared/interfaces/data.interface';
import { LocalStorageService } from '@app/shared/services/localStorage.service';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersCardComponent {

  @Input() character: Character = <Character>{};

  constructor(
    private localStorageService: LocalStorageService
  ) { }


  onToggleFavorite(): void {
    this.character.isFavorite = !this.character.isFavorite;
    this.getIcon();
    this.localStorageService.addOrRemoveFavorite(this.character);
  }


  getIcon(): string {
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg';
  }
}
