import { Injectable } from '@angular/core';
import { Popup, IUploadedFile } from '@core';
import { ImageData } from 'models';
import { EditorStoreService, ImagesStoreService } from 'stores';
2
@Injectable({
  providedIn: 'root'
})
export class EditorFacadeService
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

  private selectImage(imgData: ImageData)
  {
    const img = this.imagesStoreService.images.find(o => o.guid == imgData.guid)

    if (!img)
    {
      Popup.error('Image not found');
      return;
    }

    if (img.provider)
    {
      this.editorStoreService.formatData = img.provider
    } else
    {
      img.provider = this.editorStoreService.formatData;
    }

    this.editorStoreService.image = img;
  }

  private transformToImageData(uploadedImg: IUploadedFile): ImageData
  {
    return new ImageData(
      uploadedImg.name,
      uploadedImg.base64
    );
  }
}
