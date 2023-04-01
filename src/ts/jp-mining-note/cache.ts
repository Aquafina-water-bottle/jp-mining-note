import { JSDOM } from 'jsdom'

function main() {
  console.log("Hello world!");
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  let x = dom.window.document.createElement("span");
  console.log(x);
}

main();
