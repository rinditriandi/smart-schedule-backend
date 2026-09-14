const { sendEmail } = require('../../../helpers/sendEmail')

module.exports = async (req, res, next) => {
  try {
    const now = new Date()

    const html = `
      <div>Dear All APM,</div>
      <br />
      <div>Please make sure that your WBS has already completed. These WBS, including learning hours, are going to be locked. There are something you have to do :</div>
      <div>
        <ul>
          <li>Check your WBS</li>
          <li>Send your WBS to SAP</li>
          <li>Check your WBS Schedules in Scheduling System</li>
          <li>Make sure your WBS has the SAP ID number</li>
        </ul>
      </div>
      <br />
      <div>Thank you for your attention. Have a nice one.</div>
      <br />
      <div>Regards,</div>
      <div>Scheduling System of prasmul-eli.</div>
    `

    await sendEmail({
      from: 'dithyprabowo51@gmail.com',
      to: 'adityo.prabowo@prasmul-eli.co, adityoprabowo30@gmail.com',
      cc: ['it.system@prasmul-eli.co'],
      subject: '[REMINDER] WBS and Learning Hours Will be Locked',
      html
    })

    res.status(200).json({
      code: '200',
      status: 'OK'
    })
  } catch (err) {
    next(err)
  }
}