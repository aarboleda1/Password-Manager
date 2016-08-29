
//try catch blocks


//
function doWork () {
	//throw error unable to do work
	//inside try call do work
	throw new Error ('Unable to do work')
}



try{
	doWork()
} catch (e) {
	console.log(e.message) 
	//accessing the error property on the message object
} finally {
	console.log('finally block executed!')
}

console.log('try catch ended');