import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { login } from '@/stores/authSlice';
import { LoginRequest } from '@/types';
import './auth.scss';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginRequest>({
    mode: 'onChange'
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginRequest) => {
    await dispatch(login(data));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="game-title">Roguelike Dungeon Crawler</h1>
          <h2 className="auth-title">Welcome Back, Adventurer!</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              id="email"
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading || !isValid}
          >
            {loading ? (
              <>
                <span className="loading-spinner small"></span>
                Logging in...
              </>
            ) : (
              'Enter the Dungeon'
            )}
          </button>

          <div className="auth-links">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </p>
          </div>
        </form>

        <div className="auth-footer">
          <div className="game-features">
            <div className="feature">
              <span className="feature-icon">⚔️</span>
              <span>Turn-based Combat</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏰</span>
              <span>Multiplayer Dungeons</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎮</span>
              <span>SNES-style Adventure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;