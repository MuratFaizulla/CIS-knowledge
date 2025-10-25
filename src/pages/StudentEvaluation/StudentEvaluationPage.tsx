import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createEvaluation } from '../../services/apiService';
import styles from './StudentEvaluationPage.module.css';

// Interfaces remain unchanged
interface Criterion {
  id: number;
  name_kz: string;
  name_ru: string;
  mission_component: string;
  description_kz: string;
  description_ru: string;
  max_score: number;
  category: string;
}

interface EvaluationCriterion {
  criterion_id: number;
  criterion_name_kz: string;
  score: number;
  comment_kz: string;
}

interface EvaluationRequest {
  student_id: string;
  student_name_kz: string;
  student_name_ru: string;
  class_year: string;
  overall_comment_kz: string;
  criteria: EvaluationCriterion[];
}

const StudentEvaluationPage: React.FC = () => {
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = location.state?.studentName || 'Неизвестный ученик';
  const [, setCriteria] = useState<Criterion[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationRequest>({
    student_id: studentId || '',
    student_name_kz: studentName,
    student_name_ru: studentName,
    class_year: classId || '',
    overall_comment_kz: '',
    criteria: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); // New state for pop-up visibility

  useEffect(() => {
    let isMounted = true;

    const loadCriteria = async () => {
      if (!token) {
        if (isMounted) {
          setError('Неавторизован');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('http://10.35.14.13:8080/api/evaluations/criteria', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (isMounted) {
          setCriteria(data.criteria);
          const initialCriteria = data.criteria.map((criterion: Criterion) => ({
            criterion_id: criterion.id,
            criterion_name_kz: criterion.name_kz,
            score: 1,
            comment_kz: '',
          }));
          setEvaluation((prev) => ({ ...prev, criteria: initialCriteria }));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.error || 'Ошибка при загрузке критериев');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCriteria();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleScoreChange = (index: number, score: number) => {
    setEvaluation((prev) => {
      const newCriteria = [...prev.criteria];
      newCriteria[index] = { ...newCriteria[index], score };
      return { ...prev, criteria: newCriteria };
    });
  };

  const handleCommentChange = (index: number, value: string) => {
    setEvaluation((prev) => {
      const newCriteria = [...prev.criteria];
      newCriteria[index] = { ...newCriteria[index], comment_kz: value };
      return { ...prev, criteria: newCriteria };
    });
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentScore = evaluation.criteria[index].score;
    let newScore = currentScore;

    if (event.key === 'ArrowLeft') {
      newScore = Math.max(1, currentScore - 1);
    } else if (event.key === 'ArrowRight') {
      newScore = Math.min(3, currentScore + 1);
    }

    if (newScore !== currentScore) {
      handleScoreChange(index, newScore);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setShowSuccess(false); // Reset pop-up visibility

    if (!evaluation.student_id || !evaluation.student_name_kz || !evaluation.class_year || evaluation.criteria.length !== 7) {
      setError('Недостаточно данных. Требуется ТОЧНО 7 критериев CIS!');
      setLoading(false);
      return;
    }

    try {
      const response = await createEvaluation(evaluation, token || '');
      setMessage(response.message);
      setShowSuccess(true); // Show pop-up
      setTimeout(() => {
        setShowSuccess(false); // Hide pop-up before redirect
        navigate(`/classes/${classId}/students`);
      }, 3000); // Increased to 3s to allow animation to complete
    } catch (err: any) {
      setError(err.message || 'Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.evaluationPage}>
      <h1 className={styles.title}>Оценка ученика: 
        {studentName} (ID: {studentId})</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {evaluation.criteria.map((criterion, index) => (
          <div key={criterion.criterion_id} className={styles.criterionGroup}>
            <h3>{criterion.criterion_name_kz}</h3>
            <div
              className={styles.progressContainer}
              onClick={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percentage = clickX / width;
                const newScore = Math.ceil(percentage * 3);
                handleScoreChange(index, newScore);
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              role="radiogroup"
              aria-label={`Оценка для ${criterion.criterion_name_kz}`}
              tabIndex={0}
            >
              <div
                className={styles.progressFill}
                style={{
                  width: `${(criterion.score / 3) * 100}%`,
                  background:
                    criterion.score === 1
                      ? '#ff3b30' // Красный
                      : criterion.score === 2
                      ? '#ffcc00ff' // Жёлтый
                      : '#34c759', // Зелёный
                }}
              ></div>
            </div>
            <div className={styles.inputGroup}>
              <label>Комментарий на критерии</label>
              <textarea
                className={styles.textarea}
                value={criterion.comment_kz}
                onChange={(e) => handleCommentChange(index, e.target.value)}
                placeholder="Введите комментарий..."
              />
            </div>
          </div>
        ))}
        <div className={styles.formGroup}>
          <label>Общий комментарий</label>
          <textarea
            className={styles.textarea}
            value={evaluation.overall_comment_kz}
            onChange={(e) => setEvaluation({ ...evaluation, overall_comment_kz: e.target.value })}
            placeholder="Введите общий комментарий..."
          />
        </div>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Сохранение...' : 'Сохранить оценку'}
        </button>
        {message && showSuccess && (
          <div className={styles.successPopup}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentEvaluationPage;