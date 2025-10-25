import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchStudents } from '../../services/apiService';
import styles from './ClassStudentsPage.module.css';

// Интерфейс для данных ученика
interface Student {
  id: string;
  name: string;
}

const ClassStudentsPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      if (!token || !classId) {
        if (isMounted) {
          setError(!token ? 'Неавторизован' : 'ID класса не указан');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const controller = new AbortController();

      try {
        const data = await fetchStudents(token, classId, controller.signal);
        if (isMounted) {
          setStudents(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Ошибка при загрузке учеников');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, [token, classId]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.studentsPage}>
      <h1 className={styles.title}>Ученики класса {classId}</h1>
      <div className={styles.cardsContainer}>
        {students.length > 0 ? (
          students.map((student) => (
            <Link
              to={`/classes/${classId}/students/${student.id}/evaluate`}
              key={student.id}
              className={styles.cardLink}
              state={{ studentName: student.name }}
            >
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>{student.name}</h2>
              </div>
            </Link>
          ))
        ) : (
          <p className={styles.noStudents}>Нет учеников в этом классе</p>
        )}
      </div>
    </div>
  );
};

export default ClassStudentsPage;