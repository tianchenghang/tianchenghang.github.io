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
  class ArrExt1 extends Array {}

  const a = new ArrExt1(1, 2, 3);
  console.log(a instanceof ArrExt1); // true
  console.log(a.map((x) => x) instanceof ArrExt1); // true

  // Test2
  class ArrExt2 extends Array {
    static get [Symbol.species]() {
      return Array;
    }
  }

  const b = new ArrExt2(1, 2, 3);
  console.log(b instanceof ArrExt2); // true
  console.log(b.map((x) => x) instanceof ArrExt2); // false
  console.log(b.filter((x) => true) instanceof ArrExt2); // false
  console.log(b.map((x) => x) instanceof Array); // true
  console.log(b.filter((x) => true) instanceof Array); // true

  // Test3
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

test("Test_Symbol.match", () => {
  // str.match(regexp)
  console.log("hello".match("el").index); // 1
  // 等价于 regexp[Symbol.match](str)
  console.log(RegExp("el")[Symbol.match]("hello").index); // 1
});

test("Test_Symbol.replace", () => {
  // str.replace(regexp, replaceValue)
  console.log("hello".replace("el", "a")); // halo
  // 等价于 regexp[Symbol.replace](str, replaceValue)
  console.log(RegExp("el")[Symbol.replace]("hello", "a")); // halo
});

test("Test_Symbol.search", () => {
  // str.search(regexp)
  console.log("hello".search("el")); // 1
  // 等价于 regexp[Symbol.search](str)
  console.log(RegExp("el")[Symbol.search]("hello")); // 1
});

test("Test_Symbol.split", () => {
  // str.split(regexp, limit)
  console.log("hello".split("", -1)); // [ 'h', 'e', 'l', 'l', 'o' ]
  // 等价于 regexp[Symbol.split](str, limit)
  console.log(RegExp("")[Symbol.split]("hello", -1)); // [ 'h', 'e', 'l', 'l', 'o' ]
});

test("Test_Symbol.iterator", () => {
  const iter = {};
  iter[Symbol.iterator] = function* () {
    yield 3;
    yield 2;
    yield 1;
  };
  console.log([...iter]); // [3, 2, 1]
  for (let val of iter) {
    console.log(val); // 3 2 1
  }
});

test("Test_Symbol.toPrimitive", () => {
  let obj = {
    [Symbol.toPrimitive](hint) {
      switch (hint) {
        case "number": // 需要转换为数值的场景
          return 416;
        case "string": // 需要转换为字符串的场景
          return "lzy";
        case "default": // 不确定
          return "what";
        default:
          throw new Error();
      }
    },
  };
  console.log(2 * obj); // 832
  console.log(2 + obj); // 2what
  console.log(obj == "what"); // true
  console.log(String(obj)); // lzy
});

test("Test_Symbol.toStringTag", () => {
  // 属性
  console.log({ [Symbol.toStringTag]: "Foo" }.toString()); // [object Bar]
  // getter
  class Bar {
    get [Symbol.toStringTag]() {
      return "Bar";
    }
  }
  console.log(new Bar().toString()); // [object Bar]
  console.log(Object.prototype.toString.call(new Bar())); // [object Bar]
});
