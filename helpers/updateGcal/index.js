const { ScheduleHistory } = require('../../models')
const { google } = require('googleapis')

const updateGcal = async ({ start, end, summary, description, attendees, schedule, sendUpdates = null, location = null }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET_KEY,
        'https://developers.google.com/oauthplayground'
      );
      oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
      const calendar = google.calendar({ version: "v3" })

      // Event for Google Calendar
      const event = {
        summary,
        description: description || undefined,
        location,
        start: {
          'dateTime': new Date(start),
          'timeZone': 'Asia/Jakarta'
        },
        end: {
          'dateTime': new Date(end),
          'timeZone': 'Asia/Jakarta'
        },
        attendees: attendees || undefined,
        guestsCanInviteOthers: false
      }
      for (const key in event) {
        if (!event[key]) delete event[key]
      }

      // Create Gcal
      const updateOptions = {
        auth: oAuth2Client,
        calendarId: process.env.GCAL_CALENDAR_ID,
        sendUpdates,
        requestBody: event,
        eventId: schedule.gcalEventId
      }
      for (const key in updateOptions) {
        if (!updateOptions[key]) delete updateOptions[key]
      }
      const newGcal = await calendar.events.update(updateOptions)

      if (newGcal['status'] == 200 && newGcal['statusText'] === 'OK') {
        resolve('success update google calendar event')
      } else {
        reject('failed update google calendar event')
      }
    } catch (err) {
      console.log(err)
      reject('failed update google calendar event')
    }
  })
}

module.exports = { updateGcal }