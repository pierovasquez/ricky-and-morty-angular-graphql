import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import {take, tap} from 'rxjs/operators'
import { Character, DataResponse, Episode } from '../interfaces/data.interface';
import { LocalStorageService } from './localStorage.service';
const QUERY = gql `
{
  episodes {
    results {
      name
      episode
    }
  }
  characters {
    results {
      id
      name
      status
      species
      gender
      image
    }
  }
}

`

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private episodeSubject = new BehaviorSubject<Episode[]>([]);
  episodes$ = this.episodeSubject.asObservable();

  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$ = this.charactersSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private localStorageService: LocalStorageService
  ) {
    this.getDataApi();
  }


  private getDataApi(): void {
    this.apollo.watchQuery<DataResponse>({
      query: QUERY
    }).valueChanges.pipe(
      take(1),
      tap(({data}) => {
        console.log('res', data);
        const { characters, episodes} = data;
        this.episodeSubject.next(episodes.results);
        this.parseCharactersData(characters.results);
      })
    ).subscribe();
  }

  private parseCharactersData(characters: Character[]): void {
    const currentFavs = this.localStorageService.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFavs.find(current => current.id === character.id);
      return {...character, isFavorite: found };
    })
    this.charactersSubject.next(newData);
  }
}
