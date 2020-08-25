import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { EditorStoreService } from 'stores';
import { switchMap, distinctUntilChanged, catchError, filter, take, tap, map, delay, debounceTime } from 'rxjs/operators';
import { FormatData } from 'models';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, throwError, Observer, empty } from 'rxjs';
import { Popup } from '@core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorFacade } from 'facades';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit
{
  private readonly _layout = new BehaviorSubject<SafeHtml>(null);
  public readonly layout$ = this._layout.asObservable();

  private imageChangeListener: Subscription;

  constructor(
    private domSanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private httpClient: HttpClient,
    private editorFacade: EditorFacade,
    private editorStoreService: EditorStoreService) { }

  ngOnInit(): void
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
          this.setVisible(true);
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

  private stopListener(): void
  {
    if (this.imageChangeListener)
    {
      this.imageChangeListener.unsubscribe();
    }
  }

  private setVisible(isVisible: boolean)
  {
    if (isVisible && this.isVisible())
    {
      return;
    }

    (<HTMLElement>this.elementRef.nativeElement).style.display = isVisible ? 'block' : 'none';
    this.editorFacade.reloadEditor();
  }

  private isVisible(): boolean
  {
    return (<HTMLElement>this.elementRef.nativeElement).style.display === 'block';
  }

  private handleNoLayout(error)
  {
    this.stopListener();

    this.setVisible(false);
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
        const element = <HTMLElement>this.elementRef.nativeElement;
        const imgElement = <HTMLImageElement>element.querySelector(`#${ this.editorStoreService.formatData.name.replace(' ', '') }`);

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
}
