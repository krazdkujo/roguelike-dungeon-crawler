import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { logout } from '@/stores/authSlice';
import './navigation.scss';

const Navigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { currentCharacter } = useAppSelector((state) => state.game);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/dashboard" className="brand-link">
            <div className="nav-icon-sprite home"></div>
            <span className="brand-text">Dungeon Crawler</span>
          </NavLink>
        </div>

        <div className="nav-links">
          <NavLink to="/dashboard" className="nav-link">
            <div className="nav-icon-sprite experience"></div>
            Dashboard
          </NavLink>
          
          <NavLink to="/characters" className="nav-link">
            <div className="character-portrait small warrior"></div>
            Characters
          </NavLink>
          
          <NavLink to="/town" className="nav-link">
            <div className="nav-icon-sprite home"></div>
            Town
          </NavLink>

          {currentCharacter && (
            <div className="current-character">
              <span className="character-info">
                <span className="character-name">{currentCharacter.name}</span>
                <span className={`character-class ${currentCharacter.class}`}>
                  Lv.{currentCharacter.level} {currentCharacter.class}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="username">{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <div className="nav-icon-sprite logout"></div>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;