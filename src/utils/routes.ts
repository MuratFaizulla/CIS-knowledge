import AboutPage from "../pages/about/AboutPage";
import ClassesPage from "../pages/Classes/ClassesPage";
import ClassStudentsPage from "../pages/ClassStudents/ClassStudentsPage";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import StudentEvaluationPage from "../pages/StudentEvaluation/StudentEvaluationPage";
import MyEvaluationsPage from "../pages/MyEvaluations/MyEvaluationsPage";
import EvaluationDetailPage from "../pages/MyEvaluations/EvaluationDetailPage";
import {
  ABOUT_PAGE_ROUTE,
  CLASSES_PAGE_ROUTE,
  CLASSESSTUDENTS_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
  STUDENT_EVALUATION_PAGE_ROUTE,
  MY_EVALUATIONS_PAGE_ROUTE,
} from "./consts";

export const routes = [
  {
    path: HOME_PAGE_ROUTE,
    element: HomePage,
  },
  {
    path: ABOUT_PAGE_ROUTE,
    element: AboutPage,
  },
  {
    path: LOGIN_PAGE_ROUTE,
    element: LoginPage,
  },
  {
    path: PROFILE_PAGE_ROUTE,
    element: ProfilePage,
  },
  {
    path: CLASSES_PAGE_ROUTE,
    element: ClassesPage,
  },
  {
    path: CLASSESSTUDENTS_PAGE_ROUTE,
    element: ClassStudentsPage,
  },
  {
    path: STUDENT_EVALUATION_PAGE_ROUTE,
    element: StudentEvaluationPage,
  },
  {
    path: MY_EVALUATIONS_PAGE_ROUTE,
    element: MyEvaluationsPage,
  },
  {
    path: '/evaluations/:evaluationId', // Новый маршрут
    element: EvaluationDetailPage,
  },
  // {
  //   path: "*",
  //   element: NotFoundPage,
  // },
];