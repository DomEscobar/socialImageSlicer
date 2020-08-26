import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormatData, ImageData } from 'models';
import { ImageTransform, ImageCroppedEvent } from '@cropper';

@Injectable({
  providedIn: 'root'
})
export class EditorStoreService
{
  private readonly _image = new BehaviorSubject<ImageData>(null);
  public readonly image$ = this._image.asObservable();

  private readonly _transform = new BehaviorSubject<ImageTransform>(null);
  public readonly transform$ = this._transform.asObservable();

  private readonly _cropperData = new BehaviorSubject<ImageCroppedEvent>(null);
  public cropperData$ = this._cropperData.asObservable();

  private readonly _format = new BehaviorSubject<FormatData>(null);
  public readonly format$ = this._format.asObservable();

  public aspetRatio = true;

  constructor() { }

  public get image(): ImageData
  {
    return this._image.getValue();
  }

  public set image(imageData: ImageData)
  {
    this._image.next(imageData);
  }

  public get formatData(): FormatData
  {
    return this._format.getValue();
  }

  public set formatData(formatData: FormatData)
  {
    this._format.next(formatData);
  }

  public get transform(): ImageTransform
  {
    return this._transform.getValue();
  }

  public set transform(imageTransform: ImageTransform)
  {
    this._transform.next(imageTransform);
  }

  public get cropperData(): ImageCroppedEvent
  {
    return this._cropperData.getValue();
  }

  public set cropperData(imageCroppedEvent: ImageCroppedEvent)
  {
    this._cropperData.next(imageCroppedEvent);
  }

  public assignEditorDatatoImage(): void
  {
    if (!this.image)
    {
      return;
    }

    const img = this.image;
    img.cropperData = this.cropperData;
    img.formatData = this.formatData || img.formatData;
    img.imageTransform = this.transform || img.imageTransform;

    this.image = img;
  }
}
