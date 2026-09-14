const { google } = require('googleapis')
const { Schedule, ScheduleHistory } = require('../../models')

const deleteGcal = ({ eventId, createScheduleHistory = false, user = null, schedule = null, updateSchedule = false, sendUpdates = null }) => {
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

      const deleteOptions = {
        auth: oAuth2Client,
        calendarId: process.env.GCAL_CALENDAR_ID,
        sendUpdates: 'all',
        eventId
      }
      for (const key in deleteOptions) {
        if (!deleteOptions[key]) delete deleteOptions[key]
      }
      const deletedGcal = await calendar.events.delete(deleteOptions)

      if (deletedGcal['status'] == 204 && deletedGcal['statusText'] === 'No Content') {
        if (createScheduleHistory) {
          ScheduleHistory.create({
            ScheduleId: schedule?.id,
            type: 'gcal-unsync',
            createdBy: user.id,
            createdAt: now,
            updatedAt: now
          })
        }

        if (updateSchedule) {
          Schedule.update(
            {
              gcalEventId: null,
              gcalEventStatus: null
            },
            {
              where: {
                id: schedule.id
              }
            }
          )
        }
        resolve('success delete google calendar event')
      } else {
        reject('failed delete google calendar event')
      }
    } catch (err) {
      console.log(err)
      reject('failed delete google calendar event')
    }
  })
}

module.exports = { deleteGcal }