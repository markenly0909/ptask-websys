// Vercel Serverless Function to handle contact form submissions.
// Behavior:
// - If SENDGRID_API_KEY and SENDGRID_TO are set in environment, sends email via SendGrid API.
// - Otherwise logs the submission and returns a demo success response.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body && Object.keys(req.body).length ? req.body : JSON.parse(req.body || '{}')
    const { name, email, message } = body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing name, email or message' })
    }

    // If SendGrid is configured, call the SendGrid API to deliver the message.
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_TO) {
      const sgPayload = {
        personalizations: [
          { to: [{ email: process.env.SENDGRID_TO }] }
        ],
        from: { email: process.env.SENDGRID_FROM || process.env.SENDGRID_TO },
        subject: `Website contact from ${name} <${email}>`,
        content: [{ type: 'text/plain', value: `From: ${name} <${email}>\n\n${message}` }]
      }

      const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sgPayload)
      })

      if (!r.ok) {
        const txt = await r.text()
        console.error('SendGrid delivery failed', r.status, txt)
        return res.status(502).json({ error: 'Failed to deliver message' })
      }

      return res.status(200).json({ ok: true })
    }

    // Demo mode: log the message on the server and return success.
    console.log('Contact form (demo):', { name, email, message })
    return res.status(200).json({ ok: true, demo: true, message: 'Demo mode: message logged on server' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
