import React, { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Что такое CIS?',
    answer:
      'CIS — это образовательная платформа для управления классами, отслеживания оценок и взаимодействия между учителями и учениками. Она помогает оптимизировать учебный процесс и предоставляет удобный доступ к образовательным ресурсам.',
  },
  {
    question: 'Как зарегистрироваться на платформе?',
    answer:
      'Для регистрации перейдите на страницу входа и следуйте инструкциям для создания учетной записи. Вам потребуется указать email и создать пароль. После регистрации вы получите доступ к функциям платформы.',
  },
  {
    question: 'Какие функции доступны на CIS?',
    answer:
      'CIS позволяет управлять классами, отслеживать успеваемость, просматривать и редактировать оценки, а также обновлять данные вашего профиля. Платформа доступна для учителей, учеников и административного персонала.',
  },
  {
    question: 'Как связаться с поддержкой?',
    answer:
      'Вы можете связаться с нами по email: support@cis.edu.kz или по телефону: +7 (123) 456-7890. Мы готовы ответить на все ваши вопросы!',
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