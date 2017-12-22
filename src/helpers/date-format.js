export class DateFormatValueConverter {

  toView(value) {
    let dateValue = new Date(value);
    return dateValue.toLocaleString('en-GB');
  }

}
