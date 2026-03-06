import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plane, DollarSign, Lock, User, Mail } from 'lucide-react';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('البريد الإلكتروني غير صالح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
const nameSchema = z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل');

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAdmin, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const isRTL = language === 'ar';
  const redirectTo = searchParams.get('redirect') || '/';
  
  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInErrors, setSignInErrors] = useState<{ email?: string; password?: string }>({});
  
  // Sign Up form state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signUpErrors, setSignUpErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'signin');

  useEffect(() => {
    if (user) {
      // If admin, go to admin panel, otherwise go to redirect URL
      if (isAdmin && redirectTo === '/') {
        navigate('/admin');
      } else {
        navigate(redirectTo);
      }
    }
  }, [user, isAdmin, navigate, redirectTo]);

  const validateSignIn = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(signInEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(signInPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setSignInErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    try {
      emailSchema.parse(signUpEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(signUpPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    try {
      nameSchema.parse(fullName);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.name = e.errors[0].message;
      }
    }
    
    setSignUpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    setLoading(true);
    const { error } = await signIn(signInEmail, signInPassword);
    setLoading(false);
    
    if (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message === 'Invalid login credentials' 
          ? (isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: isRTL ? 'مرحباً بعودتك!' : 'Welcome back!',
        description: isRTL ? 'تم تسجيل الدخول بنجاح' : 'You have successfully signed in.',
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateSignUp();
    if (!isValid) return;
    
    setLoading(true);
    const { error } = await signUp(signUpEmail, signUpPassword, fullName);
    setLoading(false);
    
    if (error) {
      const message = error.message.includes('already registered')
        ? (isRTL ? 'هذا البريد مسجل مسبقاً. قم بتسجيل الدخول.' : 'This email is already registered.')
        : error.message;
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: isRTL ? 'تم إنشاء الحساب!' : 'Account created!',
        description: isRTL ? 'تم إنشاء حسابك بنجاح. يمكنك الآن الوصول لأسعار الخدمات.' : 'Your account has been created successfully.',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const content = {
    ar: {
      title: 'سكاي أيكون',
      description: 'سجّل للوصول إلى أسعار الخدمات الحصرية',
      signIn: 'تسجيل الدخول',
      signUp: 'حساب جديد',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signInBtn: 'دخول',
      signUpBtn: 'إنشاء حساب',
      backToHome: '← العودة للموقع',
      benefits: [
        'الوصول لأسعار جميع الخدمات',
        'عروض وخصومات حصرية',
        'متابعة حجوزاتك'
      ]
    },
    en: {
      title: 'Sky Icon',
      description: 'Sign up to access exclusive service prices',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      backToHome: '← Back to Website',
      benefits: [
        'Access all service prices',
        'Exclusive offers and discounts',
        'Track your bookings'
      ]
    },
    fr: {
      title: 'Sky Icon',
      description: 'Inscrivez-vous pour accéder aux prix exclusifs',
      signIn: 'Connexion',
      signUp: 'Inscription',
      fullName: 'Nom Complet',
      email: 'Email',
      password: 'Mot de passe',
      signInBtn: 'Se connecter',
      signUpBtn: 'Créer un compte',
      backToHome: '← Retour au site',
      benefits: [
        'Accès à tous les prix des services',
        'Offres et réductions exclusives',
        'Suivez vos réservations'
      ]
    }
  };

  const t = content[language];

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Plane className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-playfair">{t.title}</CardTitle>
          <CardDescription className="text-base">
            {t.description}
          </CardDescription>
          
          {/* Benefits */}
          <div className="bg-muted/50 rounded-lg p-4 text-start">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-secondary" />
              <span className="font-semibold text-foreground">
                {isRTL ? 'مميزات العضوية:' : language === 'fr' ? 'Avantages:' : 'Member Benefits:'}
              </span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {t.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
              <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t.email}
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="email@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className={signInErrors.email ? 'border-destructive' : ''}
                  />
                  {signInErrors.email && <p className="text-sm text-destructive">{signInErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t.password}
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className={signInErrors.password ? 'border-destructive' : ''}
                  />
                  {signInErrors.password && <p className="text-sm text-destructive">{signInErrors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t.signInBtn}
                </Button>
                <div className="text-center mt-2">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={async () => {
                      if (!signInEmail) {
                        toast({
                          title: isRTL ? 'أدخل البريد الإلكتروني أولاً' : language === 'fr' ? 'Entrez votre email d\'abord' : 'Enter your email first',
                          variant: 'destructive',
                        });
                        return;
                      }
                      const { error } = await supabase.auth.resetPasswordForEmail(signInEmail, {
                        redirectTo: `${window.location.origin}/reset-password`,
                      });
                      if (error) {
                        toast({ title: error.message, variant: 'destructive' });
                      } else {
                        toast({
                          title: isRTL ? 'تم الإرسال' : language === 'fr' ? 'Email envoyé' : 'Email sent',
                          description: isRTL ? 'تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور' : language === 'fr' ? 'Vérifiez votre email' : 'Check your email to reset your password',
                        });
                      }
                    }}
                  >
                    {isRTL ? 'نسيت كلمة المرور؟' : language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.fullName}
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={isRTL ? 'اسمك الكامل' : 'Your full name'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={signUpErrors.name ? 'border-destructive' : ''}
                  />
                  {signUpErrors.name && <p className="text-sm text-destructive">{signUpErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t.email}
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="email@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className={signUpErrors.email ? 'border-destructive' : ''}
                  />
                  {signUpErrors.email && <p className="text-sm text-destructive">{signUpErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t.password}
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className={signUpErrors.password ? 'border-destructive' : ''}
                  />
                  {signUpErrors.password && <p className="text-sm text-destructive">{signUpErrors.password}</p>}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t.signUpBtn}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate('/')}>
              {t.backToHome}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;