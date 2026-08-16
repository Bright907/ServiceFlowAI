import Head from 'next/head'
import Link from 'next/link'
import '/public/style.css'

export default function Home(){
  return (
    <div className="container">
      <Head>
        <title>ServiceFlowAI</title>
      </Head>
      <header>
        <h1>ServiceFlowAI</h1>
        <p>Embeddable quote calculators for home-service contractors (Plumbers, HVAC, Roofers)</p>
      </header>

      <main>
        <section>
          <h2>What it does</h2>
          <ul>
            <li>Contractors sign up, pick a trade, and set 3 pricing variables.</li>
            <li>Grab a small embed script and place it on your website.</li>
            <li>Homeowners get instant estimates and can 'Book Inspection'.</li>
            <li>Leads are captured in your dashboard.</li>
          </ul>
        </section>

        <section className="actions">
          <Link className="button" href="/signup">Get started — Free</Link>
        </section>

        <section>
          <h3>Demo embed</h3>
          <p>After signup you'll receive a snippet like this to place on your site:</p>
          <pre><code>&lt;script src="https://your-domain.com/api/embed.js?tenant=YOUR_TENANT_ID" async&gt;&lt;/script&gt;</code></pre>
        </section>
      </main>

      <footer>
        <small>Prototype — ServiceFlowAI</small>
      </footer>
    </div>
  )
}
