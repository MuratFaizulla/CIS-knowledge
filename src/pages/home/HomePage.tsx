import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProfile } from '../../services/apiService';
import {
  CIS_DASHBOARD_ROUTE,
  CLASSES_PAGE_ROUTE,
  MY_EVALUATIONS_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
} from '../../utils/consts';
import styles from './HomePage.module.css';
import FAQ from '../../components/FAQ/FAQ';
import SchoolMissionVisionValues from '../../components/SchoolMission/SchoolMissionVisionValues';

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

  const displayName = user?.profile?.general?.displayName;

  return (
    <div className={styles.homePage}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Добро пожаловать{displayName ? `, ${displayName}!` : ''}!
          </h1>
          <p className={styles.heroSubtitle}>
            {isAuthenticated
              ? 'Ваш личный центр управления обучением'
              : 'Современная платформа для оценки и развития'}
          </p>
          
        </div>
        <div className={styles.heroImage}>
          {/* <img className={styles.logoLink} src="https://www.eyuboglu.k12.tr/images/EgitimEyuboglu/CISAkreditasyonu/CISLogo.webp" alt="Home Illustration" /> */}
          <div className={styles.illustration} />
        </div>
      </section>

      {/* AUTHENTICATED USER CONTENT */}
      {isAuthenticated ? (
        <>
          <section className={styles.featuresSection}>
            <div className={styles.featuresContainer}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>Chart</div>
                <h3 className={styles.featureTitle}>Мои оценки</h3>
                <p className={styles.featureDescription}>
                  Просматривайте и управляйте своими оценками и результатами.
                </p>
                <button
                  className={styles.featureButton}
                  onClick={() => handleNavigate(MY_EVALUATIONS_PAGE_ROUTE)}
                >
                  Перейти
                </button>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>Users</div>
                <h3 className={styles.featureTitle}>Классы</h3>
                <p className={styles.featureDescription}>
                  Управляйте классами и отслеживайте прогресс учеников.
                </p>
                <button
                  className={styles.featureButton}
                  onClick={() => handleNavigate(CLASSES_PAGE_ROUTE)}
                >
                  Перейти
                </button>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>User</div>
                <h3 className={styles.featureTitle}>Профиль</h3>
                <p className={styles.featureDescription}>
                  Обновите данные и настройте учетную запись.
                </p>
                <button
                  className={styles.featureButton}
                  onClick={() => handleNavigate(PROFILE_PAGE_ROUTE)}
                >
                  Перейти
                </button>
              </div>
            </div>
          </section>

          <button
            className={styles.dashboardButton}
            onClick={() => handleNavigate(CIS_DASHBOARD_ROUTE)}
          >
            Перейти к CIS Dashboard
          </button>
        </>
      ) : (
        /* UNAUTHENTICATED CONTENT */
        <section className={styles.unauthenticatedContainer}>
          <div className={styles.missionHighlight}>
            <h2>Мы помогаем учителям и ученикам расти вместе</h2>
            <p>
              Прозрачная аналитика, современные инструменты оценки и поддержка на каждом шагу.
            </p>
            <button
              className={styles.ctaButton}
              onClick={() => handleNavigate('/login')}
            >
              Начать использовать
            </button>
          </div>
          <SchoolMissionVisionValues />
          <FAQ />
        </section>
      )}
    </div>
  );
};

export default HomePage;