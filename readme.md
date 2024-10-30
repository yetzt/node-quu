# quu

`quu` is a simple and lightweigt function queue.

## Usage

### `quu(concurrency, wait)`

Create an instance of quu. Run `<int> concurrency` tasks at once, `<bool> wait` for `run()` to be called before starting any tasks.

### `q.push(function task(done){ done(err); })`

Add a task to the queue. Call `done()` when the task is done any `err` will be collected.

### `q.run([function complete(errors){  }])`

`complete` will be called, when all tasks are completed, with all `errors` collected.

When no callback is provided, `q.run()` returns a promise.

## Example

``` javascript

const quu = require("quu");

// create queue with a maximum concurrency of 5
const q = quu(5);

// add a task to the queue
q.push(done=>{

	// let's do heaps of async stuff...
	// look at all the stuff we are doing...
	// nearly finished... done.
	// phew! that was quite some work.
	// ok, lets wrap this up now!

	done();

});

// callback after tasks are complete
q.run((errors, completed)=>{
	if (errors) errors.forEach(console.error);

	// queue is empty

});

// or promise
const { errors, completed } = await q.run();

```

## Licence

[UNLICENSE](http://unlicense.org/UNLICENSE)
