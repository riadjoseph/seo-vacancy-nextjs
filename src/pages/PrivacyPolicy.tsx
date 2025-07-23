import React from "react";
import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <div className="container py-8">
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <p className="mb-4">
        We collect personal information such as your email address, and any other information you provide to us, when you post a job opening.
      </p>
      <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to provide the service, communicate with you, and comply with legal obligations.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your information from unauthorized access, use, or disclosure. We use Google Analytics and PostHog to analyze website traffic and improve our services. These tools collect anonymized information such as your IP address (anonymized), browser type, and pages visited without storing cookies or personally identifiable information on your device. The tracking is privacy-focused and does not require consent. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on. The tracking does not collect any personally identifiable information unless you provide it to us directly, such as when you post a job opening or contact us via email.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will publish the changes by posting the new Privacy Policy on this page.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or anything else for that matter, please contact me on X (ex-Twitter) @riadjosephs.
      </p>
    </div>
  );
};

export default PrivacyPolicy; 