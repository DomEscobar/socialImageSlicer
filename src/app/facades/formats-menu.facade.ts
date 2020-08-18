import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormatData } from 'models';
import { tap, concatMap, take, catchError, map } from 'rxjs/operators';
import { Popup } from '@core';
import { EditorStoreService } from 'stores';

@Injectable({
  providedIn: 'root'
})
export class FormatsMenuFacade
{
  public providers$: Observable<string[]>;
  public providerMap: Map<string, FormatData[]> = new Map();

  constructor(
    private editorStoreService: EditorStoreService,
    private http: HttpClient) { }

  private initFormats(providers: string[])
  {
    from(providers).pipe(
      concatMap(provider =>
        this.readFormats(provider).pipe(
          catchError(error => throwError(provider)),
          map(formats => { return { "provider": provider, "formats": formats } })
        )),
      take(providers.length)
    ).subscribe(
      result => this.providerMap.set(result.provider, result.formats),
      error => Popup.error(`Missing formats of provider : ${ error }`)
    )
  }

  private readFormats(provider: string): Observable<FormatData[]>
  {
    return this.http.get<FormatData[]>(`./assets/providers/${ provider }/formats.json`);
  }

  public initMenu()
  {
    this.providers$ = this.getProviders().pipe(
      tap(providers => this.initFormats(providers))
    );
  }

  public getProviders(): Observable<string[]>
  {
    return this.http.get<string[]>('./assets/providers/providers.json')
  }

  public selectFormat(format: FormatData): void
  {
    this.editorStoreService.formatData = format;
  }
}
