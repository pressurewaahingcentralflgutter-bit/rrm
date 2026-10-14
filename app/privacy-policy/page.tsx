import { PrivacyPolicy } from '@/pageComponents/PrivacyPolicy';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for R.R.M Exterior Cleaning Specialist',
  alternates: { canonical: 'https://rrmexternalcleaningspecialist.co.uk/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
