import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 16, 2024</p>

          <div className="space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>
                Welcome to Nexus ("we," "our," or "us"). We are committed to protecting your privacy 
                and ensuring the security of your personal information. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our 
                productivity application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p className="mb-3">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address, name, and profile picture when you create an account.</li>
                <li><strong>Usage Data:</strong> Tasks, habits, journal entries, goals, and other productivity data you input into the app.</li>
                <li><strong>Google Calendar Data:</strong> When you connect your Google Calendar, we access your calendar events to sync with the app.</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers for analytics purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our productivity services</li>
                <li>Sync your calendar events between Google Calendar and Nexus</li>
                <li>Personalize your experience and provide AI-powered suggestions</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about updates and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Google Calendar Integration</h2>
              <p className="mb-3">
                When you connect your Google Calendar to Nexus, we request access to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>View calendar events:</strong> To display your Google Calendar events within Nexus</li>
                <li><strong>Create and modify events:</strong> To sync activities from Nexus to your Google Calendar</li>
              </ul>
              <p className="mt-3">
                We only access calendar data necessary for the sync functionality. You can disconnect 
                your Google Calendar at any time from the app settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Storage and Security</h2>
              <p>
                Your data is stored securely using industry-standard encryption. We use Supabase 
                for data storage, which provides enterprise-grade security features including 
                encryption at rest and in transit, and row-level security policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Sharing</h2>
              <p className="mb-3">We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party services that help us operate the app (e.g., hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and download your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Disconnect third-party integrations at any time</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. You can delete your 
                account and all associated data at any time from the Settings page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through 
                the app's support feature or settings page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
