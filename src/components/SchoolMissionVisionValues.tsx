import React from 'react';
import styles from './SchoolMissionVisionValues.module.css';

const SchoolMissionVisionValues: React.FC = () => {
  return (
    <div className={styles.missionSection}>
      <h2 className={styles.sectionTitle}>О школе CIS</h2>
      
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Миссия</h3>
        <p className={styles.cardText}>
          <strong>International Education Organisation - CIS</strong> стремится создать инновационную образовательную среду, 
          где ученики развивают глобальное мышление, критическое мышление и лидерские качества для успеха в 21 веке. 
          Мы вдохновляем и обучаем следующее поколение лидеров через высококачественное образование, основанное на международных стандартах.
        </p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Болашаққа көзқарас (Видение)</h3>
        <p className={styles.cardText}>
          Мы готовим учеников к будущему, развивая их способность ставить цели, планировать карьеру и адаптироваться к 
          глобальным вызовам. Наше видение — воспитать лидеров, которые формируют устойчивое и инновационное будущее.
        </p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Құндылықтар (Ценности)</h3>
        <ul className={styles.valuesList}>
          <li className={styles.valueItem}>Честность: Прозрачность и этичность во всех действиях.</li>
          <li className={styles.valueItem}>Сотрудничество: Работа в команде для достижения общих целей.</li>
          <li className={styles.valueItem}>Превосходство: Стремление к академическому и личностному совершенству.</li>
          <li className={styles.valueItem}>Разнообразие: Уважение к культурным и индивидуальным различиям.</li>
          <li className={styles.valueItem}>Ответственность: Забота об обществе и окружающей среде.</li>
        </ul>
      </div>
    </div>
  );
};

export default SchoolMissionVisionValues;