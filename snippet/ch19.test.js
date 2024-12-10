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
  class Iter /* implements Iterable */ {
    constructor(...args) {
      this.items = args;
    }

    *[Symbol.iterator]() {
      // 隐式 Iter.prototype[Symbol.iterator] = function* ()
      for (let item of this.items) {
        yield item;
      }
    }
  }

  let iter /* implements Iterable */ = new Iter(1, 2, 3);
  // iter = {
  //   items: [1, 2, 3],
  //   __proto__: {
  //     constructor() {},
  //     [Symbol.iterator]: function* () {
  //       for (let item of this.items) {
  //         yield item;
  //       }
  //     },
  //   },
  // };
  let gen = iter[Symbol.iterator]();
  console.log(Reflect.ownKeys(iter)); // [ 'items' ]
  console.log(Reflect.ownKeys(iter.__proto__)); // [ 'constructor', Symbol(Symbol.iterator) ]
  for (let item of iter) {
    console.log(item); // 1 2 3
  }
});

test("Test_class4", () => {
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

test("Test_class5", () => {
  class Foo {
    constructor() {
      this.printName = this.printName.bind(this);
    }

    printName(name = "bar") {
      this.print(`name: ${name}`); // name: bar
    }

    print(str) {
      console.log(str);
    }
  }

  let foo = new Foo();
  let { printName } = foo;
  printName(); // name: bar
});

test("Test_class6", () => {
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

  // [Function Bar]
  console.log(Reflect.construct(Bar, ["bar"])); // Bar { name: 'bar' }
});

test("Test_class7", () => {
  class Parent {
    constructor() {
      console.log(new.target);
    }
  }

  class Child extends Parent {
    // 隐式自动生成
    // constructor(...args) {
    //   super(...args);
    // }
  }

  new Child(); // [class Child extends Parent]
  Reflect.construct(Child, [] /* argArr */); // [class Child extends Parent]
});

test("Test_class8", () => {
  class Virtual {
    constructor(name) {
      this.name = name;
      if (new.target === Virtual) {
        throw "virtual";
      }
    }
  }

  class Impl extends Virtual {}

  try {
    new Virtual();
  } catch (e) {
    console.log(e); // virtual
  }
  console.log(new Impl("foo")); // Impl { name: 'foo' }
});

// 子类访问父类的私有属性
test("Test_class9", () => {
  class Parent {
    #foo = 1;

    getFoo() {
      console.log(this); // Child {}
      return this.#foo;
    }
  }

  class Child extends Parent {
    constructor() {
      super(); // 调用 super(), 即调用父类的构造方法以初始化 this
      console.log(this.getFoo()); // 1
    }
  }

  new Child();
});

// 静态属性的继承是浅拷贝
test("Test_class10", () => {
  class Parent {
    static foo = { val: 1 };
  }

  class Child extends Parent {
    constructor() {
      super();
      // 等价于 Parent.prototype.constructor.call(this);
      Child.foo.val++; // 静态属性的继承是浅拷贝
    }
  }

  new Child();
  console.log(Parent.foo); // { val: 2 }
  console.log(Child.foo); // { val: 2 }
});

test("Test_class11", () => {
  class Parent {
    name = "mom";

    constructor() {
      console.log(`name: ${this.name}`);
    }
  }

  Parent.prototype.name = "dad";

  class Child extends Parent {
    // 隐式生成
    // constructor(...args) {
    //   super(...args);
    // }
    name = "child";

    printParentName() {
      console.log("name:", super.name); // super = Parent.prototype
    }
  }

  let child = new Child(); // name: mom
  child.printParentName(); // name: dad
});

test("Test_class12", () => {
  class Parent {
    constructor() {
      console.log(this);
      this.printThis();
    }

    printThis() {
      console.log(this);
    }

    static staticPrintThis() {
      console.log(this);
    }
  }

  class Child extends Parent {
    // @override
    printThis() {
      super.printThis();
    }

    // @override
    static staticPrintThis() {
      super.staticPrintThis();
    }
  }

  Child.staticPrintThis(); // [class Child extends Parent] Child{}
  let child = new Child(); // Child{}
  child.printThis(); // Child{}
});

test("Test_class13", () => {
  class Parent {
    constructor() {
      this.foo = 1;
    }

    printFoo() {
      console.log(this.foo);
    }
  }

  class Child extends Parent {
    constructor() {
      super();
      this.foo = 2; // this.__proto__.foo = 2;
    }

    // @override
    printFoo() {
      super.printFoo();
      // 等价于
      super.printFoo.call(this);
    }
  }

  let child = new Child();
  child.printFoo(); // 2 2
});

test("Test_class14", () => {
  class Parent {
    constructor() {
      this.foo = 1; // 使用 super 调用父类实例方法时, 父类方法中的 this 指向子类实例
    }
  }

  class Child extends Parent {
    constructor() {
      super(); // 调用父类的构造方法以初始化 this
      console.log(this.foo); // 1

      this.foo = 2;
      console.log(this.foo); // 2

      console.log(super.valueOf()); // Child { foo: 2 }

      super.foo = 3;
      //! 等价于
      //* super.valueOf().foo = 3;
      //* this.foo = 3;
      console.log(this.foo); // 3
      console.log(super.foo); // undefined; 等价于 console.log(Parent.prototype.foo);

      super.valueOf().foo = 4;
      console.log(this.foo); // 4
      console.log(super.foo); // undefined; 等价于 console.log(Parent.prototype.foo);

      Parent.prototype.foo = 5;
      console.log(this.foo); // 4
      console.log(super.foo); // 5

      console.log(this === super.valueOf()); // true
      console.log(this.valueOf() === super.valueOf()); // true
      console.log();
    }

    instanceMethod() {
      console.log(super.valueOf()); // Child { foo: 4 }
      super.bar = 6;
      //! 等价于
      //* super.valueOf().bar = 5;
      //* this.bar = 5;
      //* child.bar = 5

      console.log(this === super.valueOf()); // true
      console.log(this.valueOf() === super.valueOf()); // true
      console.log();
    }

    // 最先执行
    static {
      console.log(super.valueOf()); // [class Child extends Parent]
      super.foobar = 7;
      //! 等价于
      //* super.valueOf().foobar = 7;
      //* this.foobar = 7;
      //* Child.foobar = 7

      console.log(this === super.valueOf()); // true
      console.log(this.valueOf() === super.valueOf()); // true
      console.log();
    }

    static staticMethod() {
      console.log(super.valueOf()); // [class Child extends Parent] { foobar: 7 }
      super.valueOf().baz = 8;
      //! 等价于 super.baz = 8;
      //* this.baz = 8;
      //* Child.baz = 8;

      console.log(this === super.valueOf()); // true
      console.log(this.valueOf() === super.valueOf()); // true
      console.log();
    }
  }

  let child = new Child();
  child.instanceMethod();
  Child.staticMethod();
  console.log(child.foo, child.bar); // 4 6
  console.log(Child.foobar, Child.baz); // 7 8
});

test("Test_class15", () => {
  let obj = {
    print() {
      console.log(super.valueOf()); // { print: [Function: print] }
      console.log(this === this.valueOf()); // true
      console.log(this === super.valueOf()); // true
      console.log(this.valueOf() === super.valueOf()); // true
    },
  };
  obj.print();

  class Klass {
    static {
      console.log(super.valueOf()); // [class Klass]
      console.log(this === this.valueOf()); // true
      console.log(this === super.valueOf()); // true
      console.log(this.valueOf() === super.valueOf()); // true
    }
  }
});

// todo
test("Test_Mixin", () => {
  function mix(...Mixins) {
    class Mix {
      constructor() {
        for (let Mixin of Mixins) {
          copyProps(this, new Mixin()); // 拷贝实例属性
        }
      }
    }
    for (let Mixin of Mixins) {
      copyProps(Mix, Mixin); // 拷贝静态属性, 静态方法
      copyProps(Mix.prototype, Mixin.prototype); // 拷贝实例方法
    }
    return Mix;
  }

  function copyProps(target, src) {
    for (let propKey of Reflect.ownKeys(src)) {
      if (
        propKey !== "constructor" &&
        propKey !== "prototype" &&
        propKey !== "name"
      ) {
        let propDesc = Object.getOwnPropertyDescriptor(src, propKey);
        Object.defineProperty(target, propKey, propDesc);
      }
    }
  }

  class Dad {
    static dad = "dad";
    static printDad() {
      console.log("dad");
    }
  }
  class Mom {
    mom = "mom";
    printMom() {
      console.log("mom");
    }
  }
  class Child extends mix(Dad, Mom) {}
  console.log(Child.dad); // dad
  Child.printDad(); // dad
  let child = new Child();
  console.log(child.mom); // mom
  child.printMom(); // mom
});
