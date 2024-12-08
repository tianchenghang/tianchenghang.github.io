function Node(val) {
  this.val = val;
  this._next = null;
}

Node.prototype[Symbol.iterator] = function () {
  let ctx = this;
  return /* Iterator */ {
    next: () => {
      if (ctx) {
        let val = ctx.val;
        ctx = ctx._next;
        return { done: false, value: val };
      }
      return { done: true /* , value: undefined */ };
    },
  };
};

let first = new Node(1);
let second = new Node(2);
let third = new Node(3);
first._next = second;
second._next = third;

for (let val of first) {
  console.log(val);
}