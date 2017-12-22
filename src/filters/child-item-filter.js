export class ChildItemFilterValueConverter {

  toView(array) {
    return array.filter(item => item.settings.root === false);
  }

}
