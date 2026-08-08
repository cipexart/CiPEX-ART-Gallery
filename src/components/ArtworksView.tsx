import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Sparkles,
  X,
  Send,
  CheckCircle2,
  Phone,
  User as UserIcon,
  MessageSquare,
  Palette
} from 'lucide-react';
import { Artwork, Artist, Language, UserRole } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface ArtworksViewProps {
  artworks: Artwork[];
  artists: Artist[];
  lang: Language;
  userRole?: UserRole;
  onSaveArtwork: (artwork: Artwork) => void;
  onUpdateArtwork?: (artwork: Artwork) => void;
  onDeleteArtwork: (id: string) => void;
  onOpenArtworkModal: (artwork: Artwork) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  onInquireArtwork?: (artwork: Artwork, note: string) => void;
}

export const ArtworksView: React.FC<ArtworksViewProps> = ({
  artworks,
  artists,
  lang,
  userRole = 'admin',
  onSaveArtwork,
  onUpdateArtwork,
  onDeleteArtwork,
  onOpenArtworkModal,
  isAddModalOpen,
  setIsAddModalOpen,
  onInquireArtwork
}) => {
  const isAr = lang === 'ar';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing state
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  // Form State for Artwork
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [artistId, setArtistId] = useState(artists[0]?.id || '');
  const [year, setYear] = useState(2024);
  const [mediumAr, setMediumAr] = useState('زيت على قماش');
  const [mediumFr, setMediumFr] = useState('Huile sur toile');
  const [styleAr, setStyleAr] = useState('تجريدي معاصر');
  const [styleFr, setStyleFr] = useState('Abstrait');
  const [categoryAr, setCategoryAr] = useState('لوحات زيتية');
  const [categoryFr, setCategoryFr] = useState('Peinture');
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(80);
  const [purchaseCostMAD, setPurchaseCostMAD] = useState(15000);
  const [sellingPriceMAD, setSellingPriceMAD] = useState(30000);
  const [commissionRate, setCommissionRate] = useState(15);
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [primaryImage, setPrimaryImage] = useState('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80');

  // Visitor Inquiry Modal State
  const [inquireArtwork, setInquireArtwork] = useState<Artwork | null>(null);
  const [inquiryNote, setInquiryNote] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleOpenEditArtwork = (item: Artwork) => {
    setEditingArtwork(item);
    setTitleAr(item.titleAr);
    setTitleFr(item.titleFr);
    setArtistId(item.artistId);
    setYear(item.year);
    setMediumAr(item.mediumAr);
    setMediumFr(item.mediumFr);
    setStyleAr(item.styleAr);
    setStyleFr(item.styleFr);
    setCategoryAr(item.categoryAr);
    setCategoryFr(item.categoryFr);
    setHeight(item.dimensions.height);
    setWidth(item.dimensions.width);
    setPurchaseCostMAD(item.purchaseCostMAD);
    setSellingPriceMAD(item.sellingPriceMAD);
    setCommissionRate(item.commissionRate);
    setDescriptionAr(item.descriptionAr);
    setDescriptionFr(item.descriptionFr);
    setPrimaryImage(item.primaryImage);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artist = artists.find(a => a.id === artistId) || artists[0];

    if (editingArtwork && onUpdateArtwork) {
      onUpdateArtwork({
        ...editingArtwork,
        titleAr,
        titleFr,
        artistId,
        artistNameAr: artist.nameAr,
        artistNameFr: artist.nameFr,
        year,
        mediumAr,
        mediumFr,
        styleAr,
        styleFr,
        categoryAr,
        categoryFr,
        dimensions: { height, width, unit: 'cm' },
        purchaseCostMAD,
        sellingPriceMAD,
        commissionRate,
        descriptionAr,
        descriptionFr,
        primaryImage,
        updatedAt: new Date().toISOString()
      });
    } else {
      const newArtwork: Artwork = {
        id: `art-${Date.now()}`,
        uuid: `CIPEX-${Math.floor(100000 + Math.random() * 900000)}`,
        artworkNumber: `ART-${Math.floor(100 + Math.random() * 900)}`,
        titleAr,
        titleFr,
        artistId,
        artistNameAr: artist.nameAr,
        artistNameFr: artist.nameFr,
        year,
        mediumAr,
        mediumFr,
        materialAr: 'قماش فاخر',
        materialFr: 'Toile',
        dimensions: { height, width, unit: 'cm' },
        styleAr,
        styleFr,
        categoryAr,
        categoryFr,
        purchaseCostMAD,
        sellingPriceMAD,
        estimatedValueMAD: sellingPriceMAD * 1.2,
        insuranceValueMAD: sellingPriceMAD,
        commissionRate,
        descriptionAr,
        descriptionFr,
        status: 'available',
        primaryImage,
        galleryImages: [primaryImage],
        location: 'صالة العرض الرئيسية - الدار البيضاء',
        isUnique: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onSaveArtwork(newArtwork);
    }

    setIsAddModalOpen(false);
    setEditingArtwork(null);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquireArtwork && onInquireArtwork) {
      onInquireArtwork(inquireArtwork, inquiryNote);
    }
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquireArtwork(null);
      setInquiryNote('');
    }, 2000);
  };

  const filteredArtworks = artworks.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesQuery = 
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artworkNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'reserved': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'sold': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{getTranslation(lang, 'navArtworks')}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {filteredArtworks.length} {isAr ? 'لوحة' : 'œuvres'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'استعرض واكتشف الأعمال الفنية الأصلية للفنان محمد الجالي' : 'Découvrez les œuvres originales de Mohamed El Gali'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 left-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث عن لوحة...' : 'Chercher...'}
              className="bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 border border-transparent focus:border-indigo-500 outline-none w-48"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="all">{isAr ? 'جميع الحالات' : 'Tous les Statuts'}</option>
            <option value="available">{getTranslation(lang, 'statusAvailable')}</option>
            <option value="reserved">{getTranslation(lang, 'statusReserved')}</option>
            <option value="sold">{getTranslation(lang, 'statusSold')}</option>
            <option value="exhibition">{getTranslation(lang, 'statusExhibition')}</option>
          </select>

          {/* Admin Add Artwork Button */}
          {userRole === 'admin' && (
            <button
              onClick={() => {
                setEditingArtwork(null);
                setIsAddModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(lang, 'addArtwork')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredArtworks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-4 my-8">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <Palette className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'لا توجد لوحات معروضة حالياً' : 'Aucune œuvre disponible pour le moment'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {isAr 
              ? 'سيقوم مدير المعرض بنشر الأعمال الفنية والأصيلة للفنان محمد الجالي فور إضافتها. يرجى إعادة الزيارة قريباً.' 
              : 'Le directeur de la galerie publiera les œuvres d’art de Mohamed El Gali dès leur ajout. Veuillez revenir bientôt.'}
          </p>
          {userRole === 'admin' && (
            <button
              onClick={() => {
                setEditingArtwork(null);
                setTitleAr('');
                setTitleFr('');
                setDescriptionAr('');
                setDescriptionFr('');
                setIsAddModalOpen(true);
              }}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة أول لوحة الآن (مدير)' : 'Ajouter la première œuvre'}</span>
            </button>
          )}
        </div>
      ) : (
        /* Artworks Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Thumbnail Container */}
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img
                  src={item.primaryImage}
                  alt={item.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 rtl:right-3 rtl:left-auto px-3 py-1 rounded-full text-[10px] font-black border ${getBadgeColor(item.status)}`}>
                  {getTranslation(lang, `status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}` as any)}
                </span>

                {/* Hover Quick Action Buttons */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    onClick={() => onOpenArtworkModal(item)}
                    className="bg-white text-slate-900 p-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-lg"
                    title={getTranslation(lang, 'artworkDetails')}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {userRole === 'admin' ? (
                    <>
                      <button
                        onClick={() => handleOpenEditArtwork(item)}
                        className="bg-white text-amber-600 p-2.5 rounded-full hover:bg-amber-600 hover:text-white transition-colors shadow-lg"
                        title={getTranslation(lang, 'edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteArtwork(item.id)}
                        className="bg-white text-rose-600 p-2.5 rounded-full hover:bg-rose-600 hover:text-white transition-colors shadow-lg"
                        title={getTranslation(lang, 'delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setInquireArtwork(item)}
                      className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-1.5 px-4"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold">{isAr ? 'طلب اقتناء' : 'Acquérir'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                    <span>{item.artworkNumber}</span>
                    <span>{item.year}</span>
                  </div>

                  <h3 
                    onClick={() => onOpenArtworkModal(item)}
                    className="font-bold text-base text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1"
                  >
                    {isAr ? item.titleAr : item.titleFr}
                  </h3>

                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {isAr ? item.artistNameAr : item.artistNameFr}
                  </p>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span>{isAr ? 'الخامة:' : 'Médium:'}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isAr ? item.mediumAr : item.mediumFr}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isAr ? 'الأبعاد:' : 'Dimensions:'}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.dimensions.height}×{item.dimensions.width} cm
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400">{getTranslation(lang, 'sellingPrice')}</span>
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {formatCurrency(item.sellingPriceMAD, lang)}
                  </span>
                </div>

                {/* Visitor Direct Button */}
                {userRole === 'visitor' && (
                  <button
                    onClick={() => setInquireArtwork(item)}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-900 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{getTranslation(lang, 'inquireArtwork')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visitor Inquiry Modal */}
      {inquireArtwork && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {getTranslation(lang, 'inquireArtwork')}
                </h3>
              </div>
              <button
                onClick={() => setInquireArtwork(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {getTranslation(lang, 'inquirySent')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
                {/* Artwork Card Summary */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <img
                    src={inquireArtwork.primaryImage}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {isAr ? inquireArtwork.titleAr : inquireArtwork.titleFr}
                    </h4>
                    <p className="text-slate-400 font-mono text-[11px]">{inquireArtwork.artworkNumber}</p>
                    <p className="font-black text-indigo-600 text-xs mt-0.5">
                      {formatCurrency(inquireArtwork.sellingPriceMAD, lang)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {isAr ? 'رسالة أو ملاحظة الاقتناء' : 'Message / Note d’acquisition'}
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryNote}
                    onChange={(e) => setInquiryNote(e.target.value)}
                    placeholder={isAr ? 'أود حجز هذه اللوحة أو الاستفسار عن شهادة الأصالة والشحن...' : 'Je souhaite réserver cette œuvre...'}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال طلب الاقتناء الآن' : 'Envoyer la Demande'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Admin Add/Edit Artwork Modal */}
      {isAddModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingArtwork ? (isAr ? 'تعديل اللوحة الفنية' : 'Modifier l’Œuvre') : getTranslation(lang, 'addArtwork')}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    العنوان بالعربية
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Titre en Français
                  </label>
                  <input
                    type="text"
                    required
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    سعر البيع (MAD)
                  </label>
                  <input
                    type="number"
                    required
                    value={sellingPriceMAD}
                    onChange={(e) => setSellingPriceMAD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    تكلفة الشراء (MAD)
                  </label>
                  <input
                    type="number"
                    required
                    value={purchaseCostMAD}
                    onChange={(e) => setPurchaseCostMAD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    عمولة الفنان (%)
                  </label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  رابط صورة اللوحة
                </label>
                <input
                  type="url"
                  required
                  value={primaryImage}
                  onChange={(e) => setPrimaryImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  {getTranslation(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
                >
                  {getTranslation(lang, 'save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
