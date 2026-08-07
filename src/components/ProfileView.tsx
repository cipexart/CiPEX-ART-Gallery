import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Save, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  Globe, 
  Upload, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Language, User, UserRole } from '../types';
import { getTranslation } from '../i18n/translations';
import { logNewUserToSheets, logSessionEventToSheets } from '../lib/googleServices';
import { cleanMoroccanPhone, isValidMoroccanPhone, getMoroccanPhoneError } from '../lib/phoneUtils';

interface ProfileViewProps {
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
  googleAccessToken: string | null;
  lang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  googleAccessToken,
  lang
}) => {
  const isAr = lang === 'ar';

  // Parse initial first and last name if available or split from name
  const nameParts = (currentUser?.name || '').split(' ');
  const defaultFirstName = currentUser?.firstName || nameParts[0] || '';
  const defaultLastName = currentUser?.lastName || nameParts.slice(1).join(' ') || '';

  // Form State
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || 'Casablanca, Maroc');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');
  
  // Notice & Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncStatusNotice, setSyncStatusNotice] = useState('');

  // Preset Avatars for Quick Choice
  const presetAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  ];

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSyncStatusNotice('');

    const cleanedPhone = cleanMoroccanPhone(phone);
    if (cleanedPhone && !isValidMoroccanPhone(cleanedPhone)) {
      setSyncStatusNotice(getMoroccanPhoneError(isAr));
      setIsSaving(false);
      return;
    }

    const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim() || currentUser.name;

    const updatedUser: User = {
      ...currentUser,
      name: combinedName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: cleanedPhone || phone.trim(),
      city: city.trim(),
      bio: bio.trim(),
      avatar: avatar,
      isVerified: true
    };

    // Update parent state and localStorage
    onUpdateUser(updatedUser);

    // Sync to Google Sheets if token exists or log event
    try {
      await logNewUserToSheets(googleAccessToken, updatedUser);
      await logSessionEventToSheets(googleAccessToken, {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        eventType: 'PROFILE_UPDATE',
        timestamp: new Date().toLocaleString('ar-MA', { timeZone: 'Africa/Casablanca' }),
        details: `تحديث بيانات البروفايل الشخصي وصورة المستخدم (${updatedUser.city})`
      });
      setSyncStatusNotice(isAr ? 'تمت المزامنة بنجاح مع جدول Google Sheets!' : 'Synchronisé avec Google Sheets!');
    } catch (err) {
      console.warn('Sheets sync profile error:', err);
    } finally {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-slate-400">
        {isAr ? 'يرجى تسجيل الدخول للوصول إلى الملف الشخصي.' : 'Veuillez vous connecter.'}
      </div>
    );
  }

  const isRoleAdmin = currentUser.role === 'admin';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:rtl:text-right md:ltr:text-left">
            {/* Avatar Stack */}
            <div className="relative group">
              <img
                src={avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-indigo-500/40 shadow-2xl bg-slate-800"
              />
              <label 
                htmlFor="avatar-upload-header"
                className="absolute bottom-[-6px] right-[-6px] p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl cursor-pointer shadow-lg transition-transform hover:scale-110 border border-slate-900"
                title={isAr ? 'تغيير صورة البروفايل' : 'Changer de photo'}
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload-header"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                  isRoleAdmin 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                    : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                }`}>
                  {isRoleAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{isRoleAdmin ? (isAr ? 'مدير المعرض (الأدمن)' : 'Directeur') : (isAr ? 'زائر المعرض (مؤكد)' : 'Visiteur Confirme')}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{isAr ? 'حساب مفعل ومؤكد' : 'Compte Vérifié'}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {currentUser.name}
              </h2>

              <p className="text-xs text-slate-300 flex items-center justify-center md:justify-start gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-xs text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-right rtl:text-right ltr:text-left">
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                {isAr ? 'معرف المستخدم الموحد' : 'ID Utilisateur'}
              </p>
              <p className="font-mono text-slate-200 text-xs font-bold">{currentUser.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Status Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              {isAr ? 'تم حفظ التغييرات وتحديث بيانات بروفايلك بنجاح!' : 'Profil mis à jour avec succès!'}
            </span>
          </div>
          {syncStatusNotice && <span className="text-[11px] text-emerald-400 underline">{syncStatusNotice}</span>}
        </div>
      )}

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar choice & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-500" />
              <span>{isAr ? 'صورة البروفايل الشخصية' : 'Photo de Profil'}</span>
            </h3>

            <div className="flex flex-col items-center gap-3">
              <img
                src={avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-indigo-500/30 shadow-lg bg-slate-100 dark:bg-slate-800"
              />

              <label className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{isAr ? 'رفع صورة من جهازك' : 'Téléverser une image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                {isAr ? 'أو اختر من الصور الجاهزة:' : 'Ou choisissez une photo:'}
              </p>
              <div className="flex items-center justify-between gap-2">
                {presetAvatars.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-10 h-10 rounded-2xl overflow-hidden border-2 transition-all ${
                      avatar === preset ? 'border-amber-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-70'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>{isAr ? 'حالة وشروط الحساب' : 'Statut du Compte'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? 'تأكيد البريد:' : 'Email Confirmé:'}</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مؤكد 100%' : 'Vérifié'}</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? 'صلاحيات الحساب:' : 'Rôle:'}</span>
                <span className={`font-bold ${isRoleAdmin ? 'text-amber-500' : 'text-indigo-500'}`}>
                  {isRoleAdmin ? (isAr ? 'مدير المعرض' : 'Directeur') : (isAr ? 'زائر المعرض' : 'Visiteur')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? 'المزامنة مع Sheets:' : 'Sync Sheets:'}</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نشطة ومفعلة' : 'Actif'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Details */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isAr ? 'تحديث المعلومات الشخصية' : 'Informations Personnelles'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAr 
                    ? 'أدخل اسمك الشخصي والعائلي ومعلومات الاتصال لإظهارها في سجل المقتنيات والشهادات.'
                    : 'Mettez à jour vos coordonnées et détails personnels.'}
                </p>
              </div>

              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <UserIcon className="w-5 h-5" />
              </span>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* First Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'الاسم الشخصي (First Name):' : 'Prénom:'}
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={isAr ? 'مثال: كريم' : 'Ex: Karim'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'الاسم العائلي (Last Name):' : 'Nom de Famille:'}
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={isAr ? 'مثال: العلوي' : 'Ex: Alami'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Email Address (ReadOnly) */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'البريد الإلكتروني (مؤكد):' : 'Adresse Email:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:right-3 rtl:left-auto text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono font-bold cursor-not-allowed"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute top-1/2 -translate-y-1/2 right-3 rtl:left-3 rtl:right-auto" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'رقم الهاتف (يبدأ بـ 05 أو 06 أو 07):' : 'Téléphone (05, 06 ou 07):'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:right-3 rtl:left-auto text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0699745621"
                    className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAr ? 'مثال: 0699745621 أو 0799745621 (10 أرقام فقط بدون +)' : 'Ex: 0699745621 (10 chiffres sans +)'}
                </p>
              </div>

              {/* City */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'المدينة والبلد:' : 'Ville & Pays:'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:right-3 rtl:left-auto text-slate-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isAr ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc'}
                    className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'نبذة أو اهتمامات فنية:' : 'Bio & Intérêts artistiques:'}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    isAr 
                      ? 'مقتني ومحب للفن التشكيلي المعاصر، مهتم بأعمال الفنان محمد الجالي والأساليب الانطباعية والتجريدية.'
                      : 'Amateur d’art contemporain et collectionneur d’œuvres originales.'
                  }
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:border-indigo-500 outline-none transition-all leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {isAr ? 'يتم حفظ البيانات محلياً وفي Google Sheets تلقائياً' : 'Données enregistrées localement et sur Google Sheets'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving 
                    ? (isAr ? 'جاري الحفظ والمزامنة...' : 'Enregistrement...') 
                    : (isAr ? 'حفظ التغييرات وتحديث البروفايل' : 'Enregistrer le profil')}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
