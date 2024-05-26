import React from 'react';

const PrivacyPage = () => {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <section>
        <h2>Introduction</h2>
        <p>
          This privacy policy outlines how we handle your data at Commentcast.
          It explains the types of data we collect, how it is used, shared, and
          protected.
        </p>
      </section>
      <section>
        <h2>Data Collection</h2>
        <p>
          We collect data to enhance our services and provide you with a better
          user experience. This includes information such as user ID, browser
          type, operating system, and interaction with our services.
        </p>
      </section>
      <section>
        <h2>Data Usage</h2>
        <p>
          The data we collect is used to improve service functionality,
          troubleshoot issues, and provide personalized user experiences.
          Additionally, we use PostHog for analytics, adhering to their privacy
          policy, which can be reviewed{' '}
          <a
            href="https://posthog.com/docs/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Data Sharing</h2>
        <p>
          We do not share your personal data with third parties except as
          necessary to provide our services or when legally required. As we use
          Supabase as our backend, some data handling is governed by their
          privacy policy, which can be reviewed{' '}
          <a
            href="https://supabase.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Data Protection</h2>
        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information when you enter, submit, or access your
          personal information. We use encryption to protect your data and
          ensure it is not stored insecure. We also use secure server
          environments to protect your data.
        </p>
      </section>
      <section>
        <h2>User Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data.
          You can also object to the processing of your data in certain
          circumstances.
        </p>
      </section>
      <section>
        <h2>Contact Information</h2>
        <p>
          If you have any questions or concerns about our privacy policy or data
          handling practices, you can contact us at
          christopherjcassar@gmail.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
