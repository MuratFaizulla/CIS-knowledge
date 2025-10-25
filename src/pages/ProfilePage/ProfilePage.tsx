import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchProfile } from '../../services/apiService';
import styles from './ProfilePage.module.css';

// Interfaces updated to match JSON structure (unchanged from previous)
interface GeneralProfile {
  displayName: string;
  role: string;
  description?: string;
  avatar?: string;
}

interface ContactProfile {
  email: string;
  mobile: string;
}

interface OrganizationProfile {
  title: string;
  department: string;
  company?: string;
}

interface MetaProfile {
  userPrincipalName: string;
  whenCreated?: string;
  whenChanged?: string;
  memberOf?: string[];
}

interface Profile {
  general?: GeneralProfile;
  contact?: ContactProfile;
  organization?: OrganizationProfile;
  meta?: MetaProfile;
  rawData?: {
    dn: string;
    cn: string;
    sn: string;
    givenName: string;
    displayName: string;
    description: string;
    mail: string;
    userPrincipalName: string;
    sAmAccountName: string;
    title: string;
    department: string;
    company: string;
    mobile: string;
    whenCreated: string;
    whenChanged: string;
    memberOf: string[];
    ipPhone: string;
  };
}

const ProfilePage: React.FC = () => {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!token) {
        if (isMounted) {
          setError('Неавторизован');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const controller = new AbortController();

      try {
        const data = await fetchProfile(token, controller.signal);
        if (isMounted && data) {
          setProfile(data);
        } else if (isMounted) {
          setError('Данные профиля не получены');
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Ошибка при загрузке профиля';
        if (isMounted) {
          setError(errorMessage);
          if (errorMessage === 'Неавторизован') {
            logout();
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  // Helper function to format date strings
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Не указано';
    try {
      const date = new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.\dZ/, '$1-$2-$3T$4:$5:$6Z'));
      return date.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return dateStr;
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Мой профиль</h1>
        {profile && (
          <>
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Общая информация</h2>
              <p><strong>Имя:</strong> {profile.general?.displayName || 'Не указано'}</p>
              <p><strong>Роль:</strong> {profile.general?.role || 'Не указано'}</p>
              <p><strong>Описание:</strong> {profile.general?.description || 'Не указано'}</p>
              {profile.general?.avatar && (
                <img
                  src={profile.general.avatar}
                  alt={profile.general.displayName || 'User Avatar'}
                  className={styles.avatar}
                  onError={(e) => {
                    console.error('Failed to load avatar:', e);
                    (e.target as HTMLImageElement).src = '/default-avatar.png'; // Fallback image
                  }}
                />
              )}
            </div>
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Контакты</h2>
              <p><strong>Email:</strong> {profile.contact?.email || 'Не указано'}</p>
              <p><strong>Телефон:</strong> {profile.contact?.mobile || 'Не указано'}</p>
            </div>
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Организация</h2>
              <p><strong>Должность:</strong> {profile.organization?.title || 'Не указано'}</p>
              <p><strong>Отдел:</strong> {profile.organization?.department || 'Не указано'}</p>
              <p><strong>Компания:</strong> {profile.organization?.company || 'Не указано'}</p>
            </div>
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Дополнительно</h2>
              <p><strong>Создано:</strong> {formatDate(profile.meta?.whenCreated)}</p>
              <p><strong>Изменено:</strong> {formatDate(profile.meta?.whenChanged)}</p>
            </div>
            <button onClick={logout} className={styles.logoutBtn}>
              Выйти
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;