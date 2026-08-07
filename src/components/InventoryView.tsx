import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Building2, 
  Plus, 
  Search, 
  ArrowRightLeft, 
  Edit, 
  Trash2, 
  QrCode, 
  Upload, 
  X, 
  CheckCircle2, 
  Phone, 
  User, 
  Layers
} from 'lucide-react';
import { InventoryLocation, Artwork, MovementLog, Language } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface InventoryViewProps {
  locations: InventoryLocation[];
  artworks: Artwork[];
  lang: Language;
  onAddLocation: (location: InventoryLocation) => void;
  onUpdateLocation: (location: InventoryLocation) => void;
  onTransferArtworkLocation: (artworkId: string, newLocationId: string, newLocationName: string) => void;
  onUpdateArtworkImage?: (artworkId: string, newImageUrl: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  locations,
  artworks,
  lang,
  onAddLocation,
  onUpdateLocation,
  onTransferArtworkLocation,
  onUpdateArtworkImage
}) => {
  const isAr = lang === 'ar';

  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<InventoryLocation | null>(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedArtworkToTransfer, setSelectedArtworkToTransfer] = useState<Artwork | null>(null);
  const [targetLocationId, setTargetLocationId] = useState<string>('');

  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [selectedArtworkForImage, setSelectedArtworkForImage] = useState<Artwork | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>('');

  // Location Form State
  const [locNameAr, setLocNameAr] = useState('');
  const [locNameFr, setLocNameFr] = useState('');
  const [locCityAr, setLocCityAr] = useState('');
  const [locCityFr, setLocCityFr] = useState('');
  const [locAddressAr, setLocAddressAr] = useState('');
  const [locAddressFr, setLocAddressFr] = useState('');
  const [locManager, setLocManager] = useState('');
  const [locPhone, setLocPhone] = useState('');
  const [locCapacity, setLocCapacity] = useState(30);
  const [locType, setLocType] = useState<'gallery' | 'warehouse' | 'museum' | 'transit'>('gallery');

  const filteredArtworks = artworks.filter((art) => {
    const matchesLoc = selectedLocationId === 'all' || art.warehouseId === selectedLocationId || art.location.includes(selectedLocationId);
    const matchesSearch = 
      art.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artworkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLoc && matchesSearch;
  });

  const handleOpenAddLocation = () => {
    setEditingLocation(null);
    setLocNameAr('');
    setLocNameFr('');
    setLocCityAr('الدار البيضاء');
    setLocCityFr('Casablanca');
    setLocAddressAr('');
    setLocAddressFr('');
    setLocManager('أحمد المعيدي');
    setLocPhone('+212 522 001122');
    setLocCapacity(30);
    setLocType('gallery');
    setIsLocationModalOpen(true);
  };

  const handleOpenEditLocation = (loc: InventoryLocation) => {
    setEditingLocation(loc);
    setLocNameAr(loc.nameAr);
    setLocNameFr(loc.nameFr);
    setLocCityAr(loc.cityAr);
    setLocCityFr(loc.cityFr);
    setLocAddressAr(loc.addressAr);
    setLocAddressFr(loc.addressFr);
    setLocManager(loc.managerName);
    setLocPhone(loc.phone);
    setLocCapacity(loc.capacity);
    setLocType(loc.type);
    setIsLocationModalOpen(true);
  };

  const handleSubmitLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoc: InventoryLocation = {
      id: editingLocation ? editingLocation.id : `wh-${Date.now()}`,
      nameAr: locNameAr || 'موقع جديد',
      nameFr: locNameFr || 'Nouveau Site',
      cityAr: locCityAr,
      cityFr: locCityFr,
      addressAr: locAddressAr,
      addressFr: locAddressFr,
      managerName: locManager,
      phone: locPhone,
      artworksCount: editingLocation ? editingLocation.artworksCount : 0,
      capacity: locCapacity,
      type: locType
    };

    if (editingLocation) {
      onUpdateLocation(newLoc);
    } else {
      onAddLocation(newLoc);
    }
    setIsLocationModalOpen(false);
  };

  const handleOpenTransfer = (art: Artwork) => {
    setSelectedArtworkToTransfer(art);
    setTargetLocationId(locations[0]?.id || '');
    setIsTransferModalOpen(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtworkToTransfer || !targetLocationId) return;
    const targetLoc = locations.find(l => l.id === targetLocationId);
    if (targetLoc) {
      const locName = isAr ? targetLoc.nameAr : targetLoc.nameFr;
      onTransferArtworkLocation(selectedArtworkToTransfer.id, targetLoc.id, locName);
    }
    setIsTransferModalOpen(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImageUpload = () => {
    if (selectedArtworkForImage && newImagePreview && onUpdateArtworkImage) {
      onUpdateArtworkImage(selectedArtworkForImage.id, newImagePreview);
      setIsImageUploadModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {getTranslation(lang, 'navInventory')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr 
              ? 'إدارة مواقع المخازن، صالات العرض، نقل اللوحات وتتبع حالة الحفظ والقطع الفنية للمعرض' 
              : 'Gestion des entrepôts, galeries, transferts d’œuvres et contrôle de stock'}
          </p>
        </div>

        <button
          onClick={handleOpenAddLocation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة موقع / صالة جديدة' : 'Ajouter un Emplacement'}</span>
        </button>
      </div>

      {/* Locations Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locations.map((loc) => {
          const locArtworks = artworks.filter(a => a.warehouseId === loc.id || a.location.includes(loc.cityAr) || a.location.includes(loc.cityFr));
          const actualCount = locArtworks.length;
          const percentage = Math.min(Math.round((actualCount / loc.capacity) * 100), 100);

          return (
            <div
              key={loc.id}
              onClick={() => setSelectedLocationId(selectedLocationId === loc.id ? 'all' : loc.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedLocationId === loc.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/30 ring-2 ring-indigo-400'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedLocationId === loc.id
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {loc.type.toUpperCase()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditLocation(loc);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    selectedLocationId === loc.id ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
                  }`}
                  title={getTranslation(lang, 'edit')}
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-sm line-clamp-1">{isAr ? loc.nameAr : loc.nameFr}</h3>
              <p className={`text-xs mt-0.5 ${selectedLocationId === loc.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                {isAr ? loc.cityAr : loc.cityFr}
              </p>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{isAr ? 'نسبة الاستيعاب:' : 'Capacité:'}</span>
                  <span>{actualCount} / {loc.capacity} {isAr ? 'لوحة' : 'toiles'}</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${selectedLocationId === loc.id ? 'bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <div
                    className={`h-full transition-all duration-500 ${selectedLocationId === loc.id ? 'bg-amber-300' : 'bg-indigo-600'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Artworks List in Inventory */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isAr ? 'القطع الفنية المخزونة' : 'Œuvres en Stock'}
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredArtworks.length} {isAr ? 'لوحة' : 'toiles'}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 left-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في المخزن...' : 'Rechercher stock...'}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 border border-transparent focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40">
                <th className="p-3.5 rounded-r-xl rtl:rounded-r-xl ltr:rounded-l-xl">{isAr ? 'اللوحة' : 'Œuvre'}</th>
                <th className="p-3.5">{isAr ? 'الموقع الحالي' : 'Emplacement'}</th>
                <th className="p-3.5">{isAr ? 'الحالة' : 'Statut'}</th>
                <th className="p-3.5">{isAr ? 'الأبعاد والوزن' : 'Dimensions & Poids'}</th>
                <th className="p-3.5">{isAr ? 'القيمة' : 'Valeur (MAD)'}</th>
                <th className="p-3.5 rounded-l-xl rtl:rounded-l-xl ltr:rounded-r-xl text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredArtworks.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative group/img w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        <img src={art.primaryImage} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            setSelectedArtworkForImage(art);
                            setNewImagePreview(art.primaryImage);
                            setIsImageUploadModalOpen(true);
                          }}
                          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                          title={isAr ? 'تحديث صورة اللوحة' : 'Modifier Image'}
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {isAr ? art.titleAr : art.titleFr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {art.artworkNumber} • {art.year}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{art.location}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {art.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    <div>{art.dimensions.height}×{art.dimensions.width} cm</div>
                    <div className="text-[10px] text-slate-400">{art.weightKg || 4} kg</div>
                  </td>

                  <td className="p-3.5 font-black text-slate-900 dark:text-white">
                    {formatCurrency(art.sellingPriceMAD, lang)}
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenTransfer(art)}
                        className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>{isAr ? 'نقل موقع' : 'Transférer'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedArtworkForImage(art);
                          setNewImagePreview(art.primaryImage);
                          setIsImageUploadModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                        title={isAr ? 'رفع صورة جديدة' : 'Changer image'}
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingLocation 
                  ? (isAr ? 'تعديل بيانات الموقع' : 'Modifier L’Emplacement') 
                  : (isAr ? 'إضافة موقع / صالة جديدة' : 'Nouveau Emplacement')}
              </h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLocation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم الموقع (عربي)' : 'Nom (Arabe)'}</label>
                  <input
                    type="text"
                    required
                    value={locNameAr}
                    onChange={(e) => setLocNameAr(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم الموقع (فرنسي)' : 'Nom (Français)'}</label>
                  <input
                    type="text"
                    required
                    value={locNameFr}
                    onChange={(e) => setLocNameFr(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'المدينة (عربي)' : 'Ville (Arabe)'}</label>
                  <input
                    type="text"
                    value={locCityAr}
                    onChange={(e) => setLocCityAr(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'المدينة (فرنسي)' : 'Ville (Français)'}</label>
                  <input
                    type="text"
                    value={locCityFr}
                    onChange={(e) => setLocCityFr(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'العنوان التفصيلي' : 'Adresse Détaillée'}</label>
                <input
                  type="text"
                  value={locAddressAr}
                  onChange={(e) => setLocAddressAr(e.target.value)}
                  placeholder="شارع المسيرة، حي أنفا، الدار البيضاء"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم المسؤول' : 'Responsable'}</label>
                  <input
                    type="text"
                    value={locManager}
                    onChange={(e) => setLocManager(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'الهاتف' : 'Téléphone'}</label>
                  <input
                    type="text"
                    value={locPhone}
                    onChange={(e) => setLocPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'السعة الاستيعابية (لوحة)' : 'Capacité (toiles)'}</label>
                  <input
                    type="number"
                    value={locCapacity}
                    onChange={(e) => setLocCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'نوع الموقع' : 'Type D’Emplacement'}</label>
                  <select
                    value={locType}
                    onChange={(e) => setLocType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="gallery">{isAr ? 'صالة عرض' : 'Galerie'}</option>
                    <option value="warehouse">{isAr ? 'مستودع حفظ' : 'Entrepôt'}</option>
                    <option value="museum">{isAr ? 'متحف / إعارة' : 'Musée'}</option>
                    <option value="transit">{isAr ? 'مركز شحن' : 'Transit'}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  {getTranslation(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  {getTranslation(lang, 'save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location Transfer Modal */}
      {isTransferModalOpen && selectedArtworkToTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'نقل موقع اللوحة' : 'Transférer l’Œuvre'}
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center gap-3">
              <img src={selectedArtworkToTransfer.primaryImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-xs">{isAr ? selectedArtworkToTransfer.titleAr : selectedArtworkToTransfer.titleFr}</p>
                <p className="text-[10px] text-slate-400">{selectedArtworkToTransfer.location}</p>
              </div>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">{isAr ? 'الموقع الجديد' : 'Nouvel Emplacement'}</label>
                <select
                  value={targetLocationId}
                  onChange={(e) => setTargetLocationId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none font-semibold"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {isAr ? loc.nameAr : loc.nameFr} ({isAr ? loc.cityAr : loc.cityFr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  {getTranslation(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  {isAr ? 'تأكيد النقل' : 'Confirmer Transfert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageUploadModalOpen && selectedArtworkForImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'رفع وصورة جديدة للعمل الفني' : 'Téléverser l’image de l’œuvre'}
              </h3>
              <button onClick={() => setIsImageUploadModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                {newImagePreview ? (
                  <img src={newImagePreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 text-center space-y-2">
                <Upload className="w-6 h-6 text-indigo-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {isAr ? 'اختر ملف صورة من جهازك' : 'Choisir une image depuis votre appareil'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{isAr ? 'أو أدخل رابط الصورة (URL)' : 'Ou Entrez l’URL de l’image'}</label>
                <input
                  type="text"
                  value={newImagePreview}
                  onChange={(e) => setNewImagePreview(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsImageUploadModalOpen(false)}
                className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800"
              >
                {getTranslation(lang, 'cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveImageUpload}
                className="px-4 py-2 text-xs rounded-xl bg-indigo-600 text-white font-bold"
              >
                {getTranslation(lang, 'save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
