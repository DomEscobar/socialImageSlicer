import { Injectable } from '@angular/core';
import { ImagesStoreService } from 'stores';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { Observable, Observer, throwError, from } from 'rxjs';
import { ImageData } from 'models';
import { concatMap, catchError, filter } from 'rxjs/operators';
import { Popup } from '../components/popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class ExportService
{

  constructor(private imagesStoreService: ImagesStoreService) { }

  //TODO :  JSZIP LIb

  public async exportImages(): Promise<void>
  {
    if (this.imagesStoreService.images.length == 1)
    {
      await this.exportAsImageAsync();
      return;
    }

    const zip = new JSZip();
    var img = zip.folder('');

    from(this.imagesStoreService.images).pipe(
      filter(image => image.cropperData != null && image.formatData != null),
      concatMap(image => this.resizeImage(image).pipe(catchError(error => throwError(error))))
    ).subscribe(
      image =>
      {
        img.file(image.name, image.cropperData.base64.split(',')[1], { base64: true });
      },
      error => Popup.error('Error while exporting the images, please reload the page and try again')
    );

    await zip.generateAsync({ type: 'blob' }).then((content) =>
    {
      FileSaver.saveAs(content, 'sliced-images.zip');
    });
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
        const {width, height} = image.formatData;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

        image.cropperData.base64 = canvas.toDataURL('image/jpg', 0.92)
        observer.next(image);
        observer.complete();
      }

      img.src = image.cropperData.base64;
    });
  }
}
