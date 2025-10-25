import axios from 'axios';

const API_BASE_URL = 'http://10.35.14.13:8080';

// Интерфейс для данных класса
interface Class {
  id: string;
  name: string;
}

// Интерфейс для данных ученика
interface Student {
  id: string;
  name: string;
}

// Интерфейс для ответа API с классами
interface ClassesResponse {
  classes: Class[];
}

// Интерфейс для ответа API с учениками
interface StudentsResponse {
  students: Student[];
}

// Интерфейс для критерия оценки
interface EvaluationCriterion {
  criterion_id: number;
  criterion_name_kz: string;
  score: number;
  comment_kz: string;
}

// Интерфейс для запроса создания оценки
interface EvaluationRequest {
  student_id: string;
  student_name_kz: string;
  student_name_ru: string;
  class_year: string;
  overall_comment_kz: string;
  criteria: EvaluationCriterion[];
}

// Интерфейс для ответа при создании оценки
interface EvaluationResponse {
  message: string;
  evaluation_id: number;
  total_score: number;
  percentage: number;
}

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const getUserData = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export const fetchProfile = async (token: string, signal?: AbortSignal) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    return response.data.profile;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Запрос отменен');
    }
    if (err.response?.status === 401) {
      throw new Error('Неавторизован');
    }
    throw new Error('Ошибка сервера');
  }
};

export const fetchClasses = async (token: string, signal?: AbortSignal) => {
  try {
    const response = await axios.get<ClassesResponse>(`${API_BASE_URL}/api/classes`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    return response.data.classes;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Запрос отменен');
    }
    if (err.response?.status === 401) {
      throw new Error('Неавторизован');
    }
    if (err.response?.status === 403) {
      throw new Error('Доступ запрещён');
    }
    throw new Error('Ошибка сервера при получении классов');
  }
};

export const fetchStudents = async (token: string, classId: string, signal?: AbortSignal) => {
  try {
    const response = await axios.get<StudentsResponse>(`${API_BASE_URL}/api/classes/${classId}/students`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    return response.data.students;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Запрос отменен');
    }
    if (err.response?.status === 403) {
      throw new Error('Доступ запрещен');
    }
    throw new Error('Ошибка сервера при получении учеников');
  }
};

export const createEvaluation = async (evaluation: EvaluationRequest, token: string) => {
  try {
    const response = await axios.post<EvaluationResponse>(
      `${API_BASE_URL}/api/evaluations/create`,
      evaluation,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 400) {
      throw new Error(err.response?.data?.error || 'Неверные данные для создания оценки');
    }
    if (err.response?.status === 403) {
      throw new Error('Доступ запрещён');
    }
    if (err.response?.status === 500) {
      throw new Error('Ошибка сервера');
    }
    throw new Error('Неизвестная ошибка при создании оценки');
  }
};