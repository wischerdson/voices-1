
const getMonths = () => 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',')

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

	if (date.getDate() === today.getDate()) {
		return `Сегодня`
	}

	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	if (yesterday.getDate() === date.getDate()) {
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
