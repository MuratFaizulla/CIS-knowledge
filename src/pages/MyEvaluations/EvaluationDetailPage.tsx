import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './EvaluationDetailPage.module.css';

// Интерфейс для деталей критерия
interface EvaluationDetail {
  criterion_id: number;
  criterion_name_kz: string;
  criterion_name_ru: string;
  score: number;
  max_score: number;
  comment_kz: string | null;
}

// Интерфейс для оценки
interface Evaluation {
  id: number;
  student_id: string;
  student_name_kz: string;
  student_name_ru: string;
  class_year: string;
  evaluator_username: string;
  evaluator_name: string;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  overall_comment_kz: string;
  status: string;
  created_at: string;
  details: EvaluationDetail[];
}

const EvaluationDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const evaluation: Evaluation | undefined = location.state?.evaluation;

  if (!evaluation) {
    return <div className={styles.error}>Оценка не найдена</div>;
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.detailsPage}>
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>Детали оценки</h1>
        <div className={styles.evaluationSection}>
          <h2 className={styles.sectionTitle}>Общая информация</h2>
          <p><strong>Ученик:</strong> {evaluation.student_name_kz}</p>
          <p><strong>Класс:</strong> {evaluation.class_year}</p>
          <p><strong>Оценка:</strong> {evaluation.total_score} / {evaluation.max_possible_score} ({evaluation.percentage}%)</p>
          <p><strong>Дата:</strong> {formatDate(evaluation.created_at)}</p>
          <p><strong>Комментарий:</strong> {evaluation.overall_comment_kz || 'Не указано'}</p>
        </div>
        <div className={styles.evaluationSection}>
          <h2 className={styles.sectionTitle}>Критерии (CIS 7)</h2>
          {evaluation.details.map((detail) => (
            <div key={detail.criterion_id} className={styles.criterion}>
              <h3>{detail.criterion_name_kz}</h3>
              <p><strong>Оценка:</strong> {detail.score} / {detail.max_score}</p>
              <p><strong>Комментарий:</strong> {detail.comment_kz || 'Не указано'}</p>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/my-evaluations')} className={styles.backBtn}>
          Назад
        </button>
      </div>
    </div>
  );
};

export default EvaluationDetailsPage;