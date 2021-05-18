#!/usr/bin/env node

// constructor
function quu(concurrency, wait){
	return (this instanceof quu) ? (this.concurrency = concurrency || 1, this.wait = wait || false, this.running = 0, this.completed = 0, this.stack = [], this.then = [], this.errors = [], this) : (new quu(concurrency, wait));
};

// push tasks to execution queue 
quu.prototype.push = function(fn){
	var self = this;

	// if function was passed, add to stack
	if (typeof fn === "function") self.stack.push(fn);

	// check for execution at the end of the event loop
	!self.wait && setImmediate(function(){

		// if stack is not empty and not staturated, get a task from the stack and execute
		while (self.stack.length > 0 && self.running < self.concurrency) ++self.running, self.stack.shift()(function(err){
			if (err) self.errors.push(err);

			// increment counter
			self.completed++;

			// task completed
			if (--self.running + self.stack.length === 0) return self.then.forEach(function(fn){ fn(self.errors, self.completed); });

			// check for something to do
			if (self.stack.length > 0) self.push();

		});
		
	});

	return this;
};

quu.prototype.run = quu.prototype.done = quu.prototype.start = function(fn){
	var self = this;

	// if function was passed, add to stack
	if (typeof fn === "function") self.then.push(fn);
	
	// if still waiting, start running
	self.wait && (self.wait = false, self.push());
	
	return this;
};

module.exports = quu;

