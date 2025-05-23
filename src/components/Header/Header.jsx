import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './Header.css';
import logo from '../../assets/logo.png';
import icon from '../../assets/icon.png';
import AuthModal from '../AuthModal/AuthModal';

const supabaseUrl = 'https://jvccejerkjfnkwtqumcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Y2NlamVya2pmbmt3dHF1bWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTMzMjAsImV4cCI6MjA2MTA4OTMyMH0.xgqIMs3r007pJIeV5P8y8kG4hRcFqrgXvkkdavRtVIw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        setIsAuthenticated(true);
        const { data: userData, error } = await supabase
          .from('users')
          .select('role, is_admin')
          .eq('id', sessionData.session.user.id)
          .single();

        if (userData && !error) {
          setUserRole(userData.role);
          setIsAdmin(userData.is_admin);
        }
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkSession();
      } else {
        setUserRole(null);
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection('home'), 100);
    } else {
      scrollToSection('home');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setShowDropdown(false);
      setUserRole(null);
      setIsAdmin(false);
      navigate('/');
      alert('Вы успешно вышли из аккаунта!');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Ошибка при выходе из аккаунта.');
    }
  };

  const handleSettings = () => {
    if (isAdmin) {
      navigate('/adminpanel');
    } else if (userRole === 'artist') {
      navigate('/artprofile');
    } else if (userRole === 'hirer') {
      navigate('/hirerprofile');
    }
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <header className="Header">
        <div className="Header-logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="Header-nav">
          <a href="#home" onClick={handleHomeClick}>
            Главная
          </a>
          <a
            href="#contacts"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contacts');
            }}
          >
            Контакты
          </a>
          <NavLink to="/3d" className={({ isActive }) => (isActive ? 'active' : '')}>
            3D
          </NavLink>
          <NavLink to="/motion" className={({ isActive }) => (isActive ? 'active' : '')}>
            Моушн
          </NavLink>
          <NavLink to="/illustration" className={({ isActive }) => (isActive ? 'active' : '')}>
            Иллюстрация
          </NavLink>
          <NavLink to="/interior" className={({ isActive }) => (isActive ? 'active' : '')}>
            Интерьер
          </NavLink>
          <NavLink to="/other" className={({ isActive }) => (isActive ? 'active' : '')}>
            Другое
          </NavLink>
        </nav>
        <div className="Header-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <img
                src={icon}
                alt="User Icon"
                className="user-icon"
                onClick={toggleDropdown}
                style={{ cursor: 'pointer', width: '40px', height: '40px' }}
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleSettings}>Настройки</button>
                  <button onClick={handleLogout}>Выйти</button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                setShowAuthModal(true);
              }}
            >
              Войти/Регистрация
            </a>
          )}
        </div>
      </header>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default Header;
