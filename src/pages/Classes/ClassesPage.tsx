import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClassesPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { fetchClasses } from '../../services/apiService';

// Интерфейсы для типизации
interface Class {
  id: string;
  name: string;
}

const ClassesPage: React.FC = () => {
  const { token } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadClasses = async () => {
      if (!token) {
        if (isMounted) {
          setError('Неавторизован');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const controller = new AbortController();

      try {
        const data = await fetchClasses(token, controller.signal);
        if (isMounted) {
          // Sort classes: academic classes (e.g., 10A) first, then non-class groups
          const sortedClasses = [...data].sort((a, b) => {
            const isAcademicA = a.name.match(/^\d{1,2}[A-Я]$/);
            const isAcademicB = b.name.match(/^\d{1,2}[A-Я]$/);

            // Both are academic classes (e.g., 10A, 7B)
            if (isAcademicA && isAcademicB) {
              const gradeA = parseInt(a.name.match(/^\d{1,2}/)![0], 10);
              const gradeB = parseInt(b.name.match(/^\d{1,2}/)![0], 10);
              const letterA = a.name.slice(-1);
              const letterB = b.name.slice(-1);

              // Sort by grade first, then by letter
              if (gradeA !== gradeB) {
                return gradeA - gradeB;
              }
              return letterA.localeCompare(letterB, 'ru-RU');
            }

            // Academic classes come before non-academic
            if (isAcademicA && !isAcademicB) return -1;
            if (!isAcademicA && isAcademicB) return 1;

            // Both are non-academic, sort alphabetically
            return a.name.localeCompare(b.name, 'ru-RU');
          });

          setClasses(sortedClasses);
          console.log('Sorted classes:', sortedClasses); // Debug
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Ошибка при загрузке классов');
          console.error('Fetch classes error:', err.message); // Debug
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadClasses();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.classesPage}>
      <h1 className={styles.title}>Список классов</h1>
      <div className={styles.cardsContainer}>
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <Link
              to={`/classes/${classItem.id}/students`}
              key={classItem.id}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>{classItem.name}</h2>
              </div>
            </Link>
          ))
        ) : (
          <p className={styles.noClasses}>Нет доступных классов</p>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;