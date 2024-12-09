console.log(Object.keys(Array.prototype[Symbol.unscopables]));

class Foo {
  foo() {
    return 1;
  }
}
let foo = function () {
  return 2;
};
with (Foo.prototype) {
  console.log(foo() /* 等价于 Bar.prototype.foo() */); // 1
  console.log(Foo.prototype.foo()); // 1
}

class Bar {
  bar() {
    return 1;
  }
  get [Symbol.unscopables]() {
    return { bar: true };
  }
}
let bar = function () {
  return 2;
};
with (Bar.prototype) {
  console.log(bar()); // 2
  console.log(Bar.prototype.bar()); // 1
}
