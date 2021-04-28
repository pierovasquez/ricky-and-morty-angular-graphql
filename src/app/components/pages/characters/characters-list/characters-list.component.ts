import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';
import { LocalStorageService } from '@app/shared/services/localStorage.service';

const SCROLL_HEIGHT = 500;
@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent {
  characters$ = this.dataSvc.characters$;
  showButton = false;

  constructor(
    private dataSvc: DataService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const yOffSet = window.pageYOffset;
    console.log('yoff', yOffSet);
    const scrollTop = this.document.documentElement.scrollTop;
    console.log('scrolltop', scrollTop);
    this.showButton = (yOffSet || scrollTop) > SCROLL_HEIGHT;
  }

  onScrollTop(): void {
    this.document.documentElement.scrollTop = 0;
  }
}
