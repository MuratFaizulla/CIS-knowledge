import React from 'react';
import styles from './MissionAndCriteria.module.css';

const MissionAndCriteria: React.FC = () => {
  return (
    <div className={styles.missionSection}>
      <h2 className={styles.sectionTitle}>Миссия CIS</h2>
      <div className={styles.missionCard}>
        <p className={styles.missionText}>
          <strong>International Education Organisation - CIS</strong> — это международная образовательная организация, 
          посвященная созданию инновационной среды для обучения, где ученики развивают глобальное мышление, 
          критическое решение проблем и лидерские качества для успеха в 21 веке.
        </p>
        <p className={styles.missionText}>
          Мы стремимся вдохновлять и обучать следующее поколение лидеров через высококачественное образование, 
          основанное на принципах международных лучших практик, культурного разнообразия и устойчивого развития.
        </p>
      </div>

      <h2 className={styles.sectionTitle}>Критерии оценки (CIS 7)</h2>
      <div className={styles.criteriaContainer}>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>1. Мектеп миссиясы</h3>
          <p className={styles.criterionDescription}>
            Понимание и воплощение миссии школы в повседневной учебной деятельности.
          </p>
        </div>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>2. Құндылықтар</h3>
          <p className={styles.criterionDescription}>
            Демонстрация ценностей школы через поведение и взаимодействие с другими.
          </p>
        </div>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>3. Болашаққа көзқарас</h3>
          <p className={styles.criterionDescription}>
            Развитие видения будущего через постановку целей и планирование карьеры.
          </p>
        </div>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>4. Жаһандық азаматтық</h3>
          <p className={styles.criterionDescription}>
            Понимание глобального гражданства и вклад в устойчивое развитие мира.
          </p>
        </div>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>5. Сандық азаматтық</h3>
          <p className={styles.criterionDescription}>
            Ответственное использование цифровых технологий и защита данных.
          </p>
        </div>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>6. Жоғары сапалы оқу</h3>
          <p className={styles.criterionDescription}>
            Стремление к высококачественному обучению и академическому превосходству.
          </p>
        </div>
        <div className={styles.criterionCard}>
          <h3 className={styles.criterionTitle}>7. Әл-ауқат</h3>
          <p className={styles.criterionDescription}>
            Забота о личном благополучии и поддержка психического здоровья.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionAndCriteria;