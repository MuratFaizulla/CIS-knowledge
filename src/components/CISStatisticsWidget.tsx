// src/components/CISStatisticsWidget.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './CISStatisticsWidget.module.css';
import { useAuth } from '../context/AuthContext';

interface Curator {
  username: string;
  display_name: string;
  classes: string[];
}

interface SummaryStats {
  total_evaluations: number;
  avg_percentage: string;
  high: number;
  medium: number;
  low: number;
}

const API_BASE = 'http://10.35.14.13:8080/api/evaluations/statistics';

const CISStatisticsWidget: React.FC = () => {
  const { token, user } = useAuth() as any;
  const navigate = useNavigate();

  const [curators, setCurators] = useState<Curator[]>([]);
  const [selectedCurator, setSelectedCurator] = useState<string>('');
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEvaluatorOrAdmin = user?.profile?.general?.role === 'evaluator' || user?.profile?.general?.role === 'admin';

  // Загрузка кураторов (только для evaluator/admin)
  useEffect(() => {
    if (!token || !isEvaluatorOrAdmin) return;

    const fetchCurators = async () => {
      try {
        const res = await axios.get(`${API_BASE}/curators`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurators(res.data);
      } catch (err: any) {
        console.error('Ошибка загрузки кураторов:', err);
      }
    };
    fetchCurators();
  }, [token, isEvaluatorOrAdmin]);

  // Загрузка статистики
  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = selectedCurator ? { curator: selectedCurator } : {};
        const res = await axios.get(`${API_BASE}/summary`, {
          params,
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err: any) {
        setError('Не удалось загрузить статистику');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token, selectedCurator]);

  if (!token) return null;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3>Статистика CIS</h3>
        {isEvaluatorOrAdmin && curators.length > 0 && (
          <select
            value={selectedCurator}
            onChange={(e) => setSelectedCurator(e.target.value)}
            className={styles.select}
          >
            <option value="">Все кураторы</option>
            {curators.map(c => (
              <option key={c.username} value={c.username}>
                {c.display_name} ({c.classes.length} кл.)
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : stats ? (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Оценок</span>
            <span className={styles.value}>{stats.total_evaluations}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Средний %</span>
            <span className={styles.value}>{stats.avg_percentage}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>High (80%+)</span>
            <span className={styles.value}>{stats.high}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Medium</span>
            <span className={styles.value}>{stats.medium}</span>
          </div>
        </div>
      ) : null}

      <button
        className={styles.dashboardBtn}
        onClick={() => navigate('/cis-dashboard')}
      >
        Перейти к дашборду
      </button>
    </div>
  );
};

export default CISStatisticsWidget;