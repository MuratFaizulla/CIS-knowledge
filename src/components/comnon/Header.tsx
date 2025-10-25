import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProfile } from '../../services/apiService';
import lOGO_ZHAPIRAK from '../../assets/lOGO_ZHAPIRAK.png';
import styles from './Header.module.css';
import { ABOUT_PAGE_ROUTE, CLASSES_PAGE_ROUTE, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, MY_EVALUATIONS_PAGE_ROUTE, PROFILE_PAGE_ROUTE } from '../../utils/consts';

// Interfaces for typing
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
  logout: () => void;
  token: string | null;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const DropdownMenu: React.FC<{ onClose: () => void; onLogout: () => void }> = ({ onClose, onLogout }) => (
  <div className={styles.dropdown}>
    <Link to={PROFILE_PAGE_ROUTE} className={styles.dropdownItem} onClick={onClose}>
      Профиль
    </Link>
    <Link to={CLASSES_PAGE_ROUTE} className={styles.dropdownItem} onClick={onClose}>
      Классы
    </Link>
    <Link to={MY_EVALUATIONS_PAGE_ROUTE} className={styles.dropdownItem} onClick={onClose}>
      Мои оценки
    </Link>
    <Link to={HOME_PAGE_ROUTE} className={styles.dropdownItem} onClick={onClose}>
      Главная
    </Link>
    <Link to={ABOUT_PAGE_ROUTE} className={styles.dropdownItem} onClick={onClose}>
      О нас
    </Link>
    <button onClick={onLogout} className={styles.dropdownItem}>
      Выйти
    </button>
  </div>
);

const Header: React.FC = () => {
  const { isAuthenticated, logout, token, user, setUser } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (isAuthenticated && token && !user?.profile) {
        try {
          const profile = await fetchProfile(token);
          if (profile) {
            setUser(user ? { ...user, profile } : { profile });
          }
          console.log('Profile loaded:', profile);
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      }
    };
    loadProfileData();
  }, [isAuthenticated, token, setUser]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink} title="CIS Home">
            <img src={lOGO_ZHAPIRAK} alt="CIS Logo" />
          </Link>
        </div>
        <nav className={styles.navDesktop}>
          <Link to={HOME_PAGE_ROUTE} className={styles.navLink}>Home</Link>
          <Link to={ABOUT_PAGE_ROUTE} className={styles.navLink}>About</Link>
        </nav>
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <>
              <div className={styles.profileContainer}>
                <button
                  onClick={toggleDropdown}
                  className={styles.profileButton}
                  aria-label="Toggle user menu"
                  aria-expanded={isDropdownOpen}
                >
                  {user?.profile?.general?.avatar ? (
                    <img src={user.profile.general.avatar} alt="User profile" className={styles.avatar} />
                  ) : (
                    <svg
                      className={styles.avatarIcon}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                  <span className={styles.userName}>{user?.profile?.general?.displayName || 'User'}</span>
                </button>
                {isDropdownOpen && <DropdownMenu onClose={() => setIsDropdownOpen(false)} onLogout={handleLogout} />}
              </div>
              <div className={styles.mobileAvatarButton}>
                <button
                  onClick={toggleDropdown}
                  className={styles.mobileProfileButton}
                  aria-label="Toggle user menu"
                  aria-expanded={isDropdownOpen}
                >
                  {user?.profile?.general?.avatar ? (
                    <img src={user.profile.general.avatar} alt="User profile" className={styles.mobileAvatar} />
                  ) : (
                    <svg
                      className={styles.avatarIcon}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </button>
                {isDropdownOpen && <DropdownMenu onClose={() => setIsDropdownOpen(false)} onLogout={handleLogout} />}
              </div>
            </>
          ) : (
            <Link to={LOGIN_PAGE_ROUTE} className={styles.loginBtn}>
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;