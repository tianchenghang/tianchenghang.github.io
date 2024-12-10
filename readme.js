class Bar {
  #brand;

  static staticIsBar(obj) {
    try {
      console.log(obj.#brand);
      return true;
    } catch (err) {
      console.log(err); // TypeError: Cannot read private member #brand
      return false;
    }
  }

  isBar() {
    try {
      console.log(this.#brand);
      return true;
    } catch (err) {
      console.log(err); // TypeError: Cannot read private member #brand
      return false;
    }
  }
}

console.log(Bar.staticIsBar(new Bar())); // true
console.log(Bar.staticIsBar({})); // false
let bar = new Bar();
console.log(bar.isBar()); // true
console.log(bar.isBar.apply({})); // false
