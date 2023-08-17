import React from 'react';
import Feature from '../../src/components/Feature';
import Grid from '../../src/components/Grid';

const FeatureList = [
  {
    title: 'Responsive Quickstart',
    image: require('../../static/img/quickstart.png').default,
    description: (
      <>
        Migrate to Responsive in a matter of minutes
      </>
    ),
    url: '/getting-started/quickstart',
    learnText: true,
  },
  {
    title: 'Concepts',
    image: require('../../static/img/concepts.png').default,
    description: (
      <>
        Learn about the Responsive Platform architecture
      </>
    ),
    url: '/concepts/architecture',
    learnText: true,
  },
  {
    title: 'API Reference',
    image: require('../../static/img/reference.png').default,
    description: (
      <>
        Discover all available features
      </>
    ),
    url: '/category/api-reference',
    learnText: true,
  }
]

export default function HomepageFeatures() {
  return (
    <section>
      <Grid gap="2rem" minWidth="300px">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </Grid>
    </section>
  );
}

