import { useState, useEffect, useCallback } from 'react';
import { AuthUser, StudentProfile } from '../types/index.js';
import { api } from '../services/api.js';

interface UseAuthSessionReturn {
  user: AuthUser | null;
  profile: StudentProfile;
  isAuthenticating: boolean;
  viewMode: 'landing' | 'studio' | 'auth';
  setViewMode: React.Dispatch<React.SetStateAction<'landing' | 'studio' | 'auth'>>;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  handleAuthenticated: (authenticatedUser: AuthUser) => Promise<void>;
  handleLogout: () => void;
  handleSaveProfile: (newProfile: StudentProfile) => Promise<void>;
  loadUserData: () => Promise<void>;
}

const DEFAULT_PROFILE: StudentProfile = {
  skills: [],
  interests: [],
  preferredDomain: '',
  difficultyLevel: 'Intermediate',
  availableWeeks: 12,
  hoursPerWeek: 15,
  preferredTech: [],
  projectConstraints: [],
};

export function useAuthSession(onUserLoaded?: () => void): UseAuthSessionReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [viewMode, setViewMode] = useState<'landing' | 'studio' | 'auth'>('landing');
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);

  const loadUserData = useCallback(async () => {
    try {
      const p = await api.getProfile();
      if (p.profile) {
        setProfile(p.profile);
      }
    } catch {
      // Non-blocking
    }
  }, []);

  const initSession = useCallback(async () => {
    try {
      if (api.getToken()) {
        const me = await api.getMe();
        if (me.user && me.user.email === 'student@demo.edu') {
          api.logout();
          setUser(null);
          setViewMode('landing');
        } else {
          setUser(me.user);
          await loadUserData();
          onUserLoaded?.();
          setViewMode('studio');
        }
      } else {
        setUser(null);
        setViewMode('landing');
      }
    } catch {
      api.logout();
      setUser(null);
      setViewMode('landing');
    } finally {
      setIsAuthenticating(false);
    }
  }, [loadUserData, onUserLoaded]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const handleAuthenticated = async (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setViewMode('studio');
    await loadUserData();
    onUserLoaded?.();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setViewMode('landing');
  };

  const handleSaveProfile = async (newProfile: StudentProfile) => {
    setProfile(newProfile);
    try {
      await api.saveProfile(newProfile);
    } catch {
      // Background save
    }
  };

  return {
    user,
    profile,
    isAuthenticating,
    viewMode,
    setViewMode,
    setProfile,
    handleAuthenticated,
    handleLogout,
    handleSaveProfile,
    loadUserData,
  };
}
