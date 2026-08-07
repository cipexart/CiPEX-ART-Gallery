import React, { useState } from 'react';
import { 
  Truck, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Box, 
  Calendar, 
  User, 
  X, 
  Upload, 
  Edit,
  DollarSign
} from 'lucide-react';
import { ShippingOrder, Artwork, Customer, Language } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface ShippingViewProps {
  shippingOrders: ShippingOrder[];
  artworks: Artwork[];
  customers: Customer[];
  lang: Language;
  onAddShippingOrder: (order: ShippingOrder) => void;
  onUpdateShippingOrder: (order: ShippingOrder) => void;
  onUpdateShippingStatus: (orderId: string, newStatus: ShippingOrder['status']) => void;
}

export const ShippingView: React.FC<ShippingViewProps> = ({
  shippingOrders,
  artworks,
  customers,
  lang,
  onAddShippingOrder,
  onUpdateShippingOrder,
  onUpdateShippingStatus
}) => {
  const isAr = lang === 'ar';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ShippingOrder | null>(null);

  // Form State
  const [artworkId, setArtworkId] = useState(artworks[0]?.id || '');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [carrier, setCarrier] = useState('DHL Express Art Special Cargo');
  const [trackingNumber, setTrackingNumber] = useState(`DHL-MA-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [originCity, setOriginCity] = useState('الدار البيضاء');
  const [destinationCity, setDestinationCity] = useState('الرباط');
  const [destinationAddress, setDestinationAddress] = useState('حي الرياض، شارع النخيل، الرباط');
  const [status, setStatus] = useState<ShippingOrder['status']>('in_transit');
  const [shippingCostMAD, setShippingCostMAD] = useState(3000);
  const [insuranceValueMAD, setInsuranceValueMAD] = useState(70000);
  const [crateType, setCrateType] = useState('صندوق خشبي مصفح بحماية حرارية ومضاد الاهتزاز');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('تم إجراء فحص الجودة وتوثيق إيصال شهادة الأصالة بالصندوق.');
  const [artworkImage, setArtworkImage] = useState(artworks[0]?.primaryImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80');

  const filteredOrders = shippingOrders.filter((ord) => {
    const matchesStatus = filterStatus === 'all' || ord.status === filterStatus;
    const matchesSearch = 
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.artworkTitleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingOrder(null);
    const selectedArt = artworks[0];
    const selectedCust = customers[0];
    setArtworkId(selectedArt?.id || '');
    setCustomerId(selectedCust?.id || '');
    setCarrier('DHL Express Art Special Cargo');
    setTrackingNumber(`DHL-MA-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setOriginCity('الدار البيضاء');
    setDestinationCity('الرباط');
    setDestinationAddress('حي الرياض، شارع النخيل، الرباط');
    setStatus('in_transit');
    setShippingCostMAD(3000);
    setInsuranceValueMAD(selectedArt ? selectedArt.insuranceValueMAD : 70000);
    setCrateType('صندوق خشبي مصفح بحماية حرارية ومضاد الاهتزاز');
    setDepartureDate(new Date().toISOString().split('T')[0]);
    setEstimatedDeliveryDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setNotes('تم إجراء فحص الجودة وتوثيق إيصال شهادة الأصالة بالصندوق.');
    setArtworkImage(selectedArt?.primaryImage || '');
    setIsOrderModalOpen(true);
  };

  const handleOpenEdit = (ord: ShippingOrder) => {
    setEditingOrder(ord);
    setArtworkId(ord.artworkId);
    setCustomerId(ord.customerId);
    setCarrier(ord.carrier);
    setTrackingNumber(ord.trackingNumber);
    setOriginCity(ord.originCity);
    setDestinationCity(ord.destinationCity);
    setDestinationAddress(ord.destinationAddress);
    setStatus(ord.status);
    setShippingCostMAD(ord.shippingCostMAD);
    setInsuranceValueMAD(ord.insuranceValueMAD);
    setCrateType(ord.crateType);
    setDepartureDate(ord.departureDate);
    setEstimatedDeliveryDate(ord.estimatedDeliveryDate);
    setNotes(ord.notes);
    setArtworkImage(ord.artworkImage);
    setIsOrderModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setArtworkImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedArt = artworks.find(a => a.id === artworkId);
    const selectedCust = customers.find(c => c.id === customerId);

    const ord: ShippingOrder = {
      id: editingOrder ? editingOrder.id : `ship-${Date.now()}`,
      orderNumber: editingOrder ? editingOrder.orderNumber : `SHP-2024-${Math.floor(800 + Math.random() * 100)}`,
      artworkId,
      artworkTitleAr: selectedArt ? selectedArt.titleAr : 'لوحة فنية شحن',
      artworkTitleFr: selectedArt ? selectedArt.titleFr : 'Œuvre Expédition',
      artworkImage: artworkImage || (selectedArt ? selectedArt.primaryImage : ''),
      customerId,
      customerNameAr: selectedCust ? selectedCust.nameAr : 'عميل مقتني',
      customerNameFr: selectedCust ? selectedCust.nameFr : 'Client Acheteur',
      carrier,
      trackingNumber,
      originCity,
      destinationCity,
      destinationAddress,
      status,
      shippingCostMAD,
      insuranceValueMAD,
      crateType,
      departureDate,
      estimatedDeliveryDate,
      actualDeliveryDate: status === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
      notes
    };

    if (editingOrder) {
      onUpdateShippingOrder(ord);
    } else {
      onAddShippingOrder(ord);
    }
    setIsOrderModalOpen(false);
  };

  const getStatusBadge = (st: ShippingOrder['status']) => {
    switch (st) {
      case 'pending':
        return { text: isAr ? 'بانتظار التجهيز' : 'En Attente', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' };
      case 'crate_packaging':
        return { text: isAr ? 'تغليف بصندوق خاص' : 'Emballage Caisse', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      case 'in_transit':
        return { text: isAr ? 'قيد الشحن والتنقل' : 'En Transit', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' };
      case 'customs':
        return { text: isAr ? 'التخليص الجمركي' : 'Dédouanement', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' };
      case 'delivered':
        return { text: isAr ? 'تم التسليم بنجاح' : 'Livré', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
    }
  };

  const inTransitCount = shippingOrders.filter(o => o.status === 'in_transit').length;
  const deliveredCount = shippingOrders.filter(o => o.status === 'delivered').length;
  const totalShippingCost = shippingOrders.reduce((sum, o) => sum + o.shippingCostMAD, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {getTranslation(lang, 'navShipping')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr 
              ? 'تتبع عمليات شحن اللوحات الفنية، التغليف بالصناديق الخشبية المصفحة، التغطية التأمينية وتسليم المقتنيين' 
              : 'Suivi des expéditions d’art, caisses sécurisées, assurances et livraisons'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'طلب شحن جديد' : 'Nouvelle Expédition'}</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{isAr ? 'شحنات قيد الطريق' : 'En Transit'}</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{inTransitCount} {isAr ? 'شحنة' : 'colis'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{isAr ? 'تم تسليمها للمقتني' : 'Livrées'}</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{deliveredCount} {isAr ? 'شحنة' : 'colis'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{isAr ? 'تكاليف الشحن والمؤمنة' : 'Coût d’Expédition'}</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(totalShippingCost, lang)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Orders Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="all">{isAr ? 'جميع الشحنات' : 'Toutes les Expéditions'}</option>
              <option value="pending">{isAr ? 'بانتظار التجهيز' : 'En Attente'}</option>
              <option value="crate_packaging">{isAr ? 'التغليف المصفح' : 'Emballage Caisse'}</option>
              <option value="in_transit">{isAr ? 'قيد الشحن والتنقل' : 'En Transit'}</option>
              <option value="delivered">{isAr ? 'تم التسليم' : 'Livré'}</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 left-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث برقم الشحنة، العميل، التتبع...' : 'Rechercher N° ou client...'}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs rounded-xl pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 border border-transparent focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((ord) => {
            const st = getStatusBadge(ord.status);
            return (
              <div
                key={ord.id}
                className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600">
                    {ord.orderNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${st.color}`}>
                    {st.text}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={ord.artworkImage} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {isAr ? ord.artworkTitleAr : ord.artworkTitleFr}
                    </h4>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                      {isAr ? 'المقتني:' : 'Client:'} {isAr ? ord.customerNameAr : ord.customerNameFr}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      <MapPin className="w-3 h-3 inline text-slate-400 ltr:mr-1 rtl:ml-1" />
                      {ord.destinationCity} - {ord.destinationAddress}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'شركة الشحن' : 'Transporteur'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ord.carrier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isAr ? 'رقم التتبع' : 'N° Suivi'}</span>
                    <span className="font-mono font-bold text-indigo-600">{ord.trackingNumber}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block">{isAr ? 'مواصفات التغليف الخشبي' : 'Caisse Sécurisée'}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{ord.crateType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isAr ? 'تاريخ الوصول المتوقع' : 'Livraison Estimée'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{ord.estimatedDeliveryDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateShippingStatus(ord.id, e.target.value as any)}
                      className="text-xs font-bold p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                    >
                      <option value="pending">{isAr ? 'تجهيز' : 'En attente'}</option>
                      <option value="crate_packaging">{isAr ? 'تغليف مصفح' : 'Emballage'}</option>
                      <option value="in_transit">{isAr ? 'في الطريق' : 'Transit'}</option>
                      <option value="delivered">{isAr ? 'تم التسليم' : 'Livré'}</option>
                    </select>

                    <button
                      onClick={() => handleOpenEdit(ord)}
                      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                      title={getTranslation(lang, 'edit')}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Shipping Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingOrder 
                  ? (isAr ? 'تعديل بيانات طلب الشحن' : 'Modifier Expédition')
                  : (isAr ? 'إنشاء أمر شحن جديد' : 'Nouvelle Expédition')}
              </h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اللوحة المراد شحنها' : 'Œuvre à Expédier'}</label>
                  <select
                    value={artworkId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setArtworkId(id);
                      const a = artworks.find(x => x.id === id);
                      if (a) setArtworkImage(a.primaryImage);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    {artworks.map((a) => (
                      <option key={a.id} value={a.id}>
                        {isAr ? a.titleAr : a.titleFr} ({a.artworkNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">{isAr ? 'العميل المقتني' : 'Client Acheteur'}</label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.nameAr : c.nameFr} ({isAr ? c.cityAr : c.cityFr})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'شركة الشحن المختصة' : 'Transporteur Spécialisé'}</label>
                  <input
                    type="text"
                    required
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رقم التتبع' : 'N° de Suivi'}</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'مدينة الاستلام' : 'Ville de Destination'}</label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{isAr ? 'حالة الشحن' : 'Statut d’Expédition'}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  >
                    <option value="pending">{isAr ? 'بانتظار التجهيز' : 'En attente'}</option>
                    <option value="crate_packaging">{isAr ? 'التغليف بالصندوق المصفح' : 'Emballage Caisse'}</option>
                    <option value="in_transit">{isAr ? 'قيد الشحن والتنقل' : 'En Transit'}</option>
                    <option value="customs">{isAr ? 'التخليص الجمركي' : 'Dédouanement'}</option>
                    <option value="delivered">{isAr ? 'تم التسليم' : 'Livré'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'العنوان الكامل للتسليم' : 'Adresse Complète de Livraison'}</label>
                <input
                  type="text"
                  required
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'مواصفات الصندوق الخشبي الحافظ' : 'Spécifications de la Caisse Sécurisée'}</label>
                <input
                  type="text"
                  value={crateType}
                  onChange={(e) => setCrateType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'تكلفة الشحن (MAD د.م.)' : 'Frais d’Expédition (MAD)'}</label>
                  <input
                    type="number"
                    value={shippingCostMAD}
                    onChange={(e) => setShippingCostMAD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{isAr ? 'القيمة المؤمنة (MAD د.م.)' : 'Valeur Assurée (MAD)'}</label>
                  <input
                    type="number"
                    value={insuranceValueMAD}
                    onChange={(e) => setInsuranceValueMAD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Upload image for artwork / package */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-bold">{isAr ? 'صورة الشحنة / اللوحة (رفع أو اختيار)' : 'Image du colis / de l’œuvre'}</label>
                <div className="flex items-center gap-3">
                  <img src={artworkImage} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'ملاحظات الشحن والسلامة' : 'Notes & Instructions'}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
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
    </div>
  );
};
