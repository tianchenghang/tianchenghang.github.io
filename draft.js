function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function log(value, ms) {
  await timeout(ms);
  console.log(value);
}

log("hello world", 3000);
