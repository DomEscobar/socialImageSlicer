import { Injectable } from '@angular/core';
import { ImagesStoreService, EditorStoreService } from 'stores';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { Observable, Observer, throwError, from } from 'rxjs';
import { ImageData } from 'models';
import { concatMap, catchError, filter, finalize, take } from 'rxjs/operators';
import { Popup } from '../components/popup/popup.component';
import { resizeCanvas } from '@cropper';
import { format } from 'path';

@Injectable({
  providedIn: 'root'
})
export class ExportService
{

  constructor(
    private editorStoreService: EditorStoreService,
    private imagesStoreService: ImagesStoreService) { }

  public async exportImages(): Promise<void>
  {
    this.editorStoreService.assignEditorDatatoImage();

    if (this.imagesStoreService.images.length == 1)
    {
      await this.exportAsImageAsync();
      return;
    }

    const zip = new JSZip();
    var img = zip.folder('');

    from(this.imagesStoreService.images).pipe(
      filter(image => image.cropperData != null && image.formatData != null),
      concatMap(image => this.resizeImage(image).pipe(catchError(error => throwError(error)))),
      take(this.imagesStoreService.images.length),
      finalize(() =>
      {
        zip.generateAsync({ type: 'blob' }).then((content) =>
        {
          FileSaver.saveAs(content, 'sliced-images.zip');
        });
      })
    ).subscribe(
      image =>
      {
        img.file(image.name, image.cropperData.base64.split(',')[1], { base64: true });
      },
      error =>
      {
        Popup.error('Error while exporting the images, please reload the page and try again')
        console.log(error);
      }
    );
  }

  private async exportAsImageAsync(): Promise<void>
  {
    for (const img of this.imagesStoreService.images)
    {
      const imgResized = await this.resizeImage(img).toPromise();
      const blob = await fetch(imgResized.cropperData.base64);
      FileSaver.saveAs(await (blob.blob()), img.name);
    }
  }

  private resizeImage(image: ImageData): Observable<ImageData>
  {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Observable((observer: Observer<ImageData>) =>
    {
      const img = new Image();
      img.onload = () =>
      {
        const { width, height } = { width : img.width, height : img.height};

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

        resizeCanvas(canvas, image.formatData.width, image.formatData.height);
        image.cropperData.base64 = canvas.toDataURL('image/jpg', 0.92);
        observer.next(image);
        observer.complete();
      }

      img.src = image.cropperData.base64;
    });
  }
}
