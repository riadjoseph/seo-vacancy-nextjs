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
        We may collect personal information such as your email address, and any other information you provide to us.
      </p>
      <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to provide the service, communicate with you, and comply with legal obligations.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact me on X (ex-Twitter) @riadjosephs.
      </p>
    </div>
  );
};

export default PrivacyPolicy; 