# quu

`quu` is a simple and lightweigt function queue. 

## Usage

### quu(concurrency)

Create an instance of quu.

### quu.push(function task(done))

Add a task to the queue.

## Example 

``` javascript

var quu = require("quu");

// create queue with a maximum concurrency of 5
var q = quu(5);

// add a task to the queue

q.push(function(done){
	
	// let's do heaps of async stuff...
	// look at all the stuff we are doing...
	// nearly finished... done. 
	// phew! that was quite some work.
	// ok, lets wrap this up now!
	
	done();
	
});

```

## Licence

[UNLICENSE](http://unlicense.org/UNLICENSE)
