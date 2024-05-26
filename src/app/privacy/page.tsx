import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const PrivacyPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-semibold text-lg ">
            Introduction
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            This privacy policy outlines how we handle your data at Commentcast.
            It explains the types of data we collect, how it is used, shared,
            and protected.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="font-semibold text-lg">
            Data Collection
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We collect data to enhance our services and provide you with a
            better user experience. This includes information such as user ID,
            browser type, operating system, and interaction with our services.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="font-semibold text-lg">
            Data Usage
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            The data we collect is used to improve service functionality,
            troubleshoot issues, and provide personalized user experiences.
            Additionally, we use PostHog for analytics, adhering to their
            privacy policy, which can be reviewed{' '}
            <a
              href="https://posthog.com/docs/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              here
            </a>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="font-semibold text-lg">
            Data Sharing
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We do not share your personal data with third parties except as
            necessary to provide our services or when legally required. As we
            use Supabase as our backend, some data handling is governed by their
            privacy policy, which can be reviewed{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              here
            </a>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="font-semibold text-lg">
            Data Protection
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We implement a variety of security measures to maintain the safety
            of your personal information when you enter, submit, or access your
            personal information. We use encryption to protect your data and
            ensure it is not stored insecure. We also use secure server
            environments to protect your data.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="font-semibold text-lg">
            User Rights
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            You have the right to access, correct, or delete your personal data.
            You can also object to the processing of your data in certain
            circumstances.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger className="font-semibold text-lg">
            Contact Information
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            If you have any questions or concerns about our privacy policy or
            data handling practices, you can contact us at
            christopherjcassar@gmail.com.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PrivacyPage;
