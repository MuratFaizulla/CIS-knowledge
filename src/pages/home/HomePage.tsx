import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProfile } from '../../services/apiService';
import { CLASSES_PAGE_ROUTE, LOGIN_PAGE_ROUTE, MY_EVALUATIONS_PAGE_ROUTE, PROFILE_PAGE_ROUTE } from '../../utils/consts';
import styles from './HomePage.module.css';
import FAQ from '../../components/FAQ';
import MissionAndCriteria from '../../components/MissionAndCriteria';
import SchoolMissionVisionValues from '../../components/SchoolMissionVisionValues';

// Interface to match fetchProfile response
interface GeneralProfile {
  username: string;
  displayName: string;
  role: string;
  avatar?: string;
}

interface ContactProfile {
  email: string;
  mobile: string;
}

interface OrganizationProfile {
  title: string;
  department: string;
}

interface MetaProfile {
  userPrincipalName: string;
  classes?: string[];
}

interface Profile {
  general: GeneralProfile;
  contact: ContactProfile;
  organization: OrganizationProfile;
  meta: MetaProfile;
}

interface AuthUser {
  profile?: Profile;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

// Component for About CIS section (unauthenticated users)


const HomePage: React.FC = () => {
  const { isAuthenticated, token, user, setUser } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (isAuthenticated && token && !user?.profile) {
        try {
          const data = await fetchProfile(token);
          console.log('Profile loaded:', JSON.stringify(data, null, 2)); // Debug
          // Map flat response to nested Profile interface
          const profile: Profile = {
            general: {
              username: data.username || 'Не указано',
              displayName: data.displayName || 'Не указано',
              role: data.role || 'unknown',
              avatar: data.avatar || undefined,
            },
            contact: {
              email: data.email || 'Не указано',
              mobile: data.mobile || 'Не указано',
            },
            organization: {
              title: data.title || 'Не указано',
              department: data.department || 'Не указано',
            },
            meta: {
              userPrincipalName: data.username || 'Не указано',
              classes: data.classes || [],
            },
          };
          setUser(user ? { ...user, profile } : { profile });
        } catch (err: any) {
          console.error('Failed to load profile:', err);
          setError('Ошибка при загрузке профиля');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [isAuthenticated, token, user, setUser]);

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.homePage}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Добро пожаловать{isAuthenticated && user?.profile?.general?.displayName ? `, ${user.profile.general.displayName}` : ''}!
        </h1>
        <p className={styles.heroSubtitle}>
          {isAuthenticated
            ? `Управляйте своими ${user?.profile?.general?.role === 'curator' ? 'классами и оценками' : 'оценками'} с CIS`
            : 'Войдите, чтобы начать работу с CIS'}
        </p>
        {!isAuthenticated && (
          <button
            className={styles.heroButton}
            onClick={() => handleNavigate(LOGIN_PAGE_ROUTE)}
          >
            Войти
          </button>
        )}
      </div>
      {isAuthenticated ? (
        <div className={styles.featuresContainer}>
          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Мои оценки</h2>
            <p className={styles.featureDescription}>
              Просматривайте и управляйте своими оценками и результатами.
            </p>
            <button
              className={styles.featureButton}
              onClick={() => handleNavigate(MY_EVALUATIONS_PAGE_ROUTE)}
            >
              Перейти к оценкам
            </button>
          </div>
          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Классы</h2>
            <p className={styles.featureDescription}>
              Управляйте своими классами и отслеживайте прогресс учеников.
            </p>
            <button
              className={styles.featureButton}
              onClick={() => handleNavigate(CLASSES_PAGE_ROUTE)}
            >
              Перейти к классам
            </button>
          </div>
          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Профиль</h2>
            <p className={styles.featureDescription}>
              Обновите свои данные и настройте учетную запись.
            </p>
            <button
              className={styles.featureButton}
              onClick={() => handleNavigate(PROFILE_PAGE_ROUTE)}
            >
              Перейти к профилю
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.unauthenticatedContainer}>
          <SchoolMissionVisionValues />
          <MissionAndCriteria />
          <FAQ />
    
        </div>
      )}
    </div>
  );
};

export default HomePage;