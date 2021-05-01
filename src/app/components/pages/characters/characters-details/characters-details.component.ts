import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '@app/shared/interfaces/data.interface';
import { DataService } from '@app/shared/services/data.service';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-characters-details',
  templateUrl: './characters-details.component.html',
  styleUrls: ['./characters-details.component.scss']
})
export class CharactersDetailsComponent implements OnInit {
  character$ = new Observable<Character>();
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.character$ = this.route.params.pipe(
      take(1),
      switchMap(({id}) => this.dataService.getDetailsById(id))
    );
  }
}
