import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  noIndex?: boolean;
  canonical?: string;
}

const defaultSEO = {
  title: 'HealthCare+ | Comprehensive Digital Healthcare Platform',
  description: 'Access quality healthcare with HealthCare+ - teleconsultations, verified doctors, digital prescriptions, health records management, and more. Your health, digitally simplified.',
  keywords: [
    'healthcare',
    'teleconsultation',
    'online doctor',
    'digital health',
    'medical consultation',
    'health records',
    'online pharmacy',
    'health insurance',
    'telemedicine',
    'India healthcare'
  ],
  image: '/og-image.jpg',
  type: 'website' as const,
  author: 'HealthCare+ Team'
};

export const SEOHead: React.FC<SEOProps> = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
  author = defaultSEO.author,
  publishedDate,
  modifiedDate,
  noIndex = false,
  canonical
}) => {
  React.useEffect(() => {
    // Set document title
    document.title = title;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Set meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords.join(', '));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords.join(', ');
      document.head.appendChild(meta);
    }
    
    // Set Open Graph tags
    const currentUrl = url || window.location.href;
    const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;
    
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'HealthCare+' }
    ];
    
    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
    
    // Set Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl }
    ];
    
    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
    
    // Set canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', canonical);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canonical);
        document.head.appendChild(link);
      }
    }
    
    // Set robots meta
    const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      robotsMeta.setAttribute('content', robotsContent);
    } else {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      robotsMeta.setAttribute('content', robotsContent);
      document.head.appendChild(robotsMeta);
    }
  }, [title, description, keywords, image, url, type, author, noIndex, canonical]);

  return null; // This component only modifies document head
};

// Pre-configured SEO components for common pages
export const HomeSEO = () => (
  <SEOHead
    title="HealthCare+ | India's Leading Digital Healthcare Platform"
    description="Book teleconsultations with verified doctors, manage health records digitally, order medicines online, and access comprehensive healthcare services across India."
    keywords={[
      'online doctor consultation India',
      'telemedicine India',
      'digital health records',
      'online pharmacy India',
      'healthcare app',
      'medical consultation online',
      'health insurance India',
      'verified doctors',
      'prescription management',
      'health monitoring'
    ]}
  />
);