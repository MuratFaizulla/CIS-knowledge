import React, { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  
   {
    question: 'ЖАҺАНДЫҚ АЗАМАТТЫҚ дегеніміз не?',
    answer:
      'Ұлттар мен мәдениеттерді құрметтейтін және қоғамдағы мәселелерге жауапкершілікпен қарап, адамзатқа қызмет ететін, өзгеріске бейім, әлемдік бәсекеге қабілетті қауымдастық.',
  },
    {
    question: 'САНДЫҚ АЗАМАТТЫҚ дегеніміз не?',
    answer:
      'Оқушылардың цифрлық қауіпсіздік туралы білімі, онлайн ортадағы этикалық нормалар мен мінез-құлық ережелерін түсінуі, ғаламтордағы ақпаратты сыни тұрғыда талдауы, білімін жетілдіруі және бөлісуі.',
  },
  {
    question: 'ЖОҒАРЫ САПАЛЫ ОҚУ ЖӘНЕ ОҚЫТУ дегеніміз не?',
    answer:
      'Әрбір тұлғаның жан-жақты дамуына бағытталған және олардың алған білімдері мен дағдыларын өмірлік жағдайларда қолдануға мүмкіндік беретін бағдарлама және қолайлы климатпен сипатталатын оқыту үдерісі.',
  },

];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqSection}>
      <h2 className={styles.faqTitle}>Часто задаваемые вопросы</h2>
      <div className={styles.faqContainer}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{item.question}</span>
              <span className={`${styles.faqIcon} ${openIndex === index ? styles.open : ''}`}>
                +
              </span>
            </button>
            {openIndex === index && (
              <div id={`faq-answer-${index}`} className={styles.faqAnswer}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;