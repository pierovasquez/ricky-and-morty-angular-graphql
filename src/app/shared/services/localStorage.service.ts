import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '@shared/interfaces/data.interface';
import { ToastrService } from 'ngx-toastr';

const MY_FAVORITES = 'myFavorites';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private charactersFavSubject = new BehaviorSubject<Character[]>([]);
  charactersFav$ = this.charactersFavSubject.asObservable();

  constructor(private toastr: ToastrService) {
    this.initialStorage();
  }

  addOrRemoveFavorite(character: Character): void {
    const { id } = character;
    const currentsFav = this.getFavoritesCharacters();
    const found = !!currentsFav.find((current) => current.id === id);
    found ? this.removeFromFavorite(id) : this.addToFavorite(character);
  }

  private removeFromFavorite(id: number): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      const characters = currentsFav.filter((character) => character.id !== id);
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
      this.charactersFavSubject.next([...characters]);
      this.toastr.warning(
        `${
          currentsFav.find((curr) => curr.id === id)?.name
        } removed from favorite characters`,
        'RickAndMortyApp'
      );
    } catch (error) {
      console.log('Error removing character from localStorage', error);
      this.toastr.error(`Error removing character from localStorage: ${error}`);
    }
  }

  private addToFavorite(character: Character): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      localStorage.setItem(
        MY_FAVORITES,
        JSON.stringify([...currentsFav, character])
      );
      this.charactersFavSubject.next([...currentsFav, character]);
      this.toastr.success(
        `${character.name} added to favorite`,
        'RickAndMortyApp'
      );
    } catch (error) {
      console.log('Error saving character to localStorage', error);
      this.toastr.error(`${error} added to favorite`, 'RickAndMortyApp');
    }
  }

  getFavoritesCharacters(): Character[] {
    try {
      const charactersFav: Character[] = JSON.parse(
        localStorage.getItem(MY_FAVORITES) as string
      );
      this.charactersFavSubject.next(charactersFav);
      return charactersFav;
    } catch (error) {
      console.log('Error getting favorites from localStorage', error);
      return [];
    }
  }

  clearStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.log('Erro cleaning the storage');
    }
  }

  private initialStorage(): void {
    const currents = JSON.parse(localStorage.getItem(MY_FAVORITES) as string);
    if (!currents) {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
    }
    this.getFavoritesCharacters();
  }
}
