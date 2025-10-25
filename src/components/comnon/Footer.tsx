import React from 'react';

import styles from './Footer.module.css';

import lOGO_ZHAPIRAK from '../../assets/lOGO_ZHAPIRAK.png';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <h3 className={styles.sectionTitle}>О платформе</h3>
        <div className={styles.branding}>
          <img src={lOGO_ZHAPIRAK} alt="CIS Logo" className={styles.logo} />
          <p className={styles.brandingText}>
            CIS — образовательная платформа для управления классами и оценками.
          </p>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} CIS. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;