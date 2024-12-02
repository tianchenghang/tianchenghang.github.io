import { test } from "vitest";

test("Test_Set1", () => {
  console.log(Set.prototype[Symbol.iterator] === Set.prototype.keys); // true
  console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true
  console.log(Set.prototype.keys === Set.prototype.values); // true
});

test("Test_Map1", () => {
  Object.is(+0, -0); // false
  Object.is(NaN, NaN); // true
  Object.is({}, {}); // false
  // Set 使用 Object.is() 判断键是否相等 (键等于值)
  // Map 也使用 Object.is() 判断键是否相等
  let dict = new Map();

  // 7 种原生数据类型: null, undefined, Boolean, Number, BigInt, String, Symbol
  dict.set(null, "vNull");
  dict.set(undefined, "vUndefined");
  dict.set(true, "vTrue");
  dict.set(1, "vNumber");
  dict.set(BigInt(1), "vBigInt");
  dict.set("str", "vString");
  dict.set(Symbol("desc"), "vSymbol");
  dict.set({ prop: "val" }, "vObject");

  console.log(dict.get(null)); // vNull
  console.log(dict.get(undefined)); // vUndefined
  console.log(dict.get(true)); // vTrue
  console.log(dict.get(1)); // vNumber
  console.log(dict.get(BigInt(1))); // vBigInt
  console.log(dict.get("str")); // vString
  console.log(dict.get(Symbol.for("desc"))); // undefined
  console.log(dict.get(Symbol("desc"))); // undefined
  console.log(dict.get({ prop: "val" })); // undefined
  console.log(dict);
});

test("Test_Map2", () => {
  let dict = new Map();

  let syma = Symbol("syma");
  dict.set(syma, "syma");
  console.log(dict.get(syma)); // syma
  console.log(dict.get(Symbol.for("syma"))); // undefined

  dict.set(Symbol.for("symb"), "symb");
  console.log(dict.get(Symbol.for("symb"))); // symb
});

test("Test_Map_Array", () => {
  // 将 map 对象转换为数组
  let dict = new Map().set(1, "a").set(2, "b").set(3, "c");
  // 使用扩展运算符 ...
  console.log([...dict]); // [ [ 1, 'a' ], [ 2, 'b' ], [ 3, 'c' ] ]

  // 将数组转换为 map 对象
  // Map{ 1 => 'a', 2 => 'b', 3 => 'c' }
  console.log(
    new Map([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]),
  );
});

test("Test_Map_Object", () => {
  // 将 Map 转换为 Object
  function map2obj(dict) {
    let obj = Object.create(null /* prototype */);
    for (let [k, v] of dict) {
      obj[k] = v;
    }
    return obj;
  }

  // [Object: null prototype] { str: 'vString', '[object Object]': 'vObject' }
  console.log(
    map2obj(new Map().set("str", "vString").set({ prop: "val" }, "vObject")),
  );

  // 将 Object 转换为 Map
  let obj = {
    1: "val",
    str: "vString",
    [Symbol.for("desc")]: "vSymbol" /* 不可遍历的 */,
  };
  console.log(Object.entries(obj)); // [ [ '1', 'val' ], [ 'str', 'vString' ] ]
  let kvs = new Map(Object.entries(obj));
  console.log(kvs); // Map{ '1' => 'val', 'str' => 'vString' }
});

test("Test_Map_JSON", () => {
  function map2obj(dict) {
    let obj = Object.create(null /* prototype */);
    for (let [k, v] of dict) {
      obj[k] = v;
    }
    return obj;
  }

  let dict = new Map().set("str", "vString").set({ prop: "val" }, "vObject");

  // 将 JSON 转换为 Map
  // 1. Map => Object => String
  // 2. Map => Array => String
  // {"str":"vString","[object Object]":"vObject"}
  console.log(JSON.stringify(map2obj(dict))); // Map => Object => String

  // [["str","vString"],[{"prop":"val"},"vObject"]]
  console.log(JSON.stringify([...dict])); // Map => Array => String

  // 将 Map 转换为 JSON
  // 1. String => Object => Map
  // 2. String => Array => Map
  let obj = JSON.parse('{"str":"vString","[object Object]":"vObject"}'); // String => Object
  console.log(obj.constructor); // [Function: Object]
  // Map{ 'str' => 'vString', '[object Object]' => 'vObject' }
  console.log(new Map(Object.entries(obj))); // Object => Map

  let arr = JSON.parse('[["str","vString"],[{"prop":"val"},"vObject"]]'); // String => Array
  console.log(arr.constructor); // [Function: Array]
  // Map{ 'str' => 'vString', { prop: 'val' } => 'vObject' }
  console.log(new Map(arr)); // Array => Map
});
