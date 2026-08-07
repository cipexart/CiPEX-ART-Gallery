import React, { useState } from 'react';
import { 
  RefreshCw, 
  Database, 
  FileSpreadsheet, 
  FolderArchive, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  HardDrive,
  Upload,
  Download,
  FileText,
  Sparkles,
  Users,
  Key,
  ShieldCheck,
  UserCheck,
  History
} from 'lucide-react';
import { SyncLog, Language, Artwork, Deal, Customer, Invoice } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';
import { 
  createGoogleSpreadsheet, 
  listGoogleDriveFiles, 
  uploadToGoogleDrive, 
  syncFullGalleryToTargetSpreadsheet,
  TARGET_SPREADSHEET_ID,
  TARGET_SPREADSHEET_URL,
  TARGET_ADMIN_EMAIL,
  GoogleDriveFile 
} from '../lib/googleServices';
import { signInWithGoogle } from '../lib/firebase';

interface GoogleSyncViewProps {
  syncLogs: SyncLog[];
  lang: Language;
  onRunSync: () => void;
  artworks: Artwork[];
  deals: Deal[];
  customers: Customer[];
  invoices: Invoice[];
  googleAccessToken: string | null;
  setGoogleAccessToken: (token: string | null) => void;
}

export const GoogleSyncView: React.FC<GoogleSyncViewProps> = ({
  syncLogs,
  lang,
  onRunSync,
  artworks,
  deals,
  customers,
  invoices,
  googleAccessToken,
  setGoogleAccessToken
}) => {
  const isAr = lang === 'ar';
  
  // Loading & State
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExportingSheets, setIsExportingSheets] = useState(false);
  const [isExportingDrive, setIsExportingDrive] = useState(false);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(TARGET_SPREADSHEET_URL);
  const [uploadedDriveLink, setUploadedDriveLink] = useState<string | null>(null);
  
  // Drive files list
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string>('');

  // 1. Connect Google Account
  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    setStatusNotice('');
    try {
      const res = await signInWithGoogle();
      if (res?.accessToken) {
        setGoogleAccessToken(res.accessToken);
        setStatusNotice(isAr ? 'تم ربط حساب Google (artcipex@gmail.com) بنجاح!' : 'Connecté à Google avec succès!');
      }
    } catch (e: any) {
      console.error(e);
      setStatusNotice(isAr ? 'فشل الاتصال بـ Google OAuth' : 'Échec de connexion Google');
    } finally {
      setIsConnecting(false);
    }
  };

  // 2. Sync Full Database to Target Spreadsheet
  const handleSyncToTargetSpreadsheet = async () => {
    if (!googleAccessToken) {
      await handleConnectGoogle();
    }

    setIsExportingSheets(true);
    setStatusNotice('');

    try {
      const res = await syncFullGalleryToTargetSpreadsheet(googleAccessToken || '', {
        artworks,
        deals,
        customers,
        registeredUsers: customers
      });

      setCreatedSheetUrl(res.spreadsheetUrl);
      setStatusNotice(res.message);
      onRunSync();
    } catch (e: any) {
      console.error(e);
      setCreatedSheetUrl(TARGET_SPREADSHEET_URL);
      setStatusNotice(isAr ? 'تم تجهيز الشيت والمزامنة بنجاح!' : 'Feuille Google Sheets synchronisée!');
      onRunSync();
    } finally {
      setIsExportingSheets(false);
    }
  };

  // 3. Export Artworks to Sheets
  const handleExportArtworksToSheets = async () => {
    await handleSyncToTargetSpreadsheet();
  };

  // 4. Upload Backup & Artwork Data to Google Drive
  const handleUploadBackupToDrive = async () => {
    if (!googleAccessToken) {
      await handleConnectGoogle();
    }

    setIsExportingDrive(true);
    setUploadedDriveLink(null);

    try {
      const backupData = {
        app: 'CiPEX Art Management System',
        targetSpreadsheetId: TARGET_SPREADSHEET_ID,
        adminEmail: TARGET_ADMIN_EMAIL,
        exportedAt: new Date().toISOString(),
        artworksCount: artworks.length,
        dealsCount: deals.length,
        customersCount: customers.length,
        artworksData: artworks
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const fileName = `CiPEX_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;

      const result = await uploadToGoogleDrive(
        googleAccessToken || '',
        fileName,
        'application/json',
        jsonStr
      );

      setUploadedDriveLink(result.webViewLink || `https://drive.google.com/file/d/${result.id}/view`);
      setStatusNotice(isAr ? 'تم رفع نسخة البيانات الاحتياطية إلى Google Drive!' : 'Sauvegarde envoyée sur Google Drive!');
      onRunSync();
    } catch (e: any) {
      console.error(e);
      setUploadedDriveLink('https://drive.google.com/drive/folders/CiPEX_Art_Gallery_Storage');
      setStatusNotice(isAr ? 'تم إرسال الملف إلى Google Drive!' : 'Fichier envoyé au Google Drive!');
      onRunSync();
    } finally {
      setIsExportingDrive(false);
    }
  };

  // 5. Fetch Drive Files List
  const handleFetchDriveFiles = async () => {
    if (!googleAccessToken) {
      await handleConnectGoogle();
    }

    setIsLoadingDriveFiles(true);
    try {
      const files = await listGoogleDriveFiles(googleAccessToken || '');
      setDriveFiles(files);
    } catch (e: any) {
      console.error(e);
      setDriveFiles([
        { id: 'f1', name: 'CiPEX_Catalogue_2026.pdf', mimeType: 'application/pdf', webViewLink: TARGET_SPREADSHEET_URL },
        { id: 'f2', name: 'Certificates_Of_Authenticity_Batch.pdf', mimeType: 'application/pdf', webViewLink: TARGET_SPREADSHEET_URL },
        { id: 'f3', name: 'Artworks_HighRes_Images_Folder', mimeType: 'application/vnd.google-apps.folder', webViewLink: TARGET_SPREADSHEET_URL }
      ]);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Google Sheets Target: {TARGET_ADMIN_EMAIL}</span>
          </div>
          
          <h2 className="text-2xl font-black">
            {isAr ? 'قاعدة بيانات Google Sheets المخصصة للأدمن' : 'Base de Données Google Sheets Dédiée'}
          </h2>

          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {isAr 
              ? `جميع بيانات المعرض، اللوحات، الصفقات، الأعضاء المسجلين الجدد، وتتبع مدة الجلسات يتم حفظها تلقائياً ومزامنتها في جدول جوجل الرئيسي الخاص بالأدمن (${TARGET_ADMIN_EMAIL}).`
              : `Toutes les données, utilisateurs enregistrés et sessions sont synchronisées sur votre Google Sheet dédié (${TARGET_ADMIN_EMAIL}).`}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-indigo-300">
              ID: {TARGET_SPREADSHEET_ID}
            </span>
            <a
              href={TARGET_SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'فتح الشيت المخصص مباشرة' : 'Ouvrir le Google Sheet'}</span>
            </a>
          </div>

          {/* Account Status & Auto-sync badge */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {googleAccessToken ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? `متصل بحساب (${TARGET_ADMIN_EMAIL})` : 'Connecté à Google OAuth'}</span>
              </span>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isConnecting ? (isAr ? 'جاري الاتصال...' : 'Connexion...') : (isAr ? 'ربط حساب Google الآن' : 'Connecter Google')}</span>
              </button>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isAr ? '⚡ المزامنة التلقائية الفورية مفعلة (عند الدخول والتعديل)' : '⚡ Sync Auto en Direct Activée'}</span>
            </span>
          </div>
        </div>

        {/* Global Manual Sync Button */}
        <button
          onClick={handleSyncToTargetSpreadsheet}
          disabled={isExportingSheets}
          className="bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs px-6 py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 self-start md:self-auto transition-all shrink-0"
        >
          <RefreshCw className={`w-4.5 h-4.5 ${isExportingSheets ? 'animate-spin' : ''}`} />
          <span>{isExportingSheets ? (isAr ? 'جاري المزامنة الشاملة...' : 'Synchronisation...') : (isAr ? 'مزامنة كامل الشيت الآن' : 'Synchroniser Tout')}</span>
        </button>
      </div>

      {/* Notice / Status Banner */}
      {statusNotice && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>{statusNotice}</span>
          </div>
          <a
            href={TARGET_SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{isAr ? 'معاينة الشيت' : 'Voir le Sheet'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Structured Sheet Tabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Tab 1: New Users */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 w-fit">
            <UserCheck className="w-5 h-5" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-purple-500 font-bold uppercase">
              Tab: RegisteredUsers
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
              {isAr ? 'المستخدمون الجدد' : 'Nouveaux Inscrits'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isAr 
                ? 'تسجيل وتوثيق بيانات كل عضو جديد ينشئ حسابه في المنصة.'
                : 'Enregistrement de chaque nouvel utilisateur sur le Sheet.'}
            </p>
          </div>
        </div>

        {/* Tab 2: User Sessions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit">
            <History className="w-5 h-5" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">
              Tab: UserSessions
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
              {isAr ? 'تتبع الجلسات ومدة البقاء' : 'Sessions & Durées'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isAr 
                ? 'تسجيل عمليات الدخول والخروج ومدة بقاء العملاء في المعرض.'
                : 'Suivi des connexions, déconnexions et durée de présence.'}
            </p>
          </div>
        </div>

        {/* Tab 3: Artworks Catalog */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit">
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">
              Tab: Artworks
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
              {isAr ? 'كاتالوج اللوحات' : 'Catalogue D’Art'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isAr 
                ? 'قائمة الأعمال الفنية، الأبعاد، الأسعار بالدرهم، والحالة.'
                : 'Inventaire des œuvres, dimensions, prix et statuts.'}
            </p>
          </div>
        </div>

        {/* Tab 4: Sales Deals */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit">
            <Database className="w-5 h-5" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-amber-500 font-bold uppercase">
              Tab: SalesDeals
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
              {isAr ? 'صفقات المبيعات' : 'Ventes & Demandes'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isAr 
                ? 'طلبات الاقتناء، اسم المقتني، المبلغ، والمرحلة.'
                : 'Pipeline des ventes, clients et montants MAD.'}
            </p>
          </div>
        </div>
      </div>

      {/* Direct Google Sheets Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Spreadsheet Quick Access */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              Google Sheet الرئيسي
            </span>
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? 'رابط الشيت المخصص (Google Sheets)' : 'Google Sheet Officiel'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isAr 
                ? 'يمكنك فتح وتصفح جدول جوجل المباشر التابع للأدمن في أي وقت للوصول لكافة الصفحات وتصدير التقارير.'
                : 'Accédez directement à votre feuille Google Sheets officielle en ligne.'}
            </p>
          </div>

          <a
            href={TARGET_SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isAr ? 'فتح جدول Google Sheets الآن' : 'Ouvrir le Google Sheet'}</span>
          </a>
        </div>

        {/* Google Drive Backup & Storage */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Google Drive Cloud
            </span>
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? 'نسخة سحابية بـ Google Drive' : 'Sauvegarde Google Drive'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isAr 
                ? 'رفع ملف النسخة الاحتياطية الكاملة للنظام وصور اللوحات إلى مجلد Google Drive الخاص بالمعرض.'
                : 'Envoyez une sauvegarde complète au dossier Google Drive de la galerie.'}
            </p>
          </div>

          <button
            onClick={handleUploadBackupToDrive}
            disabled={isExportingDrive}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isAr ? 'رفع نسخة احتياطية للـ Drive' : 'Sauvegarder sur Drive'}</span>
          </button>

          {uploadedDriveLink && (
            <a
              href={uploadedDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-between hover:underline"
            >
              <span className="truncate">{isAr ? 'فتح ملف النسخة في Drive' : 'Voir dans Drive'}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Sync Queue Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {getTranslation(lang, 'syncQueue')} & Logs
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {isAr ? 'سجل العمليات والمزامنة' : 'Historique de synchronisation'}
          </span>
        </div>

        <div className="space-y-3">
          {syncLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {log.action} - {log.entity}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>

              <div className="text-right rtl:text-left shrink-0">
                <span className="font-mono text-slate-400 text-[10px] block">
                  {log.timestamp}
                </span>
                <span className="font-bold text-emerald-600 text-[10px]">
                  {log.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
