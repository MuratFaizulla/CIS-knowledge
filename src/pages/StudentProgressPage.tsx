// src/pages/StudentProgressPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area
} from 'recharts';
import styles from './StudentProgressPage.module.css';

const API_BASE = 'http://10.35.14.13:8080/api/evaluations/statistics';

const StudentProgressPage: React.FC = () => {
  const { student_id } = useParams<{ student_id: string }>();
  const { token } = useAuth() as any;
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !student_id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/students/${student_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err: any) {
        setError('Ученик не найден');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, student_id]);

  // === РАДАР: Критерии — оси, Даты — линии ===
  const radarData = data?.criteria_progress.map((crit: any) => {
    const obj: any = { criteria: crit.name_kz };
    data.evaluations.forEach((evalItem: any) => {
      const key = `${evalItem.date_str} (${evalItem.percentage}%)`;
      const idx = data.criteria_progress.findIndex((c: any) => c.id === crit.id);
      obj[key] = evalItem.criteria[idx];
    });
    return obj;
  }) || [];

  // === КОМБИНИРОВАННЫЙ: % + тренд ===
  const progressData = data?.evaluations.map((e: any) => ({
    date: e.date_str,
    percentage: e.percentage,
  })) || [];

  // === МИНИ-ГРАФИКИ ===
  const miniData = data?.criteria_progress.map((c: any) => ({
    name: c.name_kz,
    data: c.history.map((h: any) => ({ date: h.date, score: h.score }))
  })) || [];

  // === PDF ===
  const printPDF = () => window.print();

  if (!token) {
    navigate('/');
    return null;
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  return (
    <>
      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .chart { page-break-inside: avoid; margin-bottom: 20px; }
        }
      `}</style>

      <div className={`${styles.page} print-area`}>
        {/* HEADER */}
        <div className={styles.header}>
          <button className={`${styles.backBtn} no-print`} onClick={() => navigate(-1)}>
            ← Назад
          </button>
          <div>
            <h1>{data.student.name_kz}</h1>
            <p className={styles.classInfo}>Класс: {data.student.class_year}</p>
          </div>
          <button className={`${styles.pdfBtn} no-print`} onClick={printPDF}>
            PDF
          </button>
        </div>

        {/* EVALUATIONS */}
        <div className={styles.evals}>
          {data.evaluations.map((e: any) => (
            <div
              key={e.id}
              className={`${styles.evalCard} ${
                e.percentage >= 80 ? styles.high :
                e.percentage >= 50 ? styles.medium : styles.low
              }`}
            >
              <div className={styles.evalDate}>{e.date_str}</div>
              <div className={styles.evalPercent}>{e.percentage}%</div>
              <div className={styles.evalBy}>Оценил: {e.evaluator_name}</div>
            </div>
          ))}
        </div>

        {/* MAIN RADAR CHART */}
        <div className={styles.chart}>
          <h3>Прогресс по всем критериям</h3>
          <ResponsiveContainer width="100%" height={380}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 11, fill: '#374151' }} />
              <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fontSize: 10 }} />
              {data.evaluations.map((e: any, i: number) => (
                <Radar
                  key={i}
                  name={`${e.date_str} (${e.percentage}%)`}
                  dataKey={`${e.date_str} (${e.percentage}%)`}
                  stroke={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'][i % 5]}
                  fill={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'][i % 5]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* COMPOSED CHART */}
        <div className={styles.chart}>
          <h3>Общий прогресс (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" barSize={30} fill="#3b82f6" name="Оценка %" />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 5 }}
                name="Тренд"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* MINI CHARTS */}
        <div className={styles.miniGrid}>
          {miniData.map((crit: any, i: number) => (
            <div key={i} className={styles.miniCard}>
              <h4>{crit.name}</h4>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={crit.data}>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'][i % 5]}
                    fill={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'][i % 5]}
                    fillOpacity={0.2}
                  />
                  <Tooltip />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentProgressPage;