import { Injectable } from '@angular/core';
import { switchMap, catchError, filter, tap, debounceTime } from 'rxjs/operators';
import { Popup } from '@core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorStoreService } from 'stores';
import { Subject, Subscription, Observable, empty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormatData } from 'models';

@Injectable({
  providedIn: 'root'
})
export class PreviewFacade
{
  private readonly _visible = new Subject<boolean>();

  private readonly _layout = new Subject<SafeHtml>();
  public readonly layout$ = this._layout.asObservable();

  private _element: HTMLElement;
  private imageChangeListener: Subscription;

  constructor(
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer,
    private editorStoreService: EditorStoreService)
  {

    this.editorStoreService.format$.pipe(
      tap(() => this.stopListener()),
      filter(format => format != null),
      debounceTime(100),
      switchMap(format => this.fetchLayout(format).pipe(
        catchError((error) => this.handleNoLayout(error)),
      )))
      .subscribe(
        layoutStr =>
        {
          this._visible.next(true);
          this._layout.next(this.domSanitizer.bypassSecurityTrustHtml(layoutStr));
          // Mess callback until view rendered
          setTimeout(() =>
          {
            this.addImageChandeHandler();
          }, 1000);
        },
        error =>
        {
          Popup.error('Layout error');
        }
      );
  }

  public get visible$(): Observable<boolean>
  {
    return this._visible.asObservable();
  }

  public setElement(element: HTMLElement): void
  {
    this._element = element;
  }

  private handleNoLayout(error)
  {
    this.stopListener();

    this._visible.next(false);
    console.log(error);

    this._layout.next(null);

    return empty();
  }

  private addImageChandeHandler()
  {
    this.imageChangeListener = this.editorStoreService.cropperData$.pipe(
      filter(cropperData => cropperData != null),
    ).subscribe(
      cropperData =>
      {
        const imgElement = this._element.querySelector(`#${ this.editorStoreService.formatData.name.replace(' ', '') }`) as HTMLImageElement;

        if (!imgElement)
        {
          console.log('Image element not found');
          return;
        }

        imgElement.src = cropperData.base64;
      },
      error => console.log(error)
    );
  }

  private fetchLayout(format: FormatData): Observable<string>
  {
    return this.httpClient.get(`assets/providers/${ format.provider }/layouts/${ format.name.replace(' ', '').split('.')[0] }.html`, { responseType: "text" });
  }

  private stopListener(): void
  {
    if (this.imageChangeListener)
    {
      this.imageChangeListener.unsubscribe();
    }
  }
}
