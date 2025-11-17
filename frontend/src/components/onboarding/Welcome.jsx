import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

const Welcome = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <LanguageSelector />
        <div className="logo">🧠 SwiitchBank</div>
        <h1>{t('welcome.title')}</h1>
        <p>{t('welcome.subtitle')}</p>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>{t('welcome.feature1.title')}</h3>
            <p>{t('welcome.feature1.description')}</p>
          </div>
          <div className="feature-card">
            <div className="icon">🧠</div>
            <h3>{t('welcome.feature2.title')}</h3>
            <p>{t('welcome.feature2.description')}</p>
          </div>
          <div className="feature-card">
            <div className="icon">🚀</div>
            <h3>{t('welcome.feature3.title')}</h3>
            <p>{t('welcome.feature3.description')}</p>
          </div>
        </div>

        <button className="primary-button" onClick={onGetStarted}>
          {t('welcome.button')}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
