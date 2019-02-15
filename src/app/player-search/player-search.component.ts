import { Component, OnInit } from '@angular/core';

import { Observable, Subject} from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';


import {Player} from '../Player';
import {PlayerService} from '../player.service';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent implements OnInit {

  players$: Observable<Player []>;

  private searchTerms= new Subject<string>();

  constructor(private playerService: PlayerService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.players$ = this.searchTerms.pipe(
      debounceTime(300),

      distinctUntilChanged(),

      switchMap((term: String) => this.playerService.getAllPlayers(term.trim())),
    );

  }

}
