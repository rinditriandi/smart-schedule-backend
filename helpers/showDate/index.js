const showDate = ({ dateInput, isDateOnly = false, isHoursOnly = false }) => {
  const fullDate = new Date(dateInput)
  let date = `${fullDate.getDate()}`
  let month = `${fullDate.getMonth() + 1}`
  let year = `${fullDate.getFullYear()}`
  let hours = `${fullDate.getHours()}`
  let minutes = `${fullDate.getMinutes()}`

  if (date.length < 2) date = `0${date}`
  if (month.length < 2) month = `0${month}`
  if (hours.length < 2) hours = `0${hours}`
  if (minutes.length < 2) minutes = `0${minutes}`

  if (isDateOnly) {
    return `${year}-${month}-${date}`
  } else if (!isDateOnly && !isHoursOnly) {
    return `${year}-${month}-${date} ${hours}:${minutes}`
  } else if (isHoursOnly) {
    return `${hours}:${minutes}`
  }

}

module.exports = { showDate }