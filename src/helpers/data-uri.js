import {Buffer} from 'buffer';

export class DataUriValueConverter {

  toView(value) {
    let imgString = Buffer.from(value.data).toString('base64');
    return `data:image/jpeg;base64,${imgString}`;
  }

}
