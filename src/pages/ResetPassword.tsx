import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, KeyRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);
  const [linkError, setLinkError] = useState('');

  const t = {
    ar: {
      title: 'إعادة تعيين كلمة المرور',
      description: 'أدخل كلمة المرور الجديدة',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      submit: 'تحديث كلمة المرور',
      success: 'تم تحديث كلمة المرور بنجاح',
      mismatch: 'كلمتا المرور غير متطابقتين',
      minLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      invalidLink: 'رابط غير صالح. اطلب رابط جديد.',
      backToLogin: '← العودة لتسجيل الدخول',
    },
    en: {
      title: 'Reset Password',
      description: 'Enter your new password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      submit: 'Update Password',
      success: 'Password updated successfully',
      mismatch: 'Passwords do not match',
      minLength: 'Password must be at least 6 characters',
      invalidLink: 'Invalid link. Please request a new one.',
      backToLogin: '← Back to Login',
    },
    fr: {
      title: 'Réinitialiser le mot de passe',
      description: 'Entrez votre nouveau mot de passe',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Mettre à jour',
      success: 'Mot de passe mis à jour avec succès',
      mismatch: 'Les mots de passe ne correspondent pas',
      minLength: 'Le mot de passe doit contenir au moins 6 caractères',
      invalidLink: 'Lien invalide. Veuillez en demander un nouveau.',
      backToLogin: '← Retour à la connexion',
    },
  }[language];

  useEffect(() => {
    let cancelled = false;

    const allowPasswordReset = () => {
      if (cancelled) return;
      setIsRecovery(true);
      setChecking(false);
      setLinkError('');
      window.history.replaceState(null, '', '/reset-password');
    };

    const hasActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        allowPasswordReset();
        return true;
      }
      return false;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        allowPasswordReset();
      }
    });

    const init = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      const type = hashParams.get('type') || queryParams.get('type');
      const code = queryParams.get('code');
      const tokenHash = hashParams.get('token_hash') || queryParams.get('token_hash') || hashParams.get('token') || queryParams.get('token');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (!error) {
          allowPasswordReset();
          return;
        }
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          allowPasswordReset();
          return;
        }
      }

      if (type === 'recovery' && tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
        if (!error) {
          allowPasswordReset();
          return;
        }
      }

      if (await hasActiveSession()) return;

      if (!cancelled) {
        setLinkError(errorDesc || 'invalid');
        setChecking(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: t.minLength, variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: t.mismatch, variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: error.message, variant: 'destructive' });
    } else {
      toast({ title: t.success });
      navigate('/auth');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md shadow-elevated text-center">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.invalidLink}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" onClick={() => navigate('/auth')}>
              {t.backToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-playfair">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t.newPassword}
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t.confirmPassword}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t.submit}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate('/auth')}>
              {t.backToLogin}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
