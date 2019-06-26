# Technical test - Sudesh Kumar Yadav

- Please note that I did not use any framework to keep code simple
- Main source code is written in typescript.

## How to run

1. Extract zip file.
2. Open a terminal in main folder.
3. Install node_modules by running `npm install` or `yarn`.
4. Run `npm run build`.
5. Make sure port 3000 is available on machine.
6. Run `npm run start`.
7. Visit http://localhost:3000.

## Marco Polo Instructions

1. After starting the server, plz visit http://localhost:3000.
2. You can run unit test `node build/game.test.js`.
3. _ Please make sure server is running _. For benchmarks run `npm run benchmark`. I have used `autocannon` to benchmark http service. It will display statistics of benchmark.
4. On my machine I was able to make around 10req/sec with 10 concurrent connections without any timeout errors.
5. I have assumed that there will be an `\n` character at the end of output.

## When is it a good idea to not use NodeJs? Why?

We should not use node.js if we need to write compute intensive and synchronous function.
e.g. Processing an image or computing hash of buffer synchronously.

#### Why?

- node.js runs on V8 which uses Event Loop for executing javascript code.
- Event loop maintains a list of callback functions that will run in future when some IO operation or timer is completed.
- But at one time only one function will execute.
- So if some function takes a lot of time(is compute intensive and synchronous), no other function will execute during its execution.
- So during this time every request from every client will be blocked.
- It will increase response time a lot.
- Converting a synchronous function to asynchronous function by delaying function(setTimeout) can help in unblocking these requests but this will increase complexities and might not perform well.
- Lastly javascript is an interpreted language. So it will be slower than compiled programming language for synchronous functions.

### User Story Instructions

1. After starting the server, plz visit http://localhost:3000.
2. Choose a file and click on parse invoice button. It will display output below this button.
3. You can run unit test `node build/invoice.test.js`.
