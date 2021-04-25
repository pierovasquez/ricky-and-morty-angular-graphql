import { Component } from '@angular/core';
import { Episode } from '@app/shared/interfaces/data.interface';
import { DataService } from '@app/shared/services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent {
  episodes$: Observable<Episode[]> = this.dataSvc.episodes$

  constructor(
    private dataSvc: DataService
  ) { }

}
