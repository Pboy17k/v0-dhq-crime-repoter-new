export default function AboutPage() {
  return (
    <div className="container py-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">About Us</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            The Defence Headquarters (DHQ) Crime Reporting System is an initiative by the Nigerian Defence Headquarters
            to enhance public safety and security through community participation.
          </p>
          <h2>Our Mission</h2>
          <p>
            To create a safer Nigeria by empowering citizens to report criminal activities anonymously and efficiently,
            enabling prompt response from security agencies.
          </p>
          <h2>Why Report Crimes?</h2>
          <ul>
            <li>Help maintain peace and security in your community</li>
            <li>Assist security agencies in identifying crime patterns</li>
            <li>Contribute to crime prevention and reduction</li>
            <li>Support the prosecution of offenders</li>
          </ul>
          <h2>Your Privacy Matters</h2>
          <p>
            We understand the importance of protecting your identity. Our system is designed to ensure anonymity for
            those who wish to remain anonymous. Your personal information will never be shared without your consent.
          </p>
          <h2>Contact Information</h2>
          <p>
            Defence Headquarters
            <br />
            Abuja, Nigeria
            <br />
            Emergency Hotline: 112
            <br />
            Email: info@dhq-crimereport.gov.ng
          </p>
        </div>
      </div>
    </div>
  )
}
