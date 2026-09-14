const msToTime = ({ duration, format }) => {
  const milliseconds = Math.floor((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  if (format === 'hh:mm:ss') {
    return `${hours}:${minutes}:${seconds}`
  } else if (format === 'hh:mm') {
    return `${hours}:${minutes}`
  }

  return `${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`
}

module.exports = { msToTime }