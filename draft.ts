const fs = require("fs");
const { promisify } = require("util");

const _readFile = promisify(fs.readFile);

_readFile("./package.json")
  .then((value: any) => {
    console.log(value.toString());
    return _readFile("./README.md");
  })
  .then((value: any) => {
    console.log(value.toString());
    return _readFile("./tsconfig.json");
  })
  .then((value: any) => {
    console.log(value.toString());
  })
  .catch((reason: any) => {
    console.log(reason);
  });
