import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  institution_id: string;
  email: string;
  first_name: string;
  last_name: string;
  first_name_khmer?: string;
  last_name_khmer?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}

interface UserRole {
  id: string;
  user_id: string;
  institution_id: string;
  role: 'admin' | 'coordinator' | 'teacher';
  assigned_by?: string;
  assigned_at: string;
}

interface Institution {
  id: string;
  name: string;
  name_khmer?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_khmer?: string;
  website?: string;
  logo_url?: string;
  settings: any;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRoles: UserRole[];
  institution: Institution | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: 'admin' | 'coordinator' | 'teacher') => boolean;
  isPrimaryRole: (role: 'admin' | 'coordinator' | 'teacher') => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  userRoles: [],
  institution: null,
  loading: true,
  signOut: async () => {},
  hasRole: () => false,
  isPrimaryRole: () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData);

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        return;
      }

      setUserRoles(rolesData || []);

      // Fetch institution
      if (profileData?.institution_id) {
        const { data: institutionData, error: institutionError } = await supabase
          .from('institutions')
          .select('*')
          .eq('id', profileData.institution_id)
          .single();

        if (institutionError) {
          console.error('Error fetching institution:', institutionError);
          return;
        }

        setInstitution(institutionData);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setUserRoles([]);
          setInstitution(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasRole = (role: 'admin' | 'coordinator' | 'teacher') => {
    return userRoles.some(userRole => userRole.role === role);
  };

  const isPrimaryRole = (role: 'admin' | 'coordinator' | 'teacher') => {
    // Admin is the highest role, then coordinator, then teacher
    const roleHierarchy = { admin: 3, coordinator: 2, teacher: 1 };
    const userTopRole = userRoles.reduce((highest, userRole) => {
      return roleHierarchy[userRole.role] > roleHierarchy[highest] ? userRole.role : highest;
    }, 'teacher' as 'admin' | 'coordinator' | 'teacher');
    
    return userTopRole === role;
  };

  const value = {
    user,
    session,
    profile,
    userRoles,
    institution,
    loading,
    signOut,
    hasRole,
    isPrimaryRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};