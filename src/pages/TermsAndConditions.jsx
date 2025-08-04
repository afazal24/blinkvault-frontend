import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Terms & Conditions
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          By accessing and using The BlinkVault, you accept and agree to be bound by these terms. If you do not agree, please do not use this platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          2. User Responsibilities
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>Respect others and do not post harmful, hateful, or explicit content.</li>
          <li>Do not harass, bully, or threaten other users.</li>
          <li>Use your real mobile number during signup.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          3. Privacy Policy
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Your data is safe with us. We only collect necessary information like mobile number, username, and profile picture to provide our service.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          We do not sell or share your personal data with third parties without your consent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          4. Content Ownership
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          You retain full ownership of the content you post. However, by posting on The BlinkVault, you grant us permission to display and distribute your content within the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          5. Moderation Policy
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We reserve the right to remove any content or ban users who violate our community guidelines without prior notice.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          6. No Hate Speech / Violence
        </h2>
        <p className="text-red-600 dark:text-red-400 font-medium">
          Any content promoting hate speech, racism, religious violence, political abuse, caste-based discrimination, or sexual content is strictly banned and will be removed immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          7. Changes to Terms
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We may update these terms from time to time. Please check back regularly to stay informed.
        </p>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10 text-center">
        Last updated: May 2025 · The BlinkVault Team
      </p>
    </div>
  );
};

export default TermsAndConditions;
