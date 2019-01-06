console.log(123)
async function f() {
	console.log('async')
	await 2
	console.log('async await')
}
f()
console.log('end')

