import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Palette, 
  Users, 
  DollarSign 
} from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import { Artwork, Artist, Customer, Deal, Language } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface ReportsViewProps {
  artworks: Artwork[];
  artists: Artist[];
  customers: Customer[];
  deals: Deal[];
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  artworks,
  artists,
  customers,
  deals,
  lang
}) => {
  const isAr = lang === 'ar';

  const exportExcelReport = () => {
    const data = artworks.map(a => ({
      UUID: a.uuid,
      Title_Ar: a.titleAr,
      Title_Fr: a.titleFr,
      Artist: isAr ? a.artistNameAr : a.artistNameFr,
      Price_MAD: a.sellingPriceMAD,
      Status: a.status,
      Year: a.year
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Artworks_Report");
    writeFile(workbook, "Art_Gallery_Inventory_Report.xlsx");
  };

  const exportPdfReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("ART GALLERY EXECUTIVE REPORT", 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Artworks: ${artworks.length}`, 20, 35);
    doc.text(`Total Artists: ${artists.length}`, 20, 45);
    doc.text(`Total Customers: ${customers.length}`, 20, 55);
    doc.text(`Total Estimated Revenue: 1,250,000 MAD`, 20, 65);
    doc.save("Gallery_Executive_Report.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {getTranslation(lang, 'navReports')}
          </h2>
          <p className="text-xs text-slate-400">
            {isAr ? 'تقارير الأداء المالي، تحليلات مبيعات الفنانين، وتصدير البيانات بصيغ Excel و PDF' : 'Rapports financiers, analyses des ventes et exportations Excel/PDF'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcelReport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{getTranslation(lang, 'exportExcel')}</span>
          </button>
          <button
            onClick={exportPdfReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{getTranslation(lang, 'exportPdf')}</span>
          </button>
        </div>
      </div>

      {/* Analytics Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">
            {isAr ? 'إجمالي قيمة المبيعات' : 'Chiffre d’affaires total'}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {formatCurrency(1250000, lang)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">
            {isAr ? 'صافي أرباح المعرض' : 'Bénéfice net'}
          </span>
          <span className="text-xl font-black text-emerald-600">
            {formatCurrency(320000, lang)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">
            {isAr ? 'متوسط قيمة اللوحة' : 'Prix moyen par œuvre'}
          </span>
          <span className="text-xl font-black text-indigo-600">
            {formatCurrency(38500, lang)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">
            {isAr ? 'عمولات الفنانين المسددة' : 'Commissions payées'}
          </span>
          <span className="text-xl font-black text-amber-600">
            {formatCurrency(185000, lang)}
          </span>
        </div>
      </div>

      {/* Distribution Chart Placeholder / Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            {getTranslation(lang, 'chartSalesByCategory')}
          </h3>
          <div className="flex items-center justify-center p-8">
            {/* Visual SVG Donut Chart */}
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-indigo-500" strokeWidth="6" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="40, 100" />
                <path className="text-amber-500" strokeWidth="6" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="30, 100" strokeDashoffset="-40" />
                <path className="text-emerald-500" strokeWidth="6" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="15, 100" strokeDashoffset="-70" />
                <path className="text-rose-500" strokeWidth="6" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="15, 100" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400">Total</span>
                <span className="text-base font-black text-slate-900 dark:text-white">100%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> {isAr ? 'تجريدي معاصر (40%)' : 'Abstrait (40%)'}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> {isAr ? 'واقعي (30%)' : 'Réalisme (30%)'}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> {isAr ? 'خط عربي (15%)' : 'Calligraphie (15%)'}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span> {isAr ? 'أخرى (15%)' : 'Autres (15%)'}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              {isAr ? 'ملخص نشاط المعرض' : 'Résumé d’activité'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isAr ? 'مؤشرات الأداء الرئيسية لشهر مايو 2024' : 'Indicateurs clés pour mai 2024'}
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>{isAr ? 'عدد الصفقات المبرمة' : 'Ventes conclues'}</span>
                <span className="font-bold text-slate-900 dark:text-white">15</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>{isAr ? 'المقتنيين النشطين' : 'Collectionneurs actifs'}</span>
                <span className="font-bold text-slate-900 dark:text-white">28</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>{isAr ? 'اللوحات المعروضة حالياً' : 'Exposées en galerie'}</span>
                <span className="font-bold text-slate-900 dark:text-white">95</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              {isAr ? 'تم الإنشاء تلقائياً بواسطة نظام Art Gallery Management System' : 'Généré automatiquement par le système'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
