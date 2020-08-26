import { Injectable } from '@angular/core';
import { Popup, IUploadedFile } from '@core';
import { ImageData, FormatData } from 'models';
import { EditorStoreService, ImagesStoreService } from 'stores';
import { Subject } from 'rxjs';
import { Object } from 'utils';
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
    private imagesStoreService: ImagesStoreService)
  {
  }

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

  public reset(): void
  {
    const img = this.editorStoreService.image;
    img.reset();
    this.editorStoreService.image = img;
    this.editorStoreService.cropperData = null;
    this.editorStoreService.transform = img.imageTransform;
    this._refresh.next();
  }

  public assignEditorDatatoImage(): void
  {
    if (!this.editorStoreService.image)
    {
      return;
    }

    const img = this.editorStoreService.image;
    img.cropperData = this.editorStoreService.cropperData;
    img.formatData = this.editorStoreService.formatData || img.formatData;
    img.imageTransform = this.editorStoreService.transform || img.imageTransform;
    
    this.editorStoreService.image = img;
  }

  public selectImage(imgData: ImageData)
  {
    this.assignEditorDatatoImage();

    const img = this.imagesStoreService.images.find(o => o.guid === imgData.guid);

    if (!img)
    {
      Popup.error('Image not found');
      return;
    }

    this.editorStoreService.formatData = img.formatData || this.editorStoreService.formatData;
    this.editorStoreService.image = img;
    this.editorStoreService.cropperData = img.cropperData;
    this.editorStoreService.transform = img.imageTransform;
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
