import AboutPage from "../pages/about/AboutPage";
import ClassesPage from "../pages/Classes/ClassesPage";
import ClassStudentsPage from "../pages/ClassStudents/ClassStudentsPage";
import HomePage from "../pages/Home/HomePage";
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
  CIS_DASHBOARD_ROUTE,
  EVALUATION_DETAIL_PAGE_ROUTE,
  STUDENT_PROGRESS_ROUTE,
} from "./consts";
import CISDashboardPage from "../pages/CISDashboardPage/CISDashboardPage";
import StudentProgressPage from "../pages/StudentProgressPage/StudentProgressPage";

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
    path: EVALUATION_DETAIL_PAGE_ROUTE, // Новый маршрут
    element: EvaluationDetailPage,
  },
  {
    path: CIS_DASHBOARD_ROUTE, // Новый маршрут
    element: CISDashboardPage,
  },
   {
    path: STUDENT_PROGRESS_ROUTE, // Новый маршрут
    element: StudentProgressPage,
  },
  // {
  //   path: "*",
  //   element: NotFoundPage,
  // },
];