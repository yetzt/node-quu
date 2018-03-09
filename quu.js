#!/usr/bin/env node

// constructor
function quu(concurrency){
	return (this instanceof quu) ? (this.concurrency = concurrency || 1, this.running = 0, this.completed = 0, this.stack = [], this.then = [], this) : (new quu(concurrency));
};

// push tasks to execution queue 
quu.prototype.push = function(fn){
	var self = this;

	// if function was passed, add to stack
	if (typeof fn === "function") self.stack.push(fn);

	// check for execution at the end of the event loop
	setImmediate(function(){

		// if stack is not empty and not staturated, get a task from the stack and execute
		if (self.stack.length > 0 && self.running < self.concurrency) ++self.running, self.stack.shift()(function(){

			// increment counter
			self.completed++;

			// task completed
			if (--self.running + self.stack.length === 0) self.then.forEach(function(fn){ fn(self.completed); });

			// check for something to do
			if (self.stack.length > 0) self.push();

		});
		
	});

	return this;
};

quu.prototype.done = function(fn){
	var self = this;

	// if function was passed, add to stack
	if (typeof fn === "function") self.then.push(fn);
	
	return this;
};

module.exports = quu;

