// src/pages/CISDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  PolarAngleAxis, PolarRadiusAxis, PolarGrid, RadarChart, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as ReLegend,
  AreaChart, Area,
} from 'recharts';
import styles from './CISDashboardPage.module.css';

const API_BASE = 'http://10.35.14.13:8080/api/evaluations/statistics';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

const CISDashboardPage: React.FC = () => {
  const { token, user } = useAuth() as any;
  const navigate = useNavigate();

  const [curators, setCurators] = useState<any[]>([]);
  const [selectedCurator, setSelectedCurator] = useState<string>('');
  const [summary, setSummary] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const role = user?.profile?.general?.role;
  const isEvaluator = ['evaluator', 'admin'].includes(role);

  // === 1. Кураторы ===
  useEffect(() => {
    if (!token || !isEvaluator) return;
    axios.get(`${API_BASE}/curators`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCurators(res.data))
      .catch(() => alert('Ошибка кураторов'));
  }, [token, isEvaluator]);

  // === 2. Данные ===
  const loadData = async () => {
    setLoading(true);
    try {
      const params = selectedCurator ? { curator: selectedCurator } : {};
      const [sumRes, classRes] = await Promise.all([
        axios.get(`${API_BASE}/summary`, { params, headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/classes`, { params, headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSummary(sumRes.data);
      setClasses(classRes.data);
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token, selectedCurator]);

  // === 3. Ученики ===
  useEffect(() => {
    if (!selectedClass || !token) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    axios.get(`${API_BASE}/classes/${selectedClass}/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, [selectedClass, token]);

  // === ДАННЫЕ ДЛЯ ГРАФИКОВ ===
  const pieData = [
    { name: 'High', value: summary?.high || 0 },
    { name: 'Medium', value: summary?.medium || 0 },
    { name: 'Low', value: summary?.low || 0 },
  ];

  const radarData = (summary?.criteria || []).map((c: any) => ({
    criteria: c.name_kz,
    score: parseFloat(c.avg_score),
    fullMark: 3,
  }));

  const barData = classes.map(c => ({
    class: c.class_year,
    avg: parseFloat(c.avg_percentage),
  }));

  const areaData = (summary?.by_month || []).map((m: any) => ({
    month: m.month,
    avg: parseFloat(m.avg),
  }));

  // === PDF через print() ===
  const exportToPDF = () => {
    window.print();
  };

  if (!token) {
    navigate('/');
    return null;
  }

  return (
    <>
    
      {/* === PRINT СТИЛИ === */}
      <style >{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .chart { page-break-inside: avoid; }
        }
      `}</style>

      <div className={`${styles.page} print-area`}>
        {/* === ЗАГОЛОВОК === */}
        <div className={styles.header}>
          <h1>Дашборд CIS</h1>
          <div className={`${styles.actions} no-print`}>
            {isEvaluator && (
              <select
                value={selectedCurator}
                onChange={(e) => {
                  setSelectedCurator(e.target.value);
                  setSelectedClass(null);
                  setStudents([]);
                }}
                className={styles.select}
              >
                <option value="">Все кураторы</option>
                {curators.map(c => (
                  <option key={c.username} value={c.username}>{c.display_name}</option>
                ))}
              </select>
            )}
            <button onClick={exportToPDF} className={styles.pdfBtn}>
              PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <>
            {/* === КАРТОЧКИ === */}
            <div className={styles.cards}>
              <div className={styles.card}>
                <span>Оценок</span>
                <strong>{summary?.total_evaluations || 0}</strong>
              </div>
              <div className={styles.card}>
                <span>Средний %</span>
                <strong>{summary?.avg_percentage || 0}%</strong>
              </div>
              <div className={styles.card}>
                <span>High</span>
                <strong>{summary?.high || 0}</strong>
              </div>
              <div className={styles.card}>
                <span>Medium</span>
                <strong>{summary?.medium || 0}</strong>
              </div>
            </div>

            {/* === ГРАФИКИ === */}
            <div className={styles.charts}>
              <div className={styles.chart}>
                <h3>Распределение</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                      {pieData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <ReLegend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chart}>
                <h3>Критерии</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="criteria" />
                    <PolarRadiusAxis angle={90} domain={[0, 3]} />
                    <Radar name="Средний балл" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chart}>
                <h3>Классы</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chart}>
                <h3>Динамика</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="avg" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* === КЛАССЫ === */}
            <div className={styles.section}>
             <table className={styles.table}>
  <thead>
    <tr>
      <th>Класс</th>
      <th>Учеников</th>
      <th>Оценок</th>
      <th>Средний %</th>
    </tr>
  </thead>
  <tbody>
    {classes.map(cls => (
      <tr
        key={cls.class_year}
        className={selectedClass === cls.class_year ? styles.selected : styles.row}
        onClick={() => setSelectedClass(cls.class_year)}
      >
        <td data-label="Класс"><strong>{cls.class_year}</strong></td>
        <td data-label="Учеников">{cls.students_count}</td>
        <td data-label="Оценок">{cls.evaluations_count}</td>
        <td data-label="Средний %">{cls.avg_percentage}%</td>
      </tr>
    ))}
  </tbody>
</table>
            </div>

            {/* === УЧЕНИКИ === */}
            {selectedClass && (
              <div className={styles.section}>
                <h3>Ученики класса {selectedClass}</h3>
                {loadingStudents ? (
                  <div className={styles.loading}>Загрузка...</div>
                ) : (
                  <div className={styles.grid}>
                    {students.map(s => (
                      <div
                        key={s.id}
                        className={styles.cardStudent}
                        onClick={() => navigate(`/student-progress/${s.id}`)}
                      >
                        <div className={styles.name}>{s.name_kz}</div>
                        <div className={styles.iin}>{s.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CISDashboardPage;