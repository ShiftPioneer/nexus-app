import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 16, 2024</p>

          <div className="space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Nexus ("the App"), you agree to be bound by these Terms of 
                Service. If you do not agree to these terms, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>
                Nexus is a productivity and life-management application that provides task management, 
                habit tracking, journaling, goal setting, time management, and calendar integration 
                features. The App includes optional integration with third-party services such as 
                Google Calendar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
              <p className="mb-3">To use certain features of the App, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create an account with accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the App for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any part of the App</li>
                <li>Interfere with or disrupt the App's functionality</li>
                <li>Upload malicious code or content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Integrations</h2>
              <p className="mb-3">
                The App offers integration with third-party services, including Google Calendar. 
                By connecting these services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You authorize us to access and sync data between the App and those services</li>
                <li>You agree to comply with the third party's terms of service</li>
                <li>You understand we are not responsible for third-party service availability or changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
              <p>
                The App and its original content, features, and functionality are owned by Nexus 
                and are protected by international copyright, trademark, and other intellectual 
                property laws. Your data remains yours; we claim no ownership over content you create.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. User Content</h2>
              <p>
                You retain ownership of all content you create within the App (tasks, journal entries, 
                goals, etc.). By using the App, you grant us a limited license to store, process, 
                and display your content solely for the purpose of providing the service to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimer of Warranties</h2>
              <p>
                The App is provided "as is" and "as available" without warranties of any kind, 
                either express or implied. We do not guarantee that the App will be uninterrupted, 
                secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, we shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from your use 
                or inability to use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Termination</h2>
              <p>
                We may terminate or suspend your account at any time for violations of these Terms. 
                You may delete your account at any time through the App settings. Upon termination, 
                your right to use the App will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes. Continued use of the App after changes constitutes acceptance 
                of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact</h2>
              <p>
                For questions about these Terms of Service, please contact us through the App's 
                support feature or settings page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
