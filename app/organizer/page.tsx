import type { Metadata } from 'next';

import SectionOrganizerPage from '../../src/components/SectionOrganizerPage';

export const metadata: Metadata = {
  title: 'Magic Organizer',
  description: 'Browse SEU course sections by day and time, detect schedule conflicts, and build your Southeast University weekly class routine.',
  alternates: {
    canonical: '/organizer',
  },
};

export default function Organizer() {
  return <SectionOrganizerPage />;
}
