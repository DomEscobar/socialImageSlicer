import { GUID } from 'utils';
import { ImageSetting } from './image-setting.model';
import { FormatData } from 'models';

export class ImageData
{
    public formatData: FormatData;

    constructor(
        public name: string,
        public source: string,
        public guid: string = GUID.create()
    )
    {
    }
}