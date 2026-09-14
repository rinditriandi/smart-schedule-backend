const { Schedule, ScheduleHistory } = require('../../models')
const { google } = require('googleapis')

const createGcal = async ({ ScheduleId, start, end, summary, description, attendees, createScheduleHistory = false, user = null, sendUpdates = null, location = null }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const now = new Date().getTime()
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
        description,
        start: {
          'dateTime': new Date(start),
          'timeZone': 'Asia/Jakarta'
        },
        end: {
          'dateTime': new Date(end),
          'timeZone': 'Asia/Jakarta'
        },
        attendees: attendees || undefined,
        guestsCanInviteOthers: false,
        location
      }
      for (const key in event) {
        if (!event[key]) delete event[key]
      }

      // Create Gcal
      const insertOptions = {
        auth: oAuth2Client,
        calendarId: process.env.GCAL_CALENDAR_ID,
        sendUpdates: 'all',
        requestBody: event
      }
      for (const key in insertOptions) {
        if (!insertOptions[key]) delete insertOptions[key]
      }
      const newGcal = await calendar.events.insert(insertOptions)

      if (newGcal['status'] == 200 && newGcal['statusText'] === 'OK') {
        // Update gcal event status and gcal event id
        Schedule.update(
          {
            gcalEventId: newGcal.data.id,
            gcalEventStatus: newGcal.statusText
          },
          {
            where: {
              id: ScheduleId
            }
          }
        )

        if (createScheduleHistory) {
          ScheduleHistory.create({
            ScheduleId,
            type: 'gcal-sync',
            createdBy: user.id,
            createdAt: now,
            updatedAt: now
          })
        }
        resolve('success create new google calendar')
      } else {
        Schedule.update(
          {
            gcalEventStatus: newGcal.statusText
          },
          {
            where: {
              id: ScheduleId
            }
          }
        )
        reject('failed create gcal')
      }
    } catch (err) {
      console.log(err)
      reject('failed create gcal')
    }
  })
}

module.exports = { createGcal }