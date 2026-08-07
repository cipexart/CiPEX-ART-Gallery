import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Receipt, 
  Printer, 
  Download, 
  Send, 
  Check, 
  DollarSign, 
  User, 
  Calendar,
  X,
  CreditCard
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Customer, Artwork, Offer, Invoice, Language } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface OffersAndInvoicesViewProps {
  offers: Offer[];
  invoices: Invoice[];
  customers: Customer[];
  artworks: Artwork[];
  lang: Language;
  onCreateOffer: (offer: Offer) => void;
  onCreateInvoice: (invoice: Invoice) => void;
}

export const OffersAndInvoicesView: React.FC<OffersAndInvoicesViewProps> = ({
  offers,
  invoices,
  customers,
  artworks,
  lang,
  onCreateOffer,
  onCreateInvoice
}) => {
  const isAr = lang === 'ar';
  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'invoices'>('offers');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Offer Creation State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedArtworkId, setSelectedArtworkId] = useState(artworks[0]?.id || '');
  const [discountPercent, setDiscountPercent] = useState(5);

  const handleCreateNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === selectedCustomerId);
    const artwork = artworks.find(a => a.id === selectedArtworkId);

    if (!customer || !artwork) return;

    const originalPrice = artwork.sellingPriceMAD;
    const discountVal = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountVal;
    const taxVal = finalPrice * 0.15; // 15% VAT
    const totalMAD = finalPrice + taxVal;

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      offerNumber: `OFF-2024-${Math.floor(100 + Math.random() * 900)}`,
      customerId: customer.id,
      customerNameAr: customer.nameAr,
      customerNameFr: customer.nameFr,
      items: [
        {
          artworkId: artwork.id,
          artworkTitleAr: artwork.titleAr,
          artworkTitleFr: artwork.titleFr,
          originalPriceMAD: originalPrice,
          discountPercent,
          finalPriceMAD: finalPrice,
          artworkImage: artwork.primaryImage
        }
      ],
      subtotalMAD: originalPrice,
      discountMAD: discountVal,
      taxMAD: taxVal,
      totalMAD,
      validUntil: '2024-07-31',
      customMessageAr: 'عرض خاص لشراء لوحة معاصرة رفيعة المستوى.',
      customMessageFr: 'Offre spéciale pour l’acquisition d’une œuvre d’art contemporaine.',
      status: 'sent',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateOffer(newOffer);
    setIsOfferModalOpen(false);
  };

  const exportPdfOffer = (offer: Offer) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`OFFER QUOTATION: ${offer.offerNumber}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${offer.customerNameFr}`, 20, 35);
    doc.text(`Date: ${offer.createdAt}`, 20, 45);
    doc.text(`Total Amount: ${offer.totalMAD} MAD (Moroccan Dirham)`, 20, 55);
    doc.text(`Valid Until: ${offer.validUntil}`, 20, 65);
    doc.save(`${offer.offerNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* View Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {getTranslation(lang, 'navOffers')} & {getTranslation(lang, 'navInvoices')}
          </h2>
          <p className="text-xs text-slate-400">
            {isAr ? 'إصدار وتتبع عروض الأسعار، الفواتير الرسمية، وإيصالات المقبوضات' : 'Émission et suivi des offres, factures et reçus de paiement'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SubTab Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('offers')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'offers'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {getTranslation(lang, 'navOffers')}
            </button>
            <button
              onClick={() => setActiveSubTab('invoices')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'invoices'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {getTranslation(lang, 'navInvoices')}
            </button>
          </div>

          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{getTranslation(lang, 'createOffer')}</span>
          </button>
        </div>
      </div>

      {/* Offers Subtab View */}
      {activeSubTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {offer.offerNumber}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {offer.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? offer.customerNameAr : offer.customerNameFr}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr ? offer.customMessageAr : offer.customMessageFr}
                </p>
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-xs">
                {offer.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {isAr ? item.artworkTitleAr : item.artworkTitleFr}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.finalPriceMAD, lang)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{getTranslation(lang, 'totalAmount')}</span>
                  <span className="font-black text-base text-slate-900 dark:text-white">
                    {formatCurrency(offer.totalMAD, lang)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportPdfOffer(offer)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                    title={getTranslation(lang, 'exportPdf')}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                    title={getTranslation(lang, 'print')}
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoices Subtab View */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-right rtl:text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-4 px-4 text-right rtl:text-right">{getTranslation(lang, 'invoiceNumber')}</th>
                <th className="py-4 px-4 text-right rtl:text-right">{getTranslation(lang, 'customerName')}</th>
                <th className="py-4 px-4 text-right rtl:text-right">{isAr ? 'اللوحات' : 'Euvres'}</th>
                <th className="py-4 px-4 text-right rtl:text-right">{getTranslation(lang, 'totalAmount')}</th>
                <th className="py-4 px-4 text-center">{getTranslation(lang, 'paymentStatus')}</th>
                <th className="py-4 px-4 text-center">{getTranslation(lang, 'actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {isAr ? inv.customerNameAr : inv.customerNameFr}
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    {(isAr ? inv.artworkTitlesAr : inv.artworkTitlesFr).join(', ')}
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                    {formatCurrency(inv.totalMAD, lang)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                      inv.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => {
                        const doc = new jsPDF();
                        doc.text(`INVOICE: ${inv.invoiceNumber}`, 20, 20);
                        doc.text(`Total: ${inv.totalMAD} MAD`, 20, 40);
                        doc.save(`${inv.invoiceNumber}.pdf`);
                      }}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to Create Offer */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {getTranslation(lang, 'createOffer')}
              </h3>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {getTranslation(lang, 'selectCustomer')}
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.nameAr : c.nameFr} ({isAr ? c.cityAr : c.cityFr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {getTranslation(lang, 'selectArtworks')}
                </label>
                <select
                  value={selectedArtworkId}
                  onChange={(e) => setSelectedArtworkId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  {artworks.map((a) => (
                    <option key={a.id} value={a.id}>
                      {isAr ? a.titleAr : a.titleFr} - {formatCurrency(a.sellingPriceMAD, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {getTranslation(lang, 'discount')} (%)
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  {getTranslation(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  {getTranslation(lang, 'sendOffer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
