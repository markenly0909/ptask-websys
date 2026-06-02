const app = document.getElementById('app')

const projects = [
  { title: 'Aguilar, Markenly — Project Atlas', desc: 'Dashboard for tracking KPIs and team performance', tags: ['React', 'D3', 'API'] },
  { title: 'Aguilar, Markenly — TaskFlow', desc: 'Workflow automation demo with visual pipelines', tags: ['Node', 'Express'] },
  { title: 'Aguilar, Markenly — BlueCommerce', desc: 'Simple e-commerce sample focused on UX', tags: ['HTML', 'CSS'] },
  { title: 'Aguilar, Markenly — Agent Studio', desc: 'Prototype platform for agent experiments', tags: ['Python', 'ML'] }
]

function navTo(hash) {
  location.hash = hash
}

function renderHome() {
  return `
  <section class="hero">
    <div class="meta">
      <h1 class="h-title">Aguilar, Markenly</h1>
      <p class="h-sub">Web Systems and Technologies — Frontend &amp; full‑stack web developer</p>
      <p>I design and build performant, accessible web systems with clean UX. Currently focused on modern web apps and integrations.</p>

      <div class="kv">
        <a class="btn" href="#/projects">View Projects</a>
        <a class="btn secondary" href="#/contact">Contact</a>
      </div>

      <div class="section">
        <h3>Skills</h3>
        <div class="skills">
          <span class="skill">JavaScript</span>
          <span class="skill">HTML &amp; CSS</span>
          <span class="skill">React</span>
          <span class="skill">Node.js</span>
          <span class="skill">APIs</span>
          <span class="skill">Accessibility</span>
        </div>
      </div>
    </div>
  </section>
  `
}

function renderProjects() {
  const cards = projects.map((p, i) => {
    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('')
    return `
      <article class="project-card" style="--delay:${i * 80}ms">
        <h4 class="project-title">${p.title}</h4>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${tags}</div>
        <div class="card-actions">
          <button class="btn" onclick="alert('Demo not available — this is a demo portfolio.')">Live Demo</button>
          <button class="btn secondary" onclick="alert('Repo not available — this is a demo portfolio.')">Repository</button>
        </div>
      </article>
    `
  }).join('')

  return `
    <section>
      <h2>Projects</h2>
      <div class="projects-grid">${cards}</div>
    </section>
  `
}

function renderContact() {
  return `
    <section>
      <h2>Contact</h2>
      <form id="contact-form" class="contact-form">
        <div class="form-row">
          <input class="input" name="name" placeholder="Your name" required />
          <input class="input" type="email" name="email" placeholder="Email" required />
        </div>
        <div style="margin-top:12px">
          <textarea name="message" placeholder="Message" required></textarea>
        </div>
        <div class="form-actions">
          <button class="btn" type="submit">Send message</button>
          <div id="contact-feedback" aria-live="polite"></div>
        </div>
      </form>
    </section>
  `
}

function router() {
  const hash = location.hash.replace(/^#\/?/, '')
  const route = hash.split('/')[0] || ''
  if (route === '') app.innerHTML = renderHome()
  else if (route === 'projects') app.innerHTML = renderProjects()
  else if (route === 'contact') app.innerHTML = renderContact()
  else app.innerHTML = `<section><h2>Not found</h2><p>Sorry, that page does not exist.</p></section>`

  // Attach contact form handler if present — posts to serverless API on Vercel
  const form = document.getElementById('contact-form')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(form)
      const data = {
        name: fd.get('name'),
        email: fd.get('email'),
        message: fd.get('message')
      }

      const feedback = document.getElementById('contact-feedback')
      if (feedback) feedback.textContent = 'Sending…'

      try {
        const resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        const json = await resp.json().catch(() => ({}))
        if (resp.ok) {
          if (feedback) feedback.textContent = `Thanks, ${escapeHtml(data.name)} — message received.`
          form.reset()
        } else {
          if (feedback) feedback.textContent = 'Error sending message.'
          console.error('Contact API error', resp.status, json)
        }
      } catch (err) {
        if (feedback) feedback.textContent = 'Network error.'
        console.error('Contact submit failed', err)
      }
    })
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

window.addEventListener('hashchange', router)
window.addEventListener('DOMContentLoaded', router)
