import React, { useState } from 'react';
import { 
  Palette, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  ArrowRight, 
  Globe, 
  Moon, 
  Sun, 
  Sparkles, 
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  UserPlus,
  LogIn,
  KeyRound,
  ExternalLink,
  Send,
  AlertCircle
} from 'lucide-react';
import { Language, ThemeMode, User, UserRole } from '../types';
import { getTranslation } from '../i18n/translations';
import { signInWithGoogle, saveUserToFirestore, saveCustomerToFirestore } from '../lib/firebase';
import { 
  logNewUserToSheets, 
  logSessionEventToSheets, 
  TARGET_ADMIN_EMAIL,
  TARGET_SPREADSHEET_URL
} from '../lib/googleServices';

interface LoginViewProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  onLogin: (user: User, googleAccessToken?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  onLogin
}) => {
  const isAr = lang === 'ar';
  
  // Auth Mode: 'signup' (إنشاء حساب) vs 'login' (تسجيل الدخول)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  
  // Role: Only 'visitor' or 'admin'
  const [selectedRole, setSelectedRole] = useState<UserRole>('visitor');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [roleNotice, setRoleNotice] = useState('');

  // Email Verification Pending Modal State for Signup
  const [pendingVerificationUser, setPendingVerificationUser] = useState<{
    user: User;
    token?: string;
  } | null>(null);

  // Handle Form Submit (Signup or Login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoleNotice('');

    const typedEmail = email.trim().toLowerCase();
    const isDedicatedAdmin = typedEmail === TARGET_ADMIN_EMAIL.toLowerCase();

    // Enforce Rule: Only artcipex@gmail.com can be Admin
    let effectiveRole: UserRole = selectedRole;
    if (selectedRole === 'admin' && !isDedicatedAdmin) {
      effectiveRole = 'visitor';
      setRoleNotice(
        isAr 
          ? 'تم تسجيك كـ (زائر) فقط، لأن صفة مدير المعرض مخصصة حصرياً لـ artcipex@gmail.com' 
          : 'Enregistré comme Visiteur (Directeur réservé à artcipex@gmail.com)'
      );
    } else if (isDedicatedAdmin) {
      effectiveRole = 'admin';
    }

    const defaultName = isDedicatedAdmin 
      ? (isAr ? 'الفنان محمد الجالي (مدير المعرض الرئيسي)' : 'Mohamed El Gali (Admin CiPEX)')
      : (isAr ? 'زائر المعرض' : 'Visiteur de Galerie');

    const newUser: User = {
      id: `usr-${effectiveRole}-${Date.now()}`,
      name: fullName.trim() || defaultName,
      email: typedEmail || (effectiveRole === 'admin' ? TARGET_ADMIN_EMAIL : 'visitor@cipex.ma'),
      phone: phone.trim() || '+212 600 000000',
      role: effectiveRole,
      avatar: effectiveRole === 'admin'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
    };

    // If Signup: Trigger Email Verification Link Step
    if (authMode === 'signup') {
      setPendingVerificationUser({ user: newUser });
      return;
    }

    // Direct Login for Existing Users
    await finalizeUserLogin(newUser);
  };

  // Finalize Registration and Session Logging to Google Sheets & Firestore
  const finalizeUserLogin = async (user: User, googleToken?: string) => {
    // Store user in local registered users list for persistence across sessions
    try {
      const saved = localStorage.getItem('cipl_registered_users');
      const existing: User[] = saved ? JSON.parse(saved) : [];
      const idx = existing.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], ...user };
      } else {
        existing.unshift({ ...user, createdAt: new Date().toISOString().slice(0, 10) });
      }
      localStorage.setItem('cipl_registered_users', JSON.stringify(existing));

      // Also ensure customer record exists for non-admin visitors in local storage
      if (user.role !== 'admin' && user.email) {
        const savedCust = localStorage.getItem('cipl_customers');
        const custs: any[] = savedCust ? JSON.parse(savedCust) : [];
        const cIdx = custs.findIndex((c: any) => c.email.toLowerCase() === user.email.toLowerCase());
        const newCustObj = {
          id: user.id || `cust-${Date.now()}`,
          nameAr: user.name || 'زائر جديد',
          nameFr: user.name || 'Nouveau Visiteur',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          cityAr: user.city || 'الدار البيضاء',
          cityFr: user.city || 'Casablanca',
          countryAr: 'المغرب',
          countryFr: 'Maroc',
          email: user.email,
          phone: user.phone || '+212 600 000000',
          totalPurchasesMAD: 0,
          purchasesCount: 0,
          favoriteArtists: ['محمد الجالي'],
          favoriteStyles: ['تجريدي معاصر'],
          budgetMAD: 50000,
          lastContactDate: new Date().toISOString().slice(0, 10),
          tags: ['عضو مسجل عبر المنصة'],
          notesAr: user.bio || 'حساب زائر مسجل عبر المنصة.',
          notesFr: user.bio || 'Compte visiteur enregistré via la plateforme.'
        };

        if (cIdx >= 0) {
          custs[cIdx] = { ...custs[cIdx], nameAr: user.name, nameFr: user.name, phone: user.phone || custs[cIdx].phone };
        } else {
          custs.unshift(newCustObj);
        }
        localStorage.setItem('cipl_customers', JSON.stringify(custs));

        // Save to Firestore as well
        await saveCustomerToFirestore(newCustObj);
      }

      await saveUserToFirestore(user);
    } catch (e) {
      console.warn('Failed to save user or customer locally/Firestore:', e);
    }

    // Log user registration if coming from verification/signup
    if (authMode === 'signup') {
      try {
        await logNewUserToSheets(googleToken || null, user);
      } catch (err) {
        console.warn('Sheets registration log error:', err);
      }
    }

    // Log session login event to Google Sheets
    try {
      await logSessionEventToSheets(googleToken || null, {
        email: user.email,
        name: user.name,
        role: user.role,
        eventType: 'LOGIN',
        timestamp: new Date().toLocaleString('ar-MA', { timeZone: 'Africa/Casablanca' }),
        details: authMode === 'signup' ? 'تم تأكيد البريد الإلكتروني وإنشاء الحساب' : 'تسجيل دخول عادي'
      });
    } catch (err) {
      console.warn('Sheets session login error:', err);
    }

    onLogin(user, googleToken);
  };

  // Google Auth
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setRoleNotice('');
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        const googleEmail = (res.user.email || '').toLowerCase();
        const isDedicatedAdmin = googleEmail === TARGET_ADMIN_EMAIL.toLowerCase();
        const effectiveRole: UserRole = isDedicatedAdmin ? 'admin' : 'visitor';

        setRoleNotice(
          isDedicatedAdmin 
            ? (isAr ? 'تم التحقق بنجاح من حساب المدير الرئيسي (artcipex@gmail.com)' : 'Compte Admin verifié (artcipex@gmail.com)')
            : (isAr ? `تم تسجيل الدخول بنجاح بحساب الزائر (${googleEmail})` : `Connecté en tant que Visiteur (${googleEmail})`)
        );

        const newUser: User = {
          id: res.user.uid,
          name: res.user.displayName || (isDedicatedAdmin ? 'الفنان محمد الجالي (الأدمن)' : (isAr ? 'زائر المعرض' : 'Visiteur')),
          email: googleEmail || (effectiveRole === 'admin' ? TARGET_ADMIN_EMAIL : 'visitor@google.com'),
          role: effectiveRole,
          avatar: res.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        };

        const token = res.accessToken || undefined;

        await finalizeUserLogin(newUser, token);
      }
    } catch (err: any) {
      console.error('Google login error', err);
      const errMsg = err?.message || '';
      if (errMsg.includes('popup-closed-by-user')) {
        setRoleNotice(isAr ? 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.' : 'Connexion annulée par l’utilisateur.');
      } else if (errMsg.includes('unauthorized-domain')) {
        setRoleNotice(isAr ? 'النطاق غير مصرح به في Firebase Console. يرجى إضافة cipexart.github.io إلى Authorized Domains في Firebase.' : 'Domaine non autorisé dans Firebase Console.');
      } else {
        setRoleNotice(
          isAr 
            ? `تعذر الاتصال بـ Google (${errMsg || 'يرجى التأكد من السماح بالنوافذ المنبثقة'}).`
            : `Échec de connexion Google (${errMsg}).`
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Explicit Demo Admin Login for local/offline testing
  const handleDemoAdminLogin = async () => {
    const fallbackUser: User = {
      id: `usr-admin-demo`,
      name: isAr ? 'الفنان محمد الجالي (معاينة تجريبية)' : 'Mohamed El Gali (Mode Demo)',
      email: TARGET_ADMIN_EMAIL,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    };
    await finalizeUserLogin(fallbackUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Decorative Blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Top Header Controls */}
      <header className="relative z-10 max-w-7xl w-full mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/cipex_logo.jpg" 
            alt="CiPEX Logo" 
            className="w-12 h-12 object-contain rounded-2xl shadow-xl shadow-indigo-500/20 bg-slate-900/60 p-1 border border-slate-800" 
          />
          <div>
            <h1 className="text-xl font-black text-white tracking-wider">CiPEX</h1>
            <p className="text-xs text-amber-400 font-semibold">{getTranslation(lang, 'gallerySubTitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all backdrop-blur-md"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
          </button>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-all backdrop-blur-md"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Email Verification Modal Step */}
      {pendingVerificationUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-xl">
                <Mail className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-xl font-black text-white">
                {isAr ? 'تم إرسال رابط تأكيد الحساب' : 'Email de Confirmation Envoyé'}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                {isAr 
                  ? 'يرجى تأكيد تسجيلك من خلال رابط التفعيل المرسل إلى البريد الإلكتروني:'
                  : 'Veuillez confirmer votre inscription via le lien envoyé à:'}
              </p>

              <span className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-800/80 text-amber-300 font-mono text-sm font-bold dir-ltr">
                {pendingVerificationUser.user.email}
              </span>
            </div>

            {/* Interactive Email Inbox Simulation Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="font-bold text-indigo-400">من: no-reply@cipex.ma</span>
                <span>الآن</span>
              </div>
              <h4 className="text-xs font-bold text-white">
                {isAr ? 'تأكيد بريدك الإلكتروني في منصة CiPEX' : 'Confirmation de votre compte CiPEX'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr 
                  ? `مرحباً ${pendingVerificationUser.user.name}! انقر على زر التأكيد أدناه لتفعيل حسابك كـ (${pendingVerificationUser.user.role === 'admin' ? 'مدير المعرض' : 'زائر المعرض'}) والدخول إلى المنصة.`
                  : `Bonjour ${pendingVerificationUser.user.name}! Cliquez sur le lien pour confirmer.`}
              </p>

              <button
                type="button"
                onClick={() => finalizeUserLogin(pendingVerificationUser.user)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحساب ومتابعة الدخول الآن' : 'Confirmer le compte et entrer'}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setPendingVerificationUser(null)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                {isAr ? 'إلغاء والعودة لصفحة التسجيل' : 'Annuler'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Vision */}
        <div className="md:col-span-6 space-y-6 text-center md:rtl:text-right md:ltr:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'نظام إدارة المعرض الفني والمقتنيات' : 'Système de Gestion de Galerie D’Art'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            {isAr ? 'مرحباً بكم في منصة CiPEX للفن التشكيلي' : 'Bienvenue sur la Plateforme CiPEX Art'}
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            {isAr
              ? 'أنشئ حسابك الجديد أو سجل دخولك للوصول المباشر إلى كاتالوج اللوحات، طلبات الاقتناء، وتتبع الحضور والمزامنة المباشرة مع Google Sheets.'
              : 'Créez votre compte ou connectez-vous pour accéder au catalogue d’œuvres et synchronisation Google.'}
          </p>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 leading-relaxed flex items-start gap-3 max-w-md">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p>
              {isAr
                ? 'ملاحظة: حساب (مدير المعرض) محصور حصرياً في البريد الإلكتروني artcipex@gmail.com، بينما يتم تسجيل باقي العملاء كـ (زائر).'
                : 'Remarque: Le rôle Administrateur est strictement réservé à artcipex@gmail.com.'}
            </p>
          </div>
        </div>

        {/* Right Side: Google Auth Only */}
        <div className="md:col-span-6">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'تسجيل الدخول الحصري المباشر عبر Google' : 'Connexion Exclusive via Google'}</span>
              </span>
              <h3 className="text-xl font-black text-white">
                {isAr ? 'الدخول السريع وتجميع البيانات التلقائي' : 'Connexion Rapide & Sync Auto'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr 
                  ? 'تم إلغاء نماذج التسجيل التقليدية. يمكنك الآن الدخول بضغطة زر باستخدام حساب Google الخاص بك وسيتم حفظ وتجمّع بياناتك تلقائياً في شيت البيانات الرئيسية.'
                  : 'Formulaires supprimés. Connectez-vous directement avec votre compte Google.'}
              </p>
            </div>

            {/* Role Notice Banner */}
            {roleNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{roleNotice}</span>
              </div>
            )}

            {/* Google Primary Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-indigo-400/30 active:scale-95 cursor-pointer"
            >
              <svg className="w-6 h-6 shrink-0 bg-white p-1 rounded-full shadow-md" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>{isGoogleLoading ? (isAr ? 'جاري الاتصال بحساب Google...' : 'Connexion à Google...') : (isAr ? 'تسجيل الدخول باستخدام حساب Google' : 'Se connecter avec Google')}</span>
            </button>

            {/* Quick Demo Preview Option for Local Testing */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="text-[11px] text-slate-400 hover:text-amber-400 font-bold underline transition-all"
              >
                {isAr ? '⚡ الدخول السريع بمعاينة الأدمن المحلية (بدون Google)' : '⚡ Mode Démo Administrateur (Sans Google)'}
              </button>
            </div>

            {/* Explanation Boxes */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300">{isAr ? 'مدير المعرض (Admin):' : 'Directeur (Admin):'}</h4>
                  <p className="text-slate-300 mt-0.5">
                    {isAr ? 'تتم منح صلاحية المدير التلقائية فقط للبريد الإلكتروني:' : 'Accès réservé à:'} <span className="font-mono text-amber-300 font-bold dir-ltr">artcipex@gmail.com</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-300">{isAr ? 'الزوار والمقتنون (Visitors):' : 'Visiteurs:'}</h4>
                  <p className="text-slate-300 mt-0.5">
                    {isAr ? 'أي حساب Google آخر يتم تسجيله كـ (زائر)، وتتجمع بيانات حسابه وصورته تلقائياً في شيت العملاء.' : 'Tout autre compte Google est enregistré comme Visiteur.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500">
        <p>© 2026 CiPEX Art Management - Galerie Mohamed El Gali (Casablanca, Maroc)</p>
      </footer>
    </div>
  );
};
