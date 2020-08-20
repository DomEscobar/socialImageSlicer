import { GUID } from 'utils';
import { FormatData } from 'models';
import { ImageCroppedEvent } from '@cropper';

export class ImageData
{
    public formatData: FormatData;
    public cropperData: ImageCroppedEvent;

    constructor(
        public name: string,
        public source: string,
        public guid: string = GUID.create()
    )
    {
    }
}