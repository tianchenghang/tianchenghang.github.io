import { test } from "vitest";

test("Test_Symbol.isConcatSpreadable", () => {
  class ArrExt1 extends Array {
    constructor(args) {
      // 隐式 this = { __proto__: ArrExt1.prototype }
      super(args); // 调用超类的构造函数 `super(args)` 时, super 指向超类的构造函数
      // 通常 super 指向 this (被构造对象) 的原型对象 `this.__proto__`
      console.log(super.toString() === this.__proto__.toString()); // true
      console.log(this); // ArrExt1(1) [ undefined ]
      console.log(this.__proto__, typeof this.__proto__); // Array {} object
      this[Symbol.isConcatSpreadable] = true;
      // 隐式 return this
    }
  }

  class ArrExt2 extends Array {
    constructor(args) {
      // 隐式 this = { __proto__: ArrExt2.prototype }
      super(args); // 调用超类的构造函数 `super(args)` 时, super 指向超类的构造函数
      // 通常 super 指向 this (被构造对象) 的原型对象 `this.__proto__`
      console.log(super.toString() === this.__proto__.toString()); // true
      console.log(this); // ArrExt2(1) [ undefined ]
      console.log(this.__proto__, typeof this.__proto__); // Array {} object
      // 隐式 return this
    }

    get [Symbol.isConcatSpreadable]() {
      return false;
    }
  }

  let arr1 = new ArrExt1();
  arr1[0] = 10;
  arr1[1] = 11;

  let arr2 = new ArrExt2();
  arr2[0] = 20;
  arr2[1] = 21;
  console.log([0, 1].concat(arr1).concat(arr2)); // Array(5) [0, 1, 10, 11, ArrExt2(2)]
  console.log(arr1.__proto__, typeof arr1.__proto__); // Array {} object
  console.log(ArrExt1.__proto__, typeof ArrExt1.__proto__); // [Function: Array] function
});

test("Test_Symbol.species", () => {
  // Test1
  class ArrExt extends Array {
    static get [Symbol.species]() {
      return Array;
    }
  }

  const a = new ArrExt();
  const b = a.map((x) => x);

  console.log(a instanceof ArrExt); // true
  console.log(a instanceof Array); // true
  console.log(ArrExt[Symbol.hasInstance](a)); // true
  console.log(Array[Symbol.hasInstance](a)); // true

  console.log(b instanceof ArrExt); // false
  console.log(b instanceof Array); // true
  console.log(ArrExt[Symbol.hasInstance](b)); // false
  console.log(Array[Symbol.hasInstance](b)); // true

  // Test2
  class P1 extends Promise {}

  class P2 extends Promise {
    static get [Symbol.species]() {
      return Promise;
    }
  }

  console.log(
    new P1((resolve, reject) => resolve).then((value) => value) instanceof P1,
  ); // true
  console.log(
    new P2((resolve, reject) => resolve).then((value) => value) instanceof P2,
  ); // false
});
