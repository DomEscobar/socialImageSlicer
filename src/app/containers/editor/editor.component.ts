import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EditorStoreService } from 'stores';
import { ImageCroppedEvent } from '@cropper';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent
{
  public image$ = this.editorStoreService.image$;
  public format$ = this.editorStoreService.format$;

  private readonly _crop = new BehaviorSubject<ImageCroppedEvent>(null);
  public crop$ = this._crop.asObservable();

  constructor(private editorStoreService: EditorStoreService)
  {
    this.crop$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(
      cropperData =>
      {
        if (!cropperData)
        {
          return;
        }

        const img = this.editorStoreService.image;
        img.cropperData = cropperData;
        this.editorStoreService.image = img;
      }
    );
  }

  public crop(cropperData: ImageCroppedEvent): void
  {
    this._crop.next(cropperData);
  }
}
