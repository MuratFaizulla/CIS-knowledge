import {Routes, Route, useLocation } from 'react-router-dom';

import './App.css'
import { routes } from './utils/routes';
import Header from './components/comnon/Header';
import Footer from './components/comnon/Footer';
import { LOGIN_PAGE_ROUTE } from './utils/consts';

function App() {
  const location = useLocation();

  // Hide Header and Footer on the login page
  const showHeaderFooter = location.pathname !== LOGIN_PAGE_ROUTE;

  return (
    <>
      <>
        {showHeaderFooter && <Header />}
        
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={<route.element />} />
            ))}
          </Routes>
        
        {showHeaderFooter && <Footer />}
      </>
    </>
  )
}

export default App



