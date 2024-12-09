import { test } from "vitest";

test("Test_class1", () => {
  //! User.prototype = user.__proto__
  class User {
    constructor(name) {
      // 隐式 User.prototype.constructor()
      this.name = name;
      this.printName = function () {
        console.log(this.name);
      };
    }

    toString() {
      // 隐式 User.prototype.toString()
      return `User{ ${this.name} }`;
    }

    gender; // 隐式 this.gender
  }

  let user = new User("foo");

  // 类是构造函数的语法糖
  console.log(typeof User); // function
  console.log(User === User.prototype.constructor); // true
  console.log(User === user.constructor); // ture

  // 实例属性定义在实例上
  console.log(user.hasOwnProperty("gender")); // true

  // 实例方法定义在类的 prototype 属性上 (User.prototype)
  console.log(user.hasOwnProperty("toString")); // false
  console.log(User.prototype.hasOwnProperty("toString")); // true
  console.log(user.__proto__.hasOwnProperty("toString")); // true

  console.log(User === User.prototype.constructor); // true
  console.log(User.prototype === user.__proto__); // true
  console.log(user.constructor === User.prototype.constructor); // true

  console.log(user.toString()); // User{ foo }
  console.log(User.prototype.toString.call(user)); // User{ foo }

  // 显式 `this.propKey = propVal` 的属性, 定义在实例上
  console.log(user.hasOwnProperty("name")); // true
  console.log(user.hasOwnProperty("printName")); // true

  // 静态属性, 静态方法定义在类自身上 (User)

  // 类内部的所有方法, 都是不可遍历的 (non-enumerable)
  Object.assign(User.prototype, {
    printUser() {
      console.log(this.toString());
    },
  });
  user.printUser(); // User{ foo }
  console.log(
    Reflect.getOwnPropertyDescriptor(User.prototype, "toString").enumerable,
  ); // false
  console.log(
    Reflect.getOwnPropertyDescriptor(User.prototype, "printUser").enumerable,
  ); // true

  // 类必须使用 new 调用
  try {
    let user = User();
  } catch (err) {
    // TypeError: Class constructor User cannot be invoked without 'new'
    console.log(err);
  }

  // 类的所有实例共享同一个原型对象 (User.prototype)
  let user2 = new User();
  console.log(user.__proto__ === user2.__proto__); // true
});

test("Test_class2", () => {
  class User {
    constructor(name) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    set name(newName) {
      this._name = newName;
    }
  }

  let user = new User();
  console.log(user.hasOwnProperty("_name")); // true
  console.log(User.prototype.hasOwnProperty("_name")); // false
  console.log(user.hasOwnProperty("name")); // false
  console.log(User.prototype.hasOwnProperty("name")); // true

  let propDescriptor = Object.getOwnPropertyDescriptor(User.prototype, "name");
  console.log(propDescriptor);
  // {
  //   get: [Function: get name],
  //   set: [Function: set name],
  //   enumerable: false,
  //   configurable: true
  // }
  // User.prototype 原型对象的 name 属性的 get 和 set 方法
  // 定义在 User.prototype 原型对象的 name 属性的属性描述对象上
  console.log(propDescriptor.hasOwnProperty("get")); // true
  console.log(propDescriptor.hasOwnProperty("set")); // true
});

test("Test_class3", () => {
  class Iter {
    constructor(...args) {
      this.elems = args;
    }

    *[Symbol.iterator]() {
      // 隐式 Iter.prototype[Symbol.iterator] = function* ()
      for (let item of this.elems) {
        yield item;
      }
    }
  }

  let iter = new Iter(1, 2, 3);
  console.log(Reflect.ownKeys(iter)); // [ 'elems' ]
  console.log(Reflect.ownKeys(iter.__proto__)); // [ 'constructor', Symbol(Symbol.iterator) ]
  for (let x of iter) {
    console.log(x); // 1 2 3
  }
});

test("Test_class5", () => {
  class Foo {
    printName(name = "bar") {
      this.print(`name: ${name}`);
    }

    print(str) {
      console.log(str);
    }
  }

  let foo = new Foo();
  let { printName } = foo;
  try {
    printName();
  } catch (err) {
    console.log(err); // TypeError: Cannot read properties of undefined (reading 'print')
  }
});

test("Test_class6", () => {
  class Foo {
    constructor() {
      this.printName = this.printName.bind(this);
    }

    printName(name = "bar") {
      this.print(`name: ${name}`);
    }

    print(str) {
      console.log(str);
    }
  }

  let foo = new Foo();
  let { printName } = foo;
  printName(); // name: bar
});

test("Test_class7", () => {
  function Foo(name) {
    if (new.target !== undefined) {
      console.log(new.target);
      this.name = name;
    } else {
      throw new Error("Use `new`");
    }
  }

  // [Function Foo]
  console.log(new Foo("foo")); // Foo { name: 'foo' }

  function Bar(name) {
    if (new.target !== Bar) {
      throw new Error("Use `new`");
    }
    console.log(new.target);
    this.name = name;
  }

  // [Function Foo]
  console.log(Reflect.construct(Bar, ["bar"])); // Foo { name: 'bar' }
});

test("Test_class8", () => {
  class Foo {
    constructor(name) {
      if (new.target !== undefined) {
        console.log(new.target);
        this.name = name;
      } else {
        throw new Error("Use `new`");
      }
    }
  }

  // [class Foo]
  console.log(new Foo("foo")); // Foo { name: 'foo' }
  class Foobar extends Foo {
    // constructor(name) { super(name); }
  }

  // [class Foobar extends Foo]
  console.log(Reflect.construct(Foobar, ["foobar"])); // Foobar { name: 'foobar' }
});

test("Test_class9", () => {
  class Foo {
    constructor(name) {
      this.name = name;
      if (new.target === Foo) {
        throw "Foo is virtual";
      }
    }
  }

  class Foobar extends Foo {
    constructor(name) {
      super(name);
    }
  }

  try {
    new Foo();
  } catch (e) {
    console.log(e); // Foo is virtual
  }
  console.log(new Foobar("foobar")); // Foobar { name: 'foobar' }
});

// 静态属性的继承是浅拷贝
test("Test_class10", () => {
  class Parent {
    static foo = { val: 1 };
  }

  class Child extends Parent {
    constructor() {
      super();
      Child.foo.val++; // 静态属性的继承是浅拷贝
    }
  }

  new Child();
  console.log(Parent.foo); // { val: 2 }
  console.log(Child.foo); // { val: 2 }
});

test("Test_class11", () => {
  class Parent {
    name = "parent";

    constructor() {
      console.log(`name: ${this.name}`); // name: parent
    }
  }

  class Child extends Parent {
    // 隐式生成
    // constructor(...args) {
    //   super(...args);
    // }
    name = "child";
  }

  new Child();
});

test("Test_class12", () => {
  class Parent {
    constructor() {
      this.foo = 200;
    }

    retFoo() {
      return this.foo;
    }
  }

  Parent.prototype.bar = 404;
  Parent.baz = 502;

  class Child extends Parent {
    constructor() {
      super();
      // super === Parent.prototype
      console.log(super.retFoo()); // 200
      console.log(super.foo); // undefined
      console.log(super.bar); // 404
    }

    static print() {
      // super === Parent
      console.log(super.baz); // 502
    }
  }

  new Child();
  Child.print();
});
