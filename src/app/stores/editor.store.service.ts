import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormatData, ImageData } from 'models';

@Injectable({
  providedIn: 'root'
})
export class EditorStoreService
{
  private readonly _image = new BehaviorSubject<ImageData>(null);
  public readonly image$ = this._image.asObservable();

  private readonly _format = new BehaviorSubject<FormatData>(null);
  public readonly format$ = this._format.asObservable();

  public selectedProvider: string;

  constructor() { }

  private updateImageFormat(formatData: FormatData): void
  {
    const img = this.image;
    img.formatData = formatData;
    this.image = img;
  }

  public get image(): ImageData
  {
    return this._image.getValue();
  }

  public set image(imageData: ImageData)
  {
    if (this.formatData)
    {
      imageData.formatData = this.formatData;
    }

    this._image.next(imageData);
  }

  public get formatData(): FormatData
  {
    return this._format.getValue();
  }

  public set formatData(formatData: FormatData)
  {
    if (this.image)
    {
      this.updateImageFormat(formatData);
    }

    this._format.next(formatData);
  }
}
