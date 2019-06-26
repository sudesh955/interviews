import { parse } from "./invoice";

const testStrings = [
  `
 _  _  _        _     _  _ 
|_ | || |  ||_| _|  ||_ |_ 
|_||_||_|  |  | _|  | _| _|`,
  `
 _  _  _     _  _     _    
|_ |_ | ||_|| ||_||_||_ |_|
|_| _||_|  ||_||_|  | _|  |`,
  `
 _  _  _  _  _  _  _  _    
 _||_|  || ||_   || | _|  |
 _||_|  ||_| _|  ||_||_   |`,
  `
 _        _  _  _  _  _  _ 
 _||_|  |  | _||_ |_   ||_|
 _|  |  |  ||_  _| _|  | _|`,
  `
    _  _     _  _     _  _ 
|_||_ |_|  |  ||_||_||_||_|
  | _| _|  |  | _|  ||_| _|`
].map(str => str.substr(1));

const testValues = [600143155, 650408454, 387057021, 341725579, 459179489];

for (let i = 0; i < testValues.length; i++) {
  const value = parse(testStrings[i]);
  if (value !== testValues[i]) {
    throw new Error(`Expected ${testValues[i]}, found ${value}`);
  }
}
