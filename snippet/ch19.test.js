import { test } from "vitest";

test("Test_class1", () => {
  // 1. 类是构造函数的语法糖
  // 2. 属性默认定义在实例上
  // 3. 方法默认定义在类的 prototype 属性上
  // 4. 显式 `this.propKey = propVal` 的属性, 定义在实例上
  // 5. 类内部的所有方法, 都是不可遍历的 (non-enumerable)
  // 6. 类必须使用 new 调用
  // 7. 类的所有实例共享同一个原型对象

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

    gender; // 隐式 this.gender = undefined
  }

  let user = new User("foo");

  console.log("1. 类是构造函数的语法糖");
  console.log(typeof User); // function
  console.log(User === User.prototype.constructor); // true
  console.log(User === user.constructor); // ture

  console.log("\n2. 属性默认定义在实例上");
  console.log(user.hasOwnProperty("gender")); // true

  console.log("\n3. 方法默认定义在类的 prototype 属性上");
  console.log(user.hasOwnProperty("toString")); // false
  console.log(User.prototype.hasOwnProperty("toString")); // true
  console.log(user.__proto__.hasOwnProperty("toString")); // true
  console.log(user.constructor === User.prototype.constructor); // true
  console.log(user.constructor === user.__proto__.constructor); // true
  console.log(user.toString()); // User{ foo }
  console.log(User.prototype.toString.call(user)); // User{ foo }
  console.log(user.__proto__.toString.call(user)); // User{ foo }

  console.log("\n4. 显式 `this.propKey = propVal` 的属性, 定义在实例上");
  console.log(user.hasOwnProperty("name")); // true
  console.log(user.hasOwnProperty("printName")); // true

  console.log("\n5. 类内部的所有方法, 都是不可遍历的 (non-enumerable)");
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

  console.log("\n6. 类必须使用 new 调用");
  try {
    let user = User();
  } catch (err) {
    // TypeError: Class constructor User cannot be invoked without 'new'
    console.log(err);
  }

  console.log("\n7. 类的所有实例共享同一个原型对象");
  let user2 = new User();
  console.log(user.__proto__ === user2.__proto__); // true

  console.log(User.hasOwnProperty("constructor")); // false
  console.log(User.prototype.hasOwnProperty("constructor")); // true
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
  // User.prototype 原型对象 的 name 属性的 get 方法 和 set 方法, 定义在 name 属性的属性描述对象上
  console.log(propDescriptor.hasOwnProperty("get")); // true
  console.log(propDescriptor.hasOwnProperty("set")); // true
});

test("Test_class3", () => {
  class Parent {
    constructor() {
      // 隐式 Parent.prototype.constructor()
      console.log("parent constructor");
    }

    static staticMethod() {
      // 隐式 Parent.staticMethod()
      console.log("parent static method");
    }

    instanceMethod() {
      // 隐式 Parent.prototype.instanceMethod()
      console.log("parent instance method");
    }
  }

  class Child extends Parent {
    constructor() {
      //! super 可以在子类的构造函数中调用超类的构造函数 super()
      super();
      //! super 可以在子类的构造方法中调用超类的实例方法 super.instanceMethod(), super = Parent.prototype
      super.instanceMethod();
    }

    childInstanceMethod() {
      //! super 可以在子类的实例方法中调用超类的实例方法 super.instanceMethod(), super = Parent.prototype
      super.instanceMethod();
    }

    static childStaticMethod() {
      //! super 可以在子类的静态方法中调用超类的静态方法 super.staticMethod(), super = Parent
      super.staticMethod();
    }
  }

  // parent static method
  Child.childStaticMethod();
  // parent constructor
  // parent instance method
  let child = new Child();
  // parent instance method
  child.childInstanceMethod();
});
