import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  find,
  map,
  mergeMap,
  pluck,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Character, DataResponse, Episode } from '../interfaces/data.interface';
import { LocalStorageService } from './localStorage.service';
const QUERY = gql`
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
`;

@Injectable({
  providedIn: 'root',
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

  getDataApi(): void {
    this.apollo
      .watchQuery<DataResponse>({
        query: QUERY,
      })
      .valueChanges.pipe(
        take(1),
        tap(({ data }) => {
          const { characters, episodes } = data;
          this.episodeSubject.next(episodes.results);
          this.parseCharactersData(characters.results);
        })
      )
      .subscribe();
  }

  private parseCharactersData(characters: Character[]): void {
    const currentFavs = this.localStorageService.getFavoritesCharacters();
    const newData = characters.map((character) => {
      const found = !!currentFavs.find(
        (current) => current.id === character.id
      );
      return { ...character, isFavorite: found };
    });
    this.charactersSubject.next(newData);
  }

  getCharactersByPage(pageNum: number): Observable<any> {
    const QUERY_BY_PAGE = gql`
    {
      characters(page: ${pageNum}) {
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
    `;
    return this.apollo
      .watchQuery<any>({ query: QUERY_BY_PAGE })
      .valueChanges.pipe(
        take(1),
        pluck('data', 'characters'),
        withLatestFrom(this.characters$),
        tap(([apiResponse, characters]) => {
          this.parseCharactersData([...characters, ...apiResponse.results]);
        })
      );
  }

  getDetailsById(id: number): Observable<Character> {
    return this.characters$.pipe(
      tap((a) => console.log('a', a)),
      mergeMap((characters: Character[]) => characters),
      tap((a) => console.log('b', a)),
      find((character: Character) => character?.id === id),
      map((character) => (character ? character : ({} as Character)))
    );
  }

  filterData(valueToSearch: string): void {
    const QUERY_BY_NAME = gql`
    query($name: String){
      characters(filter: {name: $name}) {
        info {
          count
        }
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
  `;
    this.apollo.watchQuery<any>({
      query: QUERY_BY_NAME,
      variables: {
        name: valueToSearch,
      },
    }).valueChanges.pipe(
      take(1),
      pluck('data', 'characters'),
      tap((apiResponse) => this.parseCharactersData([...apiResponse.results])),
      catchError(error => {
        console.log(error.message);
        this.charactersSubject.next([]);
        return of(error);
      })
    ).subscribe();
  }
}
