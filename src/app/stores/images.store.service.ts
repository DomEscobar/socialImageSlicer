import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageData } from 'models';

@Injectable({
  providedIn: 'root'
})
export class ImagesStoreService
{
  private readonly _images = new BehaviorSubject<ImageData[]>([]);
  public readonly images$ = this._images.asObservable();

  constructor() { }

  public get images(): ImageData[]
  {
    return this._images.getValue();
  }

  public set images(imageData: ImageData[])
  {
    this._images.next(imageData);
  }

  public addImage(imageData: ImageData): void
  {
    this.images = [
      ...this.images,
      imageData
    ];
  }

  public removeImage(imageData: ImageData): void
  {
    this.images = this.images.filter(img => img.guid !== imageData.guid);
  }
}
