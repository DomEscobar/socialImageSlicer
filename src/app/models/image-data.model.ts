import { GUID } from 'utils';
import { FormatData } from 'models';
import { ImageCroppedEvent, ImageTransform } from '@cropper';

export class ImageData
{
    public formatData: FormatData;
    public cropperData: ImageCroppedEvent;
    public imageTransform: ImageTransform = { scale: 1, transformX: 0, transformY: 0 };

    constructor(
        public name: string,
        public source: string,
        public guid: string = GUID.create()
    )
    {
    }
}