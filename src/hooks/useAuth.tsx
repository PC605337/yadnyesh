import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  switchRole: (newRole: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  switchRole: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with better error handling
          const fetchProfile = async () => {
            try {
              // First fetch the profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

              if (!mounted) return;

              // Then fetch user roles to determine primary role
              const { data: userRoles, error: rolesError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('is_active', true);

              // Determine primary role (admin takes precedence)
              let primaryRole = 'patient';
              if (userRoles && userRoles.length > 0) {
                if (userRoles.some(r => r.role === 'admin')) {
                  primaryRole = 'admin';
                } else if (userRoles.some(r => r.role === 'corporate')) {
                  primaryRole = 'corporate';
                } else if (userRoles.some(r => r.role === 'provider')) {
                  primaryRole = 'provider';
                } else {
                  primaryRole = userRoles[0].role;
                }
              }

              if (profileError || !profileData) {
                console.error('Error fetching profile:', profileError);
                // Create a basic profile if one doesn't exist
                setProfile({
                  id: session.user.id,
                  user_id: session.user.id,
                  first_name: session.user.user_metadata?.first_name || null,
                  last_name: session.user.user_metadata?.last_name || null,
                  email: session.user.email || null,
                  role: primaryRole,
                  phone: session.user.user_metadata?.phone || null,
                  avatar_url: null,
                });
              } else {
                // Update profile with current role
                setProfile({
                  ...profileData,
                  role: primaryRole
                });
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
              if (mounted) {
                // Fallback profile
                setProfile({
                  id: session.user.id,
                  user_id: session.user.id,
                  first_name: session.user.user_metadata?.first_name || null,
                  last_name: session.user.user_metadata?.last_name || null,
                  email: session.user.email || null,
                  role: 'patient',
                  phone: session.user.user_metadata?.phone || null,
                  avatar_url: null,
                });
              }
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          };

          fetchProfile();
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // First fetch the profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (!mounted) return;

          // Then fetch user roles to determine primary role
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('is_active', true);

          // Determine primary role (admin takes precedence)
          let primaryRole = 'patient';
          if (userRoles && userRoles.length > 0) {
            if (userRoles.some(r => r.role === 'admin')) {
              primaryRole = 'admin';
            } else if (userRoles.some(r => r.role === 'corporate')) {
              primaryRole = 'corporate';
            } else if (userRoles.some(r => r.role === 'provider')) {
              primaryRole = 'provider';
            } else {
              primaryRole = userRoles[0].role;
            }
          }

          if (error || !profileData) {
            console.error('Error fetching profile:', error);
            // Create fallback profile
            setProfile({
              id: session.user.id,
              user_id: session.user.id,
              first_name: session.user.user_metadata?.first_name || null,
              last_name: session.user.user_metadata?.last_name || null,
              email: session.user.email || null,
              role: primaryRole,
              phone: session.user.user_metadata?.phone || null,
              avatar_url: null,
            });
          } else {
            // Update profile with current role
            setProfile({
              ...profileData,
              role: primaryRole
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const switchRole = (newRole: string) => {
    if (profile && profile.role !== newRole) {
      setProfile(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signOut,
      switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};