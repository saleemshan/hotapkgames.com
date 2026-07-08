import React from 'react';

export function BlogSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  faqs = [],
  isHowTo = false,
  installSteps = [],
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  faqs?: Array<{ question: string; answer: string }>;
  isHowTo?: boolean;
  installSteps?: Array<{ title: string; description: string }>;
}) {
  const schemas: any[] = [];

  // 1. Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HotAPK Games',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hotapkgames.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  });

  // 2. BreadcrumbList Schema
  const paths = url.replace('https://hotapkgames.com', '').split('/').filter(Boolean);
  let breadcrumbUrl = 'https://hotapkgames.com';
  const itemListElement = [{
    '@type': 'ListItem',
    position: 1,
    name: 'Home',
    item: breadcrumbUrl,
  }];

  paths.forEach((p, index) => {
    breadcrumbUrl += `/${p}`;
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' '),
      item: breadcrumbUrl,
    });
  });

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });

  // 3. FAQPage Schema
  if (faqs && faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // 4. HowTo Schema
  if (isHowTo && installSteps && installSteps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Download and Install ${title}`,
      description: description,
      step: installSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
