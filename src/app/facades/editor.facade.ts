import { Injectable } from '@angular/core';
import { Popup, IUploadedFile } from '@core';
import { ImageData } from 'models';
import { EditorStoreService, ImagesStoreService } from 'stores';
2
@Injectable({
  providedIn: 'root'
})
export class EditorFacade
{
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
