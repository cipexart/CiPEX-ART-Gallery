import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Plus, 
  Edit3,
  Trash2,
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  DollarSign, 
  Calendar,
  Building2,
  FileText,
  X,
  Upload,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Artist, Customer, Exhibition, Language, UserRole } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';
import { cleanMoroccanPhone } from '../lib/phoneUtils';

interface ManagementModulesViewProps {
  type: 'artists' | 'customers' | 'exhibitions' | 'settings';
  artists: Artist[];
  customers: Customer[];
  exhibitions: Exhibition[];
  lang: Language;
  userRole?: UserRole;
  onAddArtist: (artist: Artist) => void;
  onUpdateArtist?: (artist: Artist) => void;
  onDeleteArtist?: (id: string) => void;
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  onAddExhibition: (exhibition: Exhibition) => void;
  onUpdateExhibition?: (exhibition: Exhibition) => void;
  onDeleteExhibition?: (id: string) => void;
}

export const ManagementModulesView: React.FC<ManagementModulesViewProps> = ({
  type,
  artists,
  customers,
  exhibitions,
  lang,
  userRole = 'admin',
  onAddArtist,
  onUpdateArtist,
  onDeleteArtist,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onAddExhibition,
  onUpdateExhibition,
  onDeleteExhibition
}) => {
  const isAr = lang === 'ar';

  // Modal State for Artist
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [artistForm, setArtistForm] = useState<Partial<Artist>>({});

  // Modal State for Customer
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState<Partial<Customer>>({});

  // Modal State for Exhibition
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [exhibitionForm, setExhibitionForm] = useState<Partial<Exhibition>>({});

  // Helper for file to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Artist Handlers
  const handleOpenAddArtist = () => {
    setEditingArtist(null);
    setArtistForm({
      nameAr: '',
      nameFr: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      countryAr: 'المغرب',
      countryFr: 'Maroc',
      bioAr: '',
      bioFr: '',
      commissionRate: 20,
      artworksCount: 0,
      totalSalesMAD: 0,
      email: '',
      phone: '',
      contractStatus: 'active'
    });
    setIsArtistModalOpen(true);
  };

  const handleOpenEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setArtistForm({ ...artist });
    setIsArtistModalOpen(true);
  };

  const handleSaveArtistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArtist && onUpdateArtist) {
      onUpdateArtist({
        ...editingArtist,
        ...artistForm,
        nameAr: artistForm.nameAr || editingArtist.nameAr,
        nameFr: artistForm.nameFr || editingArtist.nameFr,
      } as Artist);
    } else {
      const newArt: Artist = {
        id: `art-${Date.now()}`,
        nameAr: artistForm.nameAr || (isAr ? 'فنان جديد' : 'Nouvel Artiste'),
        nameFr: artistForm.nameFr || 'Nouvel Artiste',
        avatar: artistForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        countryAr: artistForm.countryAr || 'المغرب',
        countryFr: artistForm.countryFr || 'Maroc',
        bioAr: artistForm.bioAr || 'نبذة عن الفنان...',
        bioFr: artistForm.bioFr || 'Bio de l’artiste...',
        commissionRate: Number(artistForm.commissionRate) || 20,
        artworksCount: Number(artistForm.artworksCount) || 0,
        totalSalesMAD: Number(artistForm.totalSalesMAD) || 0,
        email: artistForm.email || 'artist@artgallery.ma',
        phone: cleanMoroccanPhone(artistForm.phone || '') || '0661000000',
        contractStatus: (artistForm.contractStatus as any) || 'active'
      };
      onAddArtist(newArt);
    }
    setIsArtistModalOpen(false);
  };

  // Customer Handlers
  const handleOpenAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm({
      nameAr: '',
      nameFr: '',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      cityAr: 'الدار البيضاء',
      cityFr: 'Casablanca',
      countryAr: 'المغرب',
      countryFr: 'Maroc',
      email: '',
      phone: '',
      totalPurchasesMAD: 0,
      purchasesCount: 0,
      favoriteArtists: [],
      favoriteStyles: [],
      budgetMAD: 50000,
      lastContactDate: new Date().toISOString().split('T')[0],
      tags: ['مقتني جديد'],
      notesAr: '',
      notesFr: ''
    });
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      ...customer,
      tags: customer.tags
    });
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = Array.isArray(customerForm.tags)
      ? customerForm.tags
      : typeof customerForm.tags === 'string'
      ? (customerForm.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : ['عميل'];

    if (editingCustomer && onUpdateCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        ...customerForm,
        phone: cleanMoroccanPhone(customerForm.phone || '') || editingCustomer.phone,
        tags: tagsArr,
        nameAr: customerForm.nameAr || editingCustomer.nameAr,
        nameFr: customerForm.nameFr || editingCustomer.nameFr
      } as Customer);
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        nameAr: customerForm.nameAr || (isAr ? 'مقتني جديد' : 'Nouveau Collectionneur'),
        nameFr: customerForm.nameFr || 'Nouveau Collectionneur',
        avatar: customerForm.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        cityAr: customerForm.cityAr || 'الدار البيضاء',
        cityFr: customerForm.cityFr || 'Casablanca',
        countryAr: customerForm.countryAr || 'المغرب',
        countryFr: customerForm.countryFr || 'Maroc',
        email: customerForm.email || 'customer@artgallery.ma',
        phone: cleanMoroccanPhone(customerForm.phone || '') || '0660000000',
        totalPurchasesMAD: Number(customerForm.totalPurchasesMAD) || 0,
        purchasesCount: Number(customerForm.purchasesCount) || 0,
        favoriteArtists: customerForm.favoriteArtists || [],
        favoriteStyles: customerForm.favoriteStyles || [],
        budgetMAD: Number(customerForm.budgetMAD) || 50000,
        lastContactDate: new Date().toISOString().split('T')[0],
        tags: tagsArr,
        notesAr: customerForm.notesAr || '',
        notesFr: customerForm.notesFr || ''
      };
      onAddCustomer(newCust);
    }
    setIsCustomerModalOpen(false);
  };

  // Exhibition Handlers
  const handleOpenAddExhibition = () => {
    setEditingExhibition(null);
    setExhibitionForm({
      titleAr: '',
      titleFr: '',
      locationAr: 'صالة العرض الرئيسية - الدار البيضاء',
      locationFr: 'Galerie Principale - Casablanca',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      artworksCount: 10,
      coverImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&auto=format&fit=crop&q=80',
      status: 'upcoming',
      revenueMAD: 0,
      descriptionAr: '',
      descriptionFr: ''
    });
    setIsExhibitionModalOpen(true);
  };

  const handleOpenEditExhibition = (exh: Exhibition) => {
    setEditingExhibition(exh);
    setExhibitionForm({ ...exh });
    setIsExhibitionModalOpen(true);
  };

  const handleSaveExhibitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExhibition && onUpdateExhibition) {
      onUpdateExhibition({
        ...editingExhibition,
        ...exhibitionForm,
        titleAr: exhibitionForm.titleAr || editingExhibition.titleAr,
        titleFr: exhibitionForm.titleFr || editingExhibition.titleFr
      } as Exhibition);
    } else {
      const newExh: Exhibition = {
        id: `exh-${Date.now()}`,
        titleAr: exhibitionForm.titleAr || 'معرض فني جديد',
        titleFr: exhibitionForm.titleFr || 'Nouvelle Exposition',
        locationAr: exhibitionForm.locationAr || 'الدار البيضاء',
        locationFr: exhibitionForm.locationFr || 'Casablanca',
        startDate: exhibitionForm.startDate || new Date().toISOString().split('T')[0],
        endDate: exhibitionForm.endDate || new Date().toISOString().split('T')[0],
        artworksCount: Number(exhibitionForm.artworksCount) || 0,
        coverImage: exhibitionForm.coverImage || 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&auto=format&fit=crop&q=80',
        status: (exhibitionForm.status as any) || 'upcoming',
        revenueMAD: Number(exhibitionForm.revenueMAD) || 0,
        descriptionAr: exhibitionForm.descriptionAr || '',
        descriptionFr: exhibitionForm.descriptionFr || ''
      };
      onAddExhibition(newExh);
    }
    setIsExhibitionModalOpen(false);
  };

  // --- ARTISTS MODULE ---
  if (type === 'artists') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {getTranslation(lang, 'artistsManagement')}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'إدارة ملفات الفنانين التشكيليين، عقود العمولات، ومجموع المبيعات' : 'Gestion des artistes, commissions et chiffre d’affaires'}
            </p>
          </div>

          <button
            onClick={handleOpenAddArtist}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{getTranslation(lang, 'addArtist')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-all relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <img
                    src={artist.avatar}
                    alt={artist.nameAr}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {isAr ? artist.nameAr : artist.nameFr}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isAr ? artist.countryAr : artist.countryFr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditArtist(artist)}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                    title={isAr ? 'تعديل' : 'Éditer'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {onDeleteArtist && (
                    <button
                      onClick={() => {
                        if (confirm(isAr ? 'هل أنت تأكد من حذف هذا الفنان؟' : 'Voulez-vous vraiment supprimer cet artiste ?')) {
                          onDeleteArtist(artist.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                      title={isAr ? 'حذف' : 'Supprimer'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {isAr ? artist.bioAr : artist.bioFr}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block">{getTranslation(lang, 'totalWorks')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{artist.artworksCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{getTranslation(lang, 'commissionRate')}</span>
                  <span className="font-bold text-indigo-600">{artist.commissionRate}%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{getTranslation(lang, 'totalRevenue')}</span>
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {formatCurrency(artist.totalSalesMAD, lang)}
                  </span>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {artist.contractStatus.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ARTIST MODAL */}
        {isArtistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingArtist
                    ? (isAr ? 'تعديل بيانات الفنان' : 'Modifier l’artiste')
                    : (isAr ? 'إضافة فنان جديد' : 'Ajouter un nouvel artiste')}
                </h3>
                <button
                  onClick={() => setIsArtistModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveArtistSubmit} className="space-y-4 text-xs">
                {/* Avatar upload / preview */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isAr ? 'الصورة الشخصية للفنان' : 'Photo de l’artiste'}
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={artistForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setArtistForm(prev => ({ ...prev, avatar: url })))}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={artistForm.avatar || ''}
                        onChange={(e) => setArtistForm({ ...artistForm, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الاسم بالعرية' : 'Nom (Arabe)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={artistForm.nameAr || ''}
                      onChange={(e) => setArtistForm({ ...artistForm, nameAr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الاسم بالفرنسية' : 'Nom (Français)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={artistForm.nameFr || ''}
                      onChange={(e) => setArtistForm({ ...artistForm, nameFr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الدولة (بالعربية)' : 'Pays (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={artistForm.countryAr || ''}
                      onChange={(e) => setArtistForm({ ...artistForm, countryAr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الدولة (بالفرنسية)' : 'Pays (Français)'}
                    </label>
                    <input
                      type="text"
                      value={artistForm.countryFr || ''}
                      onChange={(e) => setArtistForm({ ...artistForm, countryFr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={artistForm.email || ''}
                      onChange={(e) => setArtistForm({ ...artistForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'رقم الهاتف' : 'Téléphone'}
                    </label>
                    <input
                      type="text"
                      value={artistForm.phone || ''}
                      onChange={(e) => setArtistForm({ ...artistForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'نسبة العمولة (%)' : 'Taux com. (%)'}
                    </label>
                    <input
                      type="number"
                      value={artistForm.commissionRate || 20}
                      onChange={(e) => setArtistForm({ ...artistForm, commissionRate: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'عدد الأعمال' : 'Nb. Œuvres'}
                    </label>
                    <input
                      type="number"
                      value={artistForm.artworksCount || 0}
                      onChange={(e) => setArtistForm({ ...artistForm, artworksCount: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'المبيعات (درهم)' : 'Ventes (MAD)'}
                    </label>
                    <input
                      type="number"
                      value={artistForm.totalSalesMAD || 0}
                      onChange={(e) => setArtistForm({ ...artistForm, totalSalesMAD: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'حالة العقد' : 'Statut du contrat'}
                  </label>
                  <select
                    value={artistForm.contractStatus || 'active'}
                    onChange={(e) => setArtistForm({ ...artistForm, contractStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                  >
                    <option value="active">{isAr ? 'نشط (Active)' : 'Actif'}</option>
                    <option value="suspended">{isAr ? 'معلق (Suspended)' : 'Suspendu'}</option>
                    <option value="pending">{isAr ? 'قيد المراجعة (Pending)' : 'En attente'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'السيرة الذاتية (بالعربية)' : 'Bio (Arabe)'}
                  </label>
                  <textarea
                    rows={2}
                    value={artistForm.bioAr || ''}
                    onChange={(e) => setArtistForm({ ...artistForm, bioAr: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'السيرة الذاتية (بالفرنسية)' : 'Bio (Français)'}
                  </label>
                  <textarea
                    rows={2}
                    value={artistForm.bioFr || ''}
                    onChange={(e) => setArtistForm({ ...artistForm, bioFr: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsArtistModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
                  >
                    {isAr ? 'حفظ البيانات' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- CUSTOMERS / CRM MODULE ---
  if (type === 'customers') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {getTranslation(lang, 'navCustomers')} (CRM)
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'إدارة المقتنيين، العملاء، السجل الشرائي والتفضيلات الفنية' : 'Gestion des collectionneurs, acheteurs et préférences d’art'}
            </p>
          </div>

          <button
            onClick={handleOpenAddCustomer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{getTranslation(lang, 'addCustomer')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-all relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <img
                    src={customer.avatar}
                    alt={customer.nameAr}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {isAr ? customer.nameAr : customer.nameFr}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isAr ? customer.cityAr : customer.cityFr} - {isAr ? customer.countryAr : customer.countryFr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditCustomer(customer)}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                    title={isAr ? 'تعديل' : 'Éditer'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {onDeleteCustomer && (
                    <button
                      onClick={() => {
                        if (confirm(isAr ? 'هل أنت تأكد من حذف هذا المقتني؟' : 'Voulez-vous vraiment supprimer ce client ?')) {
                          onDeleteCustomer(customer.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                      title={isAr ? 'حذف' : 'Supprimer'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(customer.tags || []).map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span>{getTranslation(lang, 'totalPurchases')}</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {formatCurrency(customer.totalPurchasesMAD, lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{getTranslation(lang, 'budget')}</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(customer.budgetMAD, lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CUSTOMER MODAL */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingCustomer
                    ? (isAr ? 'تعديل بيانات المقتني / العميل' : 'Modifier le client')
                    : (isAr ? 'إضافة مقتني / عميل جديد' : 'Ajouter un nouveau client')}
                </h3>
                <button
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomerSubmit} className="space-y-4 text-xs">
                {/* Avatar upload / preview */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isAr ? 'الصورة الشخصية' : 'Photo de profil'}
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={customerForm.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setCustomerForm(prev => ({ ...prev, avatar: url })))}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customerForm.avatar || ''}
                        onChange={(e) => setCustomerForm({ ...customerForm, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الاسم بالعرية' : 'Nom (Arabe)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.nameAr || ''}
                      onChange={(e) => setCustomerForm({ ...customerForm, nameAr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الاسم بالفرنسية' : 'Nom (Français)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.nameFr || ''}
                      onChange={(e) => setCustomerForm({ ...customerForm, nameFr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'المدينة (بالعربية)' : 'Ville (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={customerForm.cityAr || ''}
                      onChange={(e) => setCustomerForm({ ...customerForm, cityAr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'المدينة (بالفرنسية)' : 'Ville (Français)'}
                    </label>
                    <input
                      type="text"
                      value={customerForm.cityFr || ''}
                      onChange={(e) => setCustomerForm({ ...customerForm, cityFr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={customerForm.email || ''}
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'رقم الهاتف' : 'Téléphone'}
                    </label>
                    <input
                      type="text"
                      value={customerForm.phone || ''}
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'ميزانية الاقتناء (درهم)' : 'Budget (MAD)'}
                    </label>
                    <input
                      type="number"
                      value={customerForm.budgetMAD || 50000}
                      onChange={(e) => setCustomerForm({ ...customerForm, budgetMAD: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'إجمالي المشتريات (درهم)' : 'Achats Totaux (MAD)'}
                    </label>
                    <input
                      type="number"
                      value={customerForm.totalPurchasesMAD || 0}
                      onChange={(e) => setCustomerForm({ ...customerForm, totalPurchasesMAD: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'الوسوم / الفئة (مفصولة بفواصل)' : 'Tags / Catégorie (séparés par des virgules)'}
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(customerForm.tags) ? customerForm.tags.join(', ') : (customerForm.tags || '')}
                    onChange={(e) => setCustomerForm({ ...customerForm, tags: e.target.value as any })}
                    placeholder="مقتني VIP, معاصر, مهتم باللوحات الزيتية"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? 'ملاحظات وتفضيلات المقتني' : 'Notes & Préférences'}
                  </label>
                  <textarea
                    rows={2}
                    value={customerForm.notesAr || ''}
                    onChange={(e) => setCustomerForm({ ...customerForm, notesAr: e.target.value, notesFr: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomerModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
                  >
                    {isAr ? 'حفظ البيانات' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- EXHIBITIONS MODULE ---
  if (type === 'exhibitions') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {getTranslation(lang, 'exhibitionsManagement')}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'تنظيم المعارض الفنية الموسمية، توزيع اللوحات، وتتبع الإيرادات' : 'Organisation des expositions d’art saisonnières et suivi des ventes'}
            </p>
          </div>

          {userRole === 'admin' && (
            <button
              onClick={handleOpenAddExhibition}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(lang, 'addExhibition')}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((exh) => (
            <div
              key={exh.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col relative group"
            >
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <img src={exh.coverImage} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 rtl:left-3 rtl:right-auto px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                  {exh.status.toUpperCase()}
                </span>

                {userRole === 'admin' && (
                  <div className="absolute bottom-3 right-3 rtl:left-3 rtl:right-auto flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditExhibition(exh)}
                      className="p-2 bg-white/90 text-slate-800 hover:bg-white rounded-full shadow transition-colors"
                      title={isAr ? 'تعديل' : 'Éditer'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteExhibition && (
                      <button
                        onClick={() => {
                          if (confirm(isAr ? 'هل أنت تأكد من حذف هذا المعرض؟' : 'Voulez-vous واقعاً حذف هذا المعرض؟')) {
                            onDeleteExhibition(exh.id);
                          }
                        }}
                        className="p-2 bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white rounded-full shadow transition-colors"
                        title={isAr ? 'حذف' : 'Supprimer'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAr ? exh.titleAr : exh.titleFr}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {isAr ? exh.locationAr : exh.locationFr}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span>{getTranslation(lang, 'dates')}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{exh.startDate} → {exh.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{getTranslation(lang, 'totalWorks')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{exh.artworksCount} {isAr ? 'لوحة' : 'toiles'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EXHIBITION MODAL */}
        {isExhibitionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingExhibition
                    ? (isAr ? 'تعديل بيانات المعرض' : 'Modifier l’exposition')
                    : (isAr ? 'إضافة معرض جديد' : 'Ajouter une nouvelle exposition')}
                </h3>
                <button
                  onClick={() => setIsExhibitionModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExhibitionSubmit} className="space-y-4 text-xs">
                {/* Cover upload / preview */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isAr ? 'صورة غلاف المعرض' : 'Image de couverture'}
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={exhibitionForm.coverImage || 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-20 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setExhibitionForm(prev => ({ ...prev, coverImage: url })))}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={exhibitionForm.coverImage || ''}
                        onChange={(e) => setExhibitionForm({ ...exhibitionForm, coverImage: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'عنوان المعرض (بالعربية)' : 'Titre (Arabe)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={exhibitionForm.titleAr || ''}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, titleAr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'عنوان المعرض (بالفرنسية)' : 'Titre (Français)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={exhibitionForm.titleFr || ''}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, titleFr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الموقع (بالعربية)' : 'Lieu (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={exhibitionForm.locationAr || ''}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, locationAr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الموقع (بالفرنسية)' : 'Lieu (Français)'}
                    </label>
                    <input
                      type="text"
                      value={exhibitionForm.locationFr || ''}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, locationFr: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'تاريخ البداية' : 'Date de début'}
                    </label>
                    <input
                      type="date"
                      value={exhibitionForm.startDate || ''}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, startDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'تاريخ النهاية' : 'Date de fin'}
                    </label>
                    <input
                      type="date"
                      value={exhibitionForm.endDate || ''}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, endDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'الحالة' : 'Statut'}
                    </label>
                    <select
                      value={exhibitionForm.status || 'upcoming'}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, status: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                    >
                      <option value="upcoming">{isAr ? 'قادم (Upcoming)' : 'À venir'}</option>
                      <option value="active">{isAr ? 'جاري الآن (Active)' : 'En cours'}</option>
                      <option value="ended">{isAr ? 'منتهي (Ended)' : 'Terminé'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? 'عدد الأعمال المشاركة' : 'Nombre d’œuvres'}
                    </label>
                    <input
                      type="number"
                      value={exhibitionForm.artworksCount || 0}
                      onChange={(e) => setExhibitionForm({ ...exhibitionForm, artworksCount: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExhibitionModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
                  >
                    {isAr ? 'حفظ البيانات' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Settings view fallback
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <h2 className="text-xl font-black text-slate-900 dark:text-white">
        {getTranslation(lang, 'navSettings')}
      </h2>

      <div className="space-y-4 text-xs max-w-xl">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-100 block">
            {getTranslation(lang, 'galleryTitle')}
          </label>
          <input
            type="text"
            readOnly
            value={isAr ? 'معرض الفن الراقي - Casablanca' : 'Galerie d’Art Élégante - Casablanca'}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-100 block">
            {getTranslation(lang, 'currencySetting')}
          </label>
          <input
            type="text"
            readOnly
            value="MAD - الدرهم المغربي (Moroccan Dirham)"
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};
