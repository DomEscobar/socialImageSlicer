import { Injectable } from '@angular/core';
import { ImagesStoreService } from 'stores';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

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
      await this.exportAsImage();
      return;
    }

    const zip = new JSZip();
    var img = zip.folder('');

    this.imagesStoreService.images.forEach(image =>
    {
      img.file(image.name, image.cropperData.base64.split(',')[1], { base64: true });
    });

    await zip.generateAsync({ type: 'blob' }).then((content) =>
    {
      FileSaver.saveAs(content, 'sliced-images.zip');
    });
  }

  private async exportAsImage(): Promise<void>
  {
    for (const img of this.imagesStoreService.images)
    {
      const blob = await fetch(img.cropperData.base64);
      FileSaver.saveAs(await (blob.blob()), img.name);
    }
  }
}
