import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { EditorStoreService } from 'stores';
import { switchMap, distinctUntilChanged, catchError, filter, take, tap, map, delay } from 'rxjs/operators';
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
      filter(format => format != null),
      switchMap(format => this.fetchLayout(format).pipe(
        catchError((error) => this.handleNoLayout()),
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
          }
            , 1000);
        },
        error =>
        {
          Popup.error('Layout error');
        }
      );
  }

  private setVisible(isVisible: boolean)
  {
    (<HTMLElement>this.elementRef.nativeElement).style.display = isVisible ? 'block' : 'none';
    this.editorFacade.reloadEditor();
  }

  private handleNoLayout()
  {
    if (this.imageChangeListener)
    {
      this.imageChangeListener.unsubscribe();
    }

    this.setVisible(false);

    this._layout.next(null);

    return empty();
  }

  private addImageChandeHandler()
  {
    this.imageChangeListener = this.editorStoreService.image$.pipe(
      map(img => img.cropperData),
      filter(cropperData => cropperData != null),
      distinctUntilChanged((cropData1, cropData2) => JSON.stringify(cropData1) === JSON.stringify(cropData2)),
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
    return this.httpClient.get(`assets/providers/${ this.editorStoreService.selectedProvider }/layouts/${ format.name.replace(' ', '').split('.')[0] }.html`, { responseType: "text" });
  }
}
