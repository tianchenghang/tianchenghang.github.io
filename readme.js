class Bar {
  #brand;

  static staticIsBar(obj) {
    return #brand in obj;
  }

  isBar() {
    return #brand in this;
  }
}

console.log(Bar.staticIsBar(new Bar())); // true
console.log(Bar.staticIsBar({})); // false
let foo = new Bar();
console.log(foo.isBar()); // true
console.log(foo.isBar.apply({})); // false
