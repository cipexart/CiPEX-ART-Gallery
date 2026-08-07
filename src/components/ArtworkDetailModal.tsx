import React from 'react';
import { 
  X, 
  QrCode, 
  Download, 
  Building2,
  Sparkles,
  CheckCircle2,
  Send
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Artwork, Language, UserRole } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  lang: Language;
  userRole?: UserRole;
  onInquire?: (artwork: Artwork) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  artwork,
  onClose,
  lang,
  userRole = 'admin',
  onInquire
}) => {
  if (!artwork) return null;
  const isAr = lang === 'ar';

  const generateCertificatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('CERTIFICATE OF AUTHENTICITY', 20, 25);
    doc.setFontSize(12);
    doc.text(`Reference UUID: ${artwork.uuid}`, 20, 40);
    doc.text(`Artwork Title: ${artwork.titleFr} (${artwork.titleAr})`, 20, 50);
    doc.text(`Artist: ${artwork.artistNameFr}`, 20, 60);
    doc.text(`Year: ${artwork.year}`, 20, 70);
    doc.text(`Medium: ${artwork.mediumFr}`, 20, 80);
    doc.text(`Dimensions: ${artwork.dimensions.height} x ${artwork.dimensions.width} cm`, 20, 90);
    doc.text(`Estimated Value: ${artwork.sellingPriceMAD} MAD (Moroccan Dirham)`, 20, 100);
    doc.text('Certified by Galerie d’Art Élégante - Casablanca, Morocco', 20, 120);
    doc.save(`Certificate_${artwork.artworkNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              {artwork.artworkNumber}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
              {getTranslation(lang, `status${artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}` as any)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Artwork Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Visual & QR Code */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={artwork.primaryImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Certificate download for Admin */}
            {userRole === 'admin' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-slate-800 dark:text-slate-200" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {isAr ? 'رمز QR الفريد للوحة' : 'Code QR Unique'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {artwork.uuid}
                    </span>
                  </div>
                </div>

                <button
                  onClick={generateCertificatePdf}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Details & Metadata */}
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {isAr ? artwork.titleAr : artwork.titleFr}
              </h2>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {isAr ? artwork.artistNameAr : artwork.artistNameFr} ({artwork.year})
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {isAr ? artwork.descriptionAr : artwork.descriptionFr}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">{getTranslation(lang, 'medium')}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {isAr ? artwork.mediumAr : artwork.mediumFr}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">{getTranslation(lang, 'dimensions')}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {artwork.dimensions.height} × {artwork.dimensions.width} cm
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">{getTranslation(lang, 'sellingPrice')}</span>
                  <span className="font-black text-base text-slate-900 dark:text-white">
                    {formatCurrency(artwork.sellingPriceMAD, lang)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'قطعة أصلية موثقة' : 'Œuvre Authentique'}</span>
                </div>
              </div>
            </div>

            {/* Inquire Action Button for Visitors */}
            {userRole === 'visitor' && onInquire && (
              <button
                onClick={() => onInquire(artwork)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{getTranslation(lang, 'inquireArtwork')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
