const { mkdirSync } = require('fs')
const as1 = async () => {
  return 1
}

const as2 = async () => {
	return 2
}

const as3 = async () => {
	return 3
}

const re = Promise.all([as1(), as2(), as3()])
re.then((res) => {
	console.log(res)
})
console.log(re)
console.log(123)

mkdirSync('./books/码农·解锁机器学习（第30期）/专题：解锁机器学习.pdf')
