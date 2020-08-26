import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { EditorStoreService } from 'stores';
import { ImageCroppedEvent } from '@cropper';
import { EditorFacade } from 'facades';
import { ImageCropperComponent } from '@cropper';
import { Translate } from './draggable.directive';
import { debounceTime } from 'rxjs/operators';

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
  public transform$ = this.editorStoreService.transform$;

  @HostListener("mousewheel", ["$event"])
  public windowScrolled($event: MouseWheelEvent)
  {
    this.zoom($event.deltaY < 0);
  }

  constructor(
    private editorFacade: EditorFacade,
    private editorStoreService: EditorStoreService)
  {
  }

  ngAfterViewInit(): void
  {
    this.addEditorReloadListener();
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

  private zoom(isZoomIn: boolean): void
  {
    this.editorStoreService.transform = {
      ...this.editorStoreService.transform,
      scale: this.editorStoreService.transform.scale + (isZoomIn ? .1 : -.1)
    };
  }

  public moveImage(translate: Translate)
  {
    this.editorStoreService.transform = {
      ...this.editorStoreService.transform,
      transformX: translate.x,
      transformY: translate.y,
    };
  }

  public crop(cropperData: ImageCroppedEvent): void
  {
    this.editorStoreService.cropperData = cropperData;
  }

  public get maintainAspectRatio(): boolean
  {
    return this.editorStoreService.aspetRatio;
  }
}
