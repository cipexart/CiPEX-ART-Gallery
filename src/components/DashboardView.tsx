import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Palette, 
  Clock, 
  CheckCircle, 
  Calendar, 
  AlertCircle,
  ArrowUpRight,
  User,
  ShoppingBag,
  Eye,
  Plus
} from 'lucide-react';
import { Artwork, Artist, Customer, Deal, Language } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface DashboardViewProps {
  artworks: Artwork[];
  artists: Artist[];
  customers: Customer[];
  deals: Deal[];
  lang: Language;
  onOpenArtworkModal: (artwork: Artwork) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  artworks,
  artists,
  customers,
  deals,
  lang,
  onOpenArtworkModal,
  onNavigateTab
}) => {
  const isAr = lang === 'ar';

  const totalSalesMAD = 1250000;
  const netProfitMAD = 320000;
  const availableCount = artworks.filter(a => a.status === 'available').length;
  const reservedCount = artworks.filter(a => a.status === 'reserved').length;
  const totalArtworks = artworks.length;

  const topArtists = artists.slice(0, 5);

  const statusCounts = {
    available: artworks.filter(a => a.status === 'available').length,
    reserved: artworks.filter(a => a.status === 'reserved').length,
    sold: artworks.filter(a => a.status === 'sold').length,
    exhibition: artworks.filter(a => a.status === 'exhibition').length
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>{getTranslation(lang, 'galleryTitle')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getTranslation(lang, 'welcomeMessage')}
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {isAr 
                ? 'إليك نظرة شاملة على مبيعات اللوحات، حركة المعارض، وتفاعل المقتنيين والعملاء مع أعمال الفنانين هذا الشهر.' 
                : 'Aperçu complet des ventes de toiles, mouvements d’expositions et interactions des collectionneurs.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('offers')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(lang, 'createOffer')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{getTranslation(lang, 'navReports')}</span>
            </button>
          </div>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Sales */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {getTranslation(lang, 'kpiTotalSales')}
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalSalesMAD, lang)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+15.6%</span>
            <span className="text-slate-400 font-normal">{getTranslation(lang, 'kpiVsLastMonth')}</span>
          </div>
        </div>

        {/* KPI 2: Net Profit */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {getTranslation(lang, 'kpiNetProfit')}
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(netProfitMAD, lang)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.3%</span>
            <span className="text-slate-400 font-normal">{getTranslation(lang, 'kpiVsLastMonth')}</span>
          </div>
        </div>

        {/* KPI 3: Total Artworks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {getTranslation(lang, 'kpiTotalArtworks')}
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalArtworks}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {isAr ? '245 لوحة مسجلة بالنظام' : '245 œuvres enregistrées'}
          </div>
        </div>

        {/* KPI 4: Available Artworks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {getTranslation(lang, 'kpiAvailableArtworks')}
            </span>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {availableCount}
          </div>
          <div className="text-[11px] text-sky-600 font-medium mt-2">
            {isAr ? 'جاهزة للعرض والبيع' : 'Prêtes pour la vente'}
          </div>
        </div>

        {/* KPI 5: Reserved Artworks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {getTranslation(lang, 'kpiReservedArtworks')}
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {reservedCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-2">
            {isAr ? 'في انتظار استكمال الفاتورة' : 'En attente de règlement'}
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Line Curve */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {getTranslation(lang, 'chartSalesTrend')}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'معدل الإيرادات بالدرهم المغربي (MAD)' : 'Chiffre d’affaires en Dirhams Marocains (DH)'}
              </p>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl font-medium">
              2024
            </span>
          </div>

          {/* SVG Sales Curve Chart */}
          <div className="w-full h-56 relative flex items-end justify-between pt-8 pb-2 px-2">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 110 Q 90 70, 170 95 T 330 30 T 490 40 L 490 150 L 10 150 Z"
                fill="url(#salesGrad)"
              />
              <path
                d="M 10 110 Q 90 70, 170 95 T 330 30 T 490 40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Data points */}
              <circle cx="10" cy="110" r="5" fill="#6366f1" className="animate-pulse" />
              <circle cx="100" cy="80" r="5" fill="#6366f1" />
              <circle cx="190" cy="95" r="5" fill="#6366f1" />
              <circle cx="280" cy="70" r="5" fill="#6366f1" />
              <circle cx="370" cy="30" r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
              <circle cx="480" cy="40" r="5" fill="#6366f1" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
            <span>{isAr ? 'ديسمبر' : 'Décembre'}</span>
            <span>{isAr ? 'يناير' : 'Janvier'}</span>
            <span>{isAr ? 'فبراير' : 'Février'}</span>
            <span>{isAr ? 'مارس' : 'Mars'}</span>
            <span>{isAr ? 'أبريل' : 'Avril'}</span>
            <span>{isAr ? 'مايو' : 'Mai'}</span>
          </div>
        </div>

        {/* Top 5 Selling Artists */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {getTranslation(lang, 'topSellingArtists')}
            </h3>
            <button 
              onClick={() => onNavigateTab('artists')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {getTranslation(lang, 'viewAll')}
            </button>
          </div>

          <div className="space-y-3.5">
            {topArtists.map((artist, idx) => (
              <div
                key={artist.id}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <img
                    src={artist.avatar}
                    alt={artist.nameAr}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {isAr ? artist.nameAr : artist.nameFr}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {artist.artworksCount} {isAr ? 'أعمال مسجلة' : 'œuvres'}
                    </p>
                  </div>
                </div>
                <div className="text-right rtl:text-left font-bold text-xs text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(artist.totalSalesMAD, lang)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Recent Operations & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {getTranslation(lang, 'recentTransactions')}
            </h3>
            <button
              onClick={() => onNavigateTab('sales')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {getTranslation(lang, 'viewAll')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-2 text-right rtl:text-right">{isAr ? 'اللوحة' : 'Euvre'}</th>
                  <th className="py-3 px-2 text-right rtl:text-right">{isAr ? 'العميل' : 'Client'}</th>
                  <th className="py-3 px-2 text-right rtl:text-right">{isAr ? 'المبلغ' : 'Montant'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'الحالة' : 'Statut'}</th>
                  <th className="py-3 px-2 text-center">{isAr ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={deal.artworkImage}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {isAr ? deal.artworkTitleAr : deal.artworkTitleFr}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-300 font-medium">
                      {isAr ? deal.customerNameAr : deal.customerNameFr}
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(deal.amountMAD, lang)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-400">
                      {deal.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reminders & Notifications Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              {getTranslation(lang, 'notifications')}
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isAr ? 'معرض الربيع الفني' : 'Exposition de Printemps'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'متبقي 5 أيام على بداية المعرض في صالة الرباط' : 'Restant 5 jours avant l’ouverture à Rabat'}
                  </p>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">2024/06/05</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 flex items-start gap-3">
                <User className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isAr ? 'متابعة العميل أحمد العتيبي' : 'Suivi Client Ahmed Al-Otaibi'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'تواصل لمتابعة العرض الفني للوحة غروب المدينة' : 'Contact pour suivi de l’offre commerciale'}
                  </p>
                  <span className="text-[10px] text-indigo-600 font-semibold block mt-1">2024/06/07</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isAr ? 'استحقاق دفعة فنان' : 'Versement Commission Artiste'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'دفعة للعارضة سارة الهواري' : 'Versement dû à Sara El Hawari'}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">2024/06/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? 'النظام محدّث ومتزامن مع RealmDB' : 'Système à jour et synchronisé'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
