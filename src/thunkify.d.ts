type Thunk = (cb: Callback) => any;
type Thunkify = (fn: (...args: any[]) => any) => (...args: any[]) => Thunk;
declare const thunkify: Thunkify;
export default thunkify;
