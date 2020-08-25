import { Injectable } from '@angular/core';
import { Observable, from, throwError, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormatData } from 'models';
import { concatMap, take, catchError, map, finalize, mergeMap } from 'rxjs/operators';
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

  private initFormats(providers: string[]): Observable<string[]>
  {
    return new Observable<string[]>((observer: Observer<string[]>) =>
    {
      from(providers).pipe(
        concatMap(provider =>
          this.readFormats(provider).pipe(
            catchError(error => throwError(provider)),
            map(formats => { return { "provider": provider, "formats": formats } })
          )),
        take(providers.length),
        finalize(() =>
        {
          observer.next(providers);
          observer.complete();
        })
      ).subscribe(
        result => this.providerMap.set(result.provider, result.formats),
        error => Popup.error(`Missing formats of provider : ${ error }`)
      )
    });
  }

  private readFormats(provider: string): Observable<FormatData[]>
  {
    return this.http.get<FormatData[]>(`./assets/providers/${ provider }/formats.json`);
  }

  private getDefaultFormat(): FormatData
  {
    return this.providerMap.get('Custom')[0];
  }

  public initMenu(): void
  {
    this.providers$ = this.getProviders().pipe(
      mergeMap(providers => this.initFormats(providers)),
      finalize(() =>
      {
        this.selectFormat(this.getDefaultFormat());
      })
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
