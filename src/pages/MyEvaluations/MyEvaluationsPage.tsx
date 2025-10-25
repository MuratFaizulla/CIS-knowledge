import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './MyEvaluationsPage.module.css';

// Интерфейс для деталей критерия
interface EvaluationDetail {
  criterion_id: number;
  criterion_name_kz: string;
  criterion_name_ru: string;
  score: number;
  max_score: number;
  comment_kz: string | null;
   comment_ru: string | null;
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

// Интерфейс для ответа API
interface EvaluationsResponse {
  count: number;
  evaluations: Evaluation[];
}

const MyEvaluationsPage: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<EvaluationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvaluations = async () => {
      if (!token) {
        if (isMounted) {
          setError('Неавторизован');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://10.35.14.13:8080/api/evaluations/my-evaluations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          console.log('Полученные данные:', response.data);
          setData(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.response?.status === 401
              ? 'Неавторизован или отсутствует токен'
              : err.response?.status === 403
              ? 'Доступ запрещён'
              : err.response?.status === 404
              ? 'Куратор не найден или нет назначенных классов'
              : 'Ошибка сервера'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvaluations();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.evaluationsPage}>
      <h1 className={styles.title}>Мои оценки</h1>
      {data && data.count > 0 ? (
        <div className={styles.evaluationsList}>
          <div className={styles.headerRow}>
            <span>Ученик (KZ)</span>
            <span>Класс</span>
            <span>Оценка (%)</span>
            <span>Оценщик</span> {/* New column */}
            <span>Дата</span>
          </div>
          {data.evaluations.map((evaluation) => (
            <Link
              to={`/evaluations/${evaluation.id}`}
              key={evaluation.id}
              className={styles.evaluationRow}
              state={{ evaluation }}
            >
              <span>{evaluation.student_name_kz}</span>
              <span>{evaluation.class_year}</span>
              <span>{evaluation.percentage}%</span>
              <span>{evaluation.evaluator_name}</span> {/* New column */}
              <span>{new Date(evaluation.created_at).toLocaleDateString('ru-RU')}</span>
            </Link>
          ))}
          {data.count > data.evaluations.length && (
            <p className={styles.info}>
              Показаны {data.evaluations.length} из {data.count} оценок. Возможно, данные подгружаются порциями.
            </p>
          )}
        </div>
      ) : (
        <p className={styles.noEvaluations}>Нет доступных оценок</p>
      )}
    </div>
  );
};

export default MyEvaluationsPage;