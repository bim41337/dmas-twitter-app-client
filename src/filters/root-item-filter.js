export class RootItemFilterValueConverter {

  toView(array) {
    return array.filter(item => item.settings.root === true);
  }

}
