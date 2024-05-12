
const getMonths = () => 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',')

const areDatesEqual = (date1: Date, date2: Date) => {
	return date1.toDateString() === date2.toDateString()
}

export const timestampToTime = (timestamp: number) => {
	const date = new Date(timestamp * 1000)

	const h = date.getHours()
	let m: string|number = date.getMinutes()

	m = m > 9 ? m : `0${m}`

	return `${h}:${m}`
}

export const timestampToDate = (timestamp: number) => {
	const date = new Date(timestamp * 1000)
	const today = new Date()

	if (areDatesEqual(today, date)) {
		return `Сегодня`
	}

	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	if (areDatesEqual(yesterday, date)) {
		return `Вчера`
	}

	const day = date.getDate()
	const month = getMonths()[date.getMonth()]
	const year = date.getFullYear()

	if (date.getFullYear() === today.getFullYear()) {
		return `${day} ${month}`
	}

	return `${day} ${month} ${year}`
}
