import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.put('/api/settings/password', {
        oldPassword,
        newPassword,
      });
      setSuccess(t('settings.password_changed_successfully'));
    } catch (error) {
      setError(t('settings.error_changing_password'));
    }
  };

  return (
    <div>
      <h1>{t('settings.title')}</h1>
      <div>
        <h2>{t('settings.language_title')}</h2>
        <LanguageSelector />
      </div>
      <form onSubmit={handleChangePassword}>
        <h2>{t('settings.change_password_title')}</h2>
        <div>
          <label>{t('settings.old_password_label')}</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <label>{t('settings.new_password_label')}</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit">{t('settings.change_password_button')}</button>
      </form>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
        <Link to="/terms-and-conditions">{t('settings.terms_and_conditions')}</Link>
        <Link to="/terms-of-use">{t('settings.terms_of_use')}</Link>
        <Link to="/privacy-policy">{t('settings.privacy_policy')}</Link>
      </div>
    </div>
  );
};

export default SettingsPage;
