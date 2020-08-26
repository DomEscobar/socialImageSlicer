import { GUID } from 'utils';
import { FormatData } from 'models';
import { ImageCroppedEvent, ImageTransform } from '@cropper';

export class ImageData
{
    public formatData: FormatData;
    public cropperData: ImageCroppedEvent;
    public imageTransform: ImageTransform;

    constructor(
        public name: string,
        public source: string,
        public guid: string = GUID.create()
    )
    {
        this.reset();
    }

    public reset()
    {
        this.imageTransform = { scale: 1, transformX: 0, transformY: 0 };
        this.formatData = null;
        this.cropperData = null;
    }
}