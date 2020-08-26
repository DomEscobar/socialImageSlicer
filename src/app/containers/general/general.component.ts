import { Component } from '@angular/core';
import { EditorStoreService, ImagesStoreService } from 'stores';
import { GUID } from 'utils';
import { Popup } from '@core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent
{
  constructor(
    private imagesStoreService: ImagesStoreService,
    private editorStoreService: EditorStoreService) { }

  public renameImage()
  {
    const name = prompt("Please enter a name", this.editorStoreService.image.name);

    if (name != null)
    {
      this.editorStoreService.image.name = name;
    }
  }

  public duplicateImage()
  {
    try
    {
      const img = JSON.parse(JSON.stringify(this.editorStoreService.image));
      img.name = `${ img.name.split('.')[0] } ${ GUID.create().substr(0, 3) }.${ img.name.split('.')[1] }`;
      img.guid = GUID.create();
      this.imagesStoreService.images = [...this.imagesStoreService.images, img];
      Popup.info('Duplicated image, see in selection');
    } catch (error)
    {
      Popup.error('Error while trying to duplicate the image');
      console.log(error);
    }
  }

  public removeImage()
  {
    let imagesStore = this.imagesStoreService.images;
    let imgSelected = this.editorStoreService.image;

    imagesStore = imagesStore.filter(image => image.guid !== imgSelected.guid);

    if (imagesStore.length !== 0)
    {
      imgSelected = imagesStore[0];
    } else
    {
      imgSelected = null;
    }

    this.imagesStoreService.images = imagesStore;
    this.editorStoreService.image = imgSelected;
    Popup.info('Image removed');
  }
}
