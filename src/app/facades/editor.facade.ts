import { Injectable } from '@angular/core';
import { Popup, IUploadedFile } from '@core';
import { ImageData } from 'models';
import { EditorStoreService, ImagesStoreService } from 'stores';
import { Subject } from 'rxjs';
import { ImageCroppedEvent } from '@cropper';
2
@Injectable({
  providedIn: 'root'
})
export class EditorFacade
{
  private readonly _refresh = new Subject<void>();
  public readonly refresh$ = this._refresh.asObservable();

  constructor(
    private editorStoreService: EditorStoreService,
    private imagesStoreService: ImagesStoreService) { }

  public initEditor(uploadedImages: IUploadedFile[])
  {
    if (uploadedImages == null || uploadedImages.length == 0)
    {
      return;
    }

    const imageDataList = uploadedImages.map(img => this.transformToImageData(img));
    this.imagesStoreService.images = imageDataList;
    this.selectImage(imageDataList[0]);
  }

  public reloadEditor(): void
  {
    this._refresh.next();
  }

  public updateImageCropperData(cropperData: ImageCroppedEvent): void
  {
    const img = this.editorStoreService.image;
    img.cropperData = cropperData;
    this.editorStoreService.image = img;
  }

  public selectImage(imgData: ImageData)
  {
    const img = this.imagesStoreService.images.find(o => o.guid == imgData.guid)

    if (!img)
    {
      Popup.error('Image not found');
      return;
    }

    this.editorStoreService.image = img;
  }

  public addUploadedImages(uploadedImages: IUploadedFile[]): void
  {
    const imageDataList = uploadedImages.map(img => this.transformToImageData(img));
    this.imagesStoreService.addImages(imageDataList);
  }

  private transformToImageData(uploadedImg: IUploadedFile): ImageData
  {
    return new ImageData(
      uploadedImg.name,
      uploadedImg.base64
    );
  }
}
