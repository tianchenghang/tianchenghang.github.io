type Spawn = (genFunc: Function) => Promise<any>;
// declare function spawn(genFunc: Function): Promise<any>;
declare const spawn: Spawn;
export default spawn;
