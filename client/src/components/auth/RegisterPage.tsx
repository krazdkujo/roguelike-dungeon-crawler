import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { register } from '@/stores/authSlice';
import { RegisterRequest } from '@/types';
import './auth.scss';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    mode: 'onChange'
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    await dispatch(register(registerData));
  };

  const validatePasswordMatch = (confirmPassword: string) => {
    const password = getValues('password');
    return password === confirmPassword || 'Passwords do not match';
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="game-title">Roguelike Dungeon Crawler</h1>
          <h2 className="auth-title">Join the Adventure!</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Adventurer Name</label>
            <input
              {...registerField('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                maxLength: {
                  value: 20,
                  message: 'Username cannot exceed 20 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: 'Username can only contain letters, numbers, underscore, and dash'
                }
              })}
              type="text"
              id="username"
              className={errors.username ? 'error' : ''}
              placeholder="Choose your adventurer name"
              autoComplete="username"
            />
            {errors.username && (
              <span className="field-error">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              {...registerField('email', {
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
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: 'Password must contain uppercase, lowercase, number, and special character'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={errors.password ? 'error' : ''}
                placeholder="Create a strong password"
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: validatePasswordMatch
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword.message}</span>
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
                Creating Account...
              </>
            ) : (
              'Begin Your Quest'
            )}
          </button>

          <div className="auth-links">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
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

export default RegisterPage;