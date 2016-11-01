#!/usr/bin/env node

// constructor
function quu(concurrency){
	return (this instanceof quu) ? (this.concurrency = concurrency || 1, this.running = 0, this.stack = [], this) : (new quu(concurrency));
};

// push tasks to execution queue 
quu.prototype.push = function(fn){
	var self = this;

	// if function was passed, add to stack
	if (typeof fn === "function") self.stack.push(fn);

	// if stack is not empty and not staturated, get a task from the stack and execute
	if (self.stack.length > 0 && self.running < self.concurrency) ++self.running, self.stack.shift()(function(){

		// task completed
		--self.running;

		// check for something to do at the end of the event loop
		setImmediate(function(){
			self.push();
		});

	});
	return this;
};

module.exports = quu;

