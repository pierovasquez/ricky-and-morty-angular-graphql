import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import {take, tap} from 'rxjs/operators'
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

  private episodeSubject = new BehaviorSubject<any[]>([]);
  episodes$ = this.episodeSubject.asObservable();

  private charactersSubject = new BehaviorSubject<any[]>([]);
  characters$ = this.charactersSubject.asObservable();

  constructor(
    private apollo: Apollo
  ) {
    this.getDataApi();
  }


  private getDataApi(): void {
    this.apollo.watchQuery<any>({
      query: QUERY
    }).valueChanges.pipe(
      take(1),
      tap(({data}) => {
        console.log('res', data);
        const { characters, episodes} = data;
        this.episodeSubject.next(episodes.results);
        this.charactersSubject.next(characters.results);
      })
    ).subscribe();
  }
}
