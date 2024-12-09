class Foo {
  #_privateField = "private field";
  static #_staticPrivateField = "static private field";

  get #privateField() {
    console.log("getter");
    return this.#_privateField;
  }

  static get #staticPrivateField() {
    console.log("getter");
    return this.#_staticPrivateField;
  }

  #privateMethod() {
    console.log(this.#privateField);
  }

  static #staticPrivateMethod() {
    console.log(this.#staticPrivateField);
  }

  publicPrint() {
    this.#privateMethod(); // this === foo
    console.log(this.#_privateField);
  }

  static staticPublicPrint() {
    this.#staticPrivateMethod(); // this === Foo
    console.log(this.#_staticPrivateField);
  }
}

// getter, static private field
// static private field
Foo.staticPublicPrint();
let foo = new Foo();
// getter, private field
// private field
foo.publicPrint();
