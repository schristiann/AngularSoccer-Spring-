import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player} from './Player';
import { Team} from './Team';
import {st} from '@angular/core/src/render3';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private teamsUrl = 'https://springsoccer.herokuapp.com/' ;  // URL to web api

  // private teamsUrl = 'http://localhost:8080/';

  constructor(
    private http: HttpClient) { }



  getTeams (): Observable<Team []> {

    return this.http.get<Team []> (this.teamsUrl).pipe(map(res => {
      return res as Team[];
    }),
      tap( _ => this.log(`fetched team list`)),
      catchError(this.handleError<Team []>( `got teams`)));
  }

  getAllPlayers (term: String): Observable<Player []>{
      if(term.trim().length==0) {
        const mocked: Player [] = [];
        return of(mocked);
      }
      else {
        return this.http.get<Player []>(`${this.teamsUrl}/search/${term}`).pipe(map(res => {
            return res as Player [];
          }),
          tap(_ => this.log(`got list of players`)),
          catchError(this.handleError<Player []>(`tried to get players`)));
      }

  }

  // getPlayers (id: number): Observable<Player[]> {
  //   const url = `${this.teamsUrl}/${id}`;
  //   return this.http.get<Player[]>(url).pipe(map(res => {
  //       return res as Player[];
  //     }),
  //     tap( _ => this.log(`fetched players`)),
  //     catchError(this.handleError<Player[]>( `getPlayers id=${id}`)));
  // }

  getTeam (id: number): Observable<Team> {
    const url = `${this.teamsUrl}/${id}`;
    return this.http.get<Team>(url).pipe(map(res => {
        return res as Team;
      }),
      tap( _ => this.log(`fetched team`)),
      catchError(this.handleError<Team>( `getTeam id=${id}`)));
  }

  getPlayer (teamID: String , playerID: String): Observable<Player> {
    const url = `${this.teamsUrl}/${teamID}/${playerID}`;
    return this.http.get<Player>(url).pipe(map(res => {
        return res as Player;
      }),
      tap( _ => this.log(`fetched team`)),
      catchError(this.handleError<Player>( `getPlayer id=${playerID}`)));
  }
  updatePlayer(player: Player, teamID: String): Observable<any> {
    const url = `${this.teamsUrl}/${teamID}`;
  return this.http.put(url, player, httpOptions).pipe(map ( res =>  res as Player )
    ,  tap( _ => this.log(`fetched player`)),
    catchError(this.handleError<Player>( `saved player ${player.playerName}`)));
  }
  deleteTeam(teamID: number): Observable<Team> {
    const url = `${this.teamsUrl}/${teamID}`;
    return this.http.delete<Team>(url, httpOptions);
  }
  deletePlayer(playerID: number, teamID: number): Observable<any> {
    const url = `${this.teamsUrl}/${teamID}/${playerID}`;
    return this.http.delete(url, httpOptions);
  }
  addPlayer(teamID: number, player: Player): Observable<Player> {
    player.tid = teamID;
    const url = `${this.teamsUrl}/${teamID}`;
    return this.http.post<Player>(url, player, httpOptions).pipe(map( res => {
      return res as Player;
    }),  tap( _ => this.log(`fetched player`)),
      catchError(this.handleError<Player>( `saved player ${player.playerName}`)));
  }



  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`teamService: ${message}`);
  }
}
