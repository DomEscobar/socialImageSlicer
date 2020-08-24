import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { EditorStoreService } from 'stores';
import { ImageCroppedEvent } from '@cropper';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EditorFacade } from 'facades';
import { ImageCropperComponent, ImageTransform } from '@cropper';
import { Translate } from './draggable.directive';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements AfterViewInit
{
  @ViewChild(ImageCropperComponent, { static: false })
  imageCropper: ImageCropperComponent;

  public image$ = this.editorStoreService.image$;
  public format$ = this.editorStoreService.format$;

  private readonly _crop = new BehaviorSubject<ImageCroppedEvent>(null);
  public crop$ = this._crop.asObservable();

  public transform: ImageTransform = { scale: 1, transformX: 0, transformY: 0 };
  public isCropDragging: boolean;

  @HostListener("mousewheel", ["$event"])
  public windowScrolled($event: MouseWheelEvent)
  {
    this.zoom($event.deltaY < 0);
  }

  constructor(
    private editorFacade: EditorFacade,
    private editorStoreService: EditorStoreService)
  { }

  ngAfterViewInit(): void
  {
    this.addEditorReloadListener();
    this.addCroppListener();
  }

  private addEditorReloadListener(): void
  {
    this.editorFacade.refresh$.subscribe(
      () =>
      {
        if (!this.imageCropper)
        {
          return;
        }

        this.imageCropper.initCropper(true);
      }
    );
  }

  private addCroppListener(): void
  {
    this.crop$.pipe(
      filter(cropperdata => cropperdata != null),
      distinctUntilChanged((crop1, crop2) => JSON.stringify(crop1) === JSON.stringify(crop2))
    ).subscribe(
      cropperData =>
      {
        this.editorFacade.updateImageCropperData(cropperData);
      }
    );
  }

  public moveImage(translate: Translate)
  {
    this.transform = {
      ...this.transform,
      transformX: translate.x,
      transformY: translate.y,
    };
  }

  private zoom(isZoomIn: boolean): void
  {
    this.transform = {
      ...this.transform,
      scale: this.transform.scale + (isZoomIn ? .1 : -.1)
    };
  }

  public crop(cropperData: ImageCroppedEvent): void
  {
    this._crop.next(cropperData);
  }

  public onZoom(factor)
  {

  }
}
