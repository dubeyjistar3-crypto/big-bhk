import { Award, BriefcaseBusiness, Gem, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import Seo from '../components/Seo';
import { defaultPages } from '../data/defaultPages';
import { getLocalPage } from '../services/localStore';

const icons = { Award, BriefcaseBusiness, Gem, Users };

function About() {
  const [page, setPage] = useState(defaultPages.about);

  useEffect(() => {
    api.get('/pages/about')
      .then((res) => setPage(res.data.page))
      .catch(() => setPage(getLocalPage('about')));
  }, []);

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} />
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.heroTitle}</h1>
          <p>{page.heroText}</p>
        </div>
        <div className="about-hero-panel">
          {(page.features || []).slice(0, 3).map((feature, index) => (
            <div key={`${feature.title}-summary`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{feature.title}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-copy">
          <span className="eyebrow">{page.sectionEyebrow}</span>
          <h2>{page.sectionTitle}</h2>
          <p>{page.sectionText}</p>
        </div>
        <div className="about-story-media" aria-hidden="true">
          <span>BIG BHK</span>
        </div>
      </section>

      <section className="about-feature-section">
        {(page.features || []).map((feature, index) => {
          const Icon = icons[feature.icon] || Gem;
          return (
            <div className="about-feature-card" key={`${feature.title}-${feature.icon}`}>
              <span className="about-feature-number">{String(index + 1).padStart(2, '0')}</span>
              <Icon />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default About;
