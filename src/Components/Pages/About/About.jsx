import React from 'react';
import Overview from './Overview';
import Mission from './Mission';
import Stats from './Stats';
import ImageBreadcrumb from '../ImageBreadcrumb';

function About() {
  return (
    <div>
      <ImageBreadcrumb
        title="Who We Are"
        subtitle="Built on the trusted legacy of SOS Infrabulls — transforming Indore's real estate landscape."
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Who We Are' }]}
      />
      <Overview />
      <Mission />
      <Stats />
    </div>
  );
}

export default About;