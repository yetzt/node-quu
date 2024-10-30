
// constructor
function quu(concurrency, wait){
	if (!(this instanceof quu)) return new quu(concurrency, wait);

	this.concurrency = concurrency || 1;
	this.wait = wait || false;
	this.running = 0;
	this.completed = 0;
	this.stack = [];
	this.then = [];
	this.errors = [];

	return this;
};

// push tasks to execution queue
quu.prototype.push = function(fn){

	// if function was passed, add to stack
	if (typeof fn === "function") this.stack.push(fn);

	// check for execution at the end of the event loop
	!this.wait && setImmediate(()=>{

		// if stack is not empty and not staturated, get a task from the stack and execute
		while (this.stack.length > 0 && this.running < this.concurrency) ++this.running, this.stack.shift()(err=>{
			if (err) this.errors.push(err);

			// increment counter
			this.completed++;

			// check if all tasks completed
			if (--this.running + this.stack.length === 0) {

				// execute all finishing callbacks
				while (this.then.length > 0) this.then.shift()(this.errors, this.completed);
				return;

			};

			// check for something to do
			if (this.stack.length > 0) this.push();

		});

	});

	return this;
};

quu.prototype.run = quu.prototype.done = quu.prototype.start = function(fn){

	// if function was passed, add to stack
	if (typeof fn === "function") this.then.push(fn);

	// if still waiting, start running
	this.wait && (this.wait = false, this.push());

	// return a promise when no callback was provided
	return (typeof fn === "function") ? this : new Promise((resolve,reject)=>{
		this.then.push((errors, completed)=>resolve({ errors, completed }));
	});
};

module.exports = quu;