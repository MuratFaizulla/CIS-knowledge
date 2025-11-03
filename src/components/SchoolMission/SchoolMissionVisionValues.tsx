import React from 'react';
import styles from './SchoolMissionVisionValues.module.css';

const SchoolMissionVisionValues: React.FC = () => {
  return (
    <div className={styles.missionSection}>
      <h2 className={styles.sectionTitle}>О школе CIS</h2>
      
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Мектебіміздің миссиясы</h3>
        <p className={styles.cardText}>
          {/* <strong></strong>  */}
          Өмірге қажетті білім дағдылары мен ұлттық және жаһандық құндылықтарды меңгерген бәсекеге қабілетті тұлғаны қалыптастыру.
        </p>
        <br/>
        <p className={styles.cardText}>
          Формирование конкурентоспособной личности, владеющей образовательными навыками, национальными и глобальными ценностями, необходимыми для жизни.
        </p>
         <br/>
        <p className={styles.cardText}>
          Fostering a competitive individual equipped with life-long learning that aligns with both national and global values.
        </p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Мектебіміздің болашаққа көзқарасы</h3>
        <p className={styles.cardText}>
          Қоғамның зияткерлік әлеуетін арттыратын жауапкершілігі жоғары, жан-жақты дамыған мектеп қауымдастығын құру.
        </p>
        <br/>
        <p className={styles.cardText}>
          Создание ответственного, всесторонне развитого школьного сообщества, повышающего интеллектуальный потенциал общества.
        </p>
        <br/>
        <p className={styles.cardText}>
          Creating a responsible, well-rounded school community that enriches the intellectual potential of the society.
        </p>
      </div>



 <div className={styles.card}>
  <h3 className={styles.cardTitle}>Мектеп құндылықтары / Ценности школы / School Values</h3>

  <div className={styles.valuesContainer}>
    <div className={styles.column}>
      <h4>🇰🇿 Қазақша</h4>
      <ul>
        <li>Құрмет</li>
        <li>Отансүйгіштік және жауапкершілік</li>
        <li>Жаһандық азаматтық</li>
        <li>Денсаулық және әл-ауқат</li>
        <li>Отбасылық құндылықтар мен дәстүрлер</li>
        <li>Еңбекқорлық және шығармашылық</li>
        <li>Ашықтық</li>
        <li>Адалдық</li>
      </ul>
    </div>

    <div className={styles.column}>
      <h4>🇷🇺 Русский</h4>
      <ul>
        <li>Уважение</li>
        <li>Патриотизм и ответственность</li>
        <li>Глобальное гражданство</li>
        <li>Здоровье и благополучие</li>
        <li>Семейные ценности и традиции</li>
        <li>Трудолюбие и творчество</li>
        <li>Открытость</li>
        <li>Честность</li>
      </ul>
    </div>

    <div className={styles.column}>
      <h4>🇬🇧 English</h4>
      <ul>
        <li>Respect</li>
        <li>Patriotism and Responsibility</li>
        <li>Global citizenship</li>
        <li>Health and well-being</li>
        <li>Family values and traditions</li>
        <li>Hard Work and creativity</li>
        <li>Openness</li>
        <li>Integrity</li>
      </ul>
    </div>
  </div>
</div>

    </div>
  );
};

export default SchoolMissionVisionValues;