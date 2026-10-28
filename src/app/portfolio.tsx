import ContactForm from "../components/contact-form";

const roles = [
  { place: "Helzberg Entrepreneurship Mentoring Program", type: "Nonprofit · Kansas City", detail: "I built custom GPTs to automate recurring administrative tasks and help match mentors with mentees." },
  { place: "OnTheAvenue Marketing", type: "Marketing · Boston", detail: "I supported the CEO with deals and special projects and checked contract details before they went out." },
  { place: "D’oriente Jewelry", type: "Jewelry · Thailand", detail: "I rewrote client-facing copy in American English for a Thai jewelry firm seeking American and European clients." },
];

export default function Portfolio() {
  return <main>
    <section className="hero">
      <nav className="site-nav shell" aria-label="Primary navigation">
        <a href="/" className="wordmark">Fred Loves AI<span className="wordmark-dot">.</span><span className="wordmark-byline">By Leo Helzberg</span></a>
        <div className="nav-links"><a href="#integration">AI integration</a><a href="#experience">Experience</a><a href="/about">About Leo</a><a href="#contact" className="nav-cta">Get in touch ↗</a></div>
      </nav>
      <div className="hero-grid shell">
        <div className="hero-kicker"><span className="status-dot" /> Leo Helzberg · Boulder, Colorado</div>
        <h1><em>Integrated</em><br />artificial<br />intelligence.<span style={{ display: "block", fontSize: "clamp(1.4rem, 3vw, 2.8rem)", letterSpacing: "-0.035em", lineHeight: 1.2, marginTop: "28px", fontWeight: 500 }}>For extreme efficiency.</span></h1>
        <div className="hero-bottom"><p>I’m Leo Helzberg. I’ve used AI in nonprofit administration, marketing, and client writing. I’m interested in how people move from trying a chatbot to using AI in their daily work.</p><a href="#integration" className="nav-cta">AI integration ↓</a></div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="orbit-core" /></div>
      </div>
    </section>
    <section id="integration" className="focus section">
      <div className="shell"><div className="section-grid focus-heading"><div className="eyebrow light"><span>01</span> AI integration</div><div><h2>Having the tool<br />is only the beginning.</h2><p className="focus-line">Research, email, contracts, and admin are different jobs. Putting them all in one chat leaves people copying, correcting, and pasting the answer back into their work.</p></div></div>
      <div className="integration-grid">
        <article><span className="integration-number">01</span><h3>People need time to learn.</h3><p>Teaching someone to use AI takes time. They need room to try it on their own work and get comfortable with it. Without that, a task can take just as long as before, even with AI.</p></article>
        <article><span className="integration-number">02</span><h3>Give each tool a specific job.</h3><p>A tool for matching mentors needs different information from one helping with client writing. Giving each tool the right instructions, context, and task is the “programming” I specialize in. I’ve done this across many platforms, for personal tasks and business work.</p></article>
        <article><span className="integration-number">03</span><h3>Connect it to the work.</h3><p>I call this integrated artificial intelligence: AI working with the documents and tools a task already depends on. People still check the result and decide what gets sent. Getting comfortable with that takes time, and I’m happy to work through it with them.</p></article>
      </div><p className="integration-closing">I’m interested in helping people do more with these tools, not replacing them. Less time on repetitive work means more time for the things they want to do.</p></div>
    </section>
    <section id="experience" className="experience section">
      <div className="shell section-grid">
        <div className="eyebrow"><span>02</span> Past experience</div>
        <div><div className="experience-intro"><h2>The work<br />I’ve done.</h2></div>
          <div className="role-list">{roles.map(role => <article className="role experience-role" key={role.place}><div><span className="role-type">{role.type}</span><h3>{role.place}</h3></div><div><p>{role.detail}</p></div></article>)}</div>
        </div>
      </div>
    </section>
    <section className="about section" id="about"><div className="shell section-grid"><div className="eyebrow"><span>03</span> About me</div><div className="about-copy"><p className="statement">Economics at CU Boulder.<br /><span className="muted">Curiosity everywhere else.</span></p><div className="about-details"><p>I’m obsessed with AI integration. I keep trying these tools on different tasks to find out where they help and where they get in the way.</p><p>I started using ChatGPT the week it opened. Since then, I’ve tried AI across platforms, in my personal life and at work. Here’s how I got into it and what keeps me coming back. <a className="text-link" href="/about">More about me ↗</a></p></div></div></div></section>
    <section id="contact" className="contact"><div className="shell contact-inner contact-layout"><div><p className="contact-kicker">Get in touch with Leo</p><h2>Let’s<br /><em>talk.</em></h2><p className="contact-copy">Have questions? Let’s get coffee or talk over Zoom. I’m a student who wants to learn and trade ideas. I know these tools; you know things I don’t. Let’s compare notes.</p><a href="https://www.linkedin.com/in/leo-helzberg" target="_blank" rel="noreferrer" className="text-link contact-social">Find me on LinkedIn ↗</a></div><ContactForm /></div></section>
    <footer className="footer"><div className="shell footer-inner"><span>Fred Loves AI.</span><span>Leo Helzberg</span><span>Boulder, Colorado</span></div></footer>
  </main>;
}
