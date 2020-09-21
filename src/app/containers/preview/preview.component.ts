import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { EditorStoreService } from 'stores';
import { switchMap, distinctUntilChanged, catchError, filter, take, tap, map, delay, debounceTime } from 'rxjs/operators';
import { FormatData } from 'models';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, throwError, Observer, empty } from 'rxjs';
import { Popup } from '@core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorFacade } from 'facades';
import { PreviewFacade } from './../../facades/preview.facade';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit
{
  public layout$: Observable<SafeHtml>;


  constructor(
    private readonly elementRef: ElementRef,
    private readonly previewFacade: PreviewFacade,
    private readonly editorFacade: EditorFacade) { }

  ngOnInit(): void
  {
    this.layout$ = this.previewFacade.layout$;
    this.previewFacade.setElement(this.elementRef.nativeElement);

    this.previewFacade.visible$.subscribe(visible =>
    {
      this.setVisible(visible);
    });
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
}
