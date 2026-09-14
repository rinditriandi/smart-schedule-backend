const { google } = require('googleapis')

module.exports = async (req, res, next) => {
  try {
    const { summary, description, start, end } = req.body
    if (!summary || !description) throw { code: '400', errors: ['summary and description is required'] }

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
      }
    }

    await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: process.env.GCAL_CALENDAR_ID,
      resource: event
    })

    res.status(201).json({
      code: '201',
      status: 'CREATED'
    })
  } catch (err) {
    next(err)
  }
}