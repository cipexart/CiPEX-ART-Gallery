import { Artwork, Artist, Customer, Deal, Offer, Invoice, Exhibition, ActivityNotification, SyncLog, InventoryLocation, ShippingOrder } from '../types';

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-1',
    nameAr: 'محمد الجالي',
    nameFr: 'Mohamed El Gali',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    countryAr: 'المغرب',
    countryFr: 'Maroc',
    bioAr: 'الفنان التشكيلي المغربي المعاصر محمد الجالي. معروضاته حصرية في معرض CiPEX، تتميز بأسلوبه التجريدي الفريد الذي يجمع بين أصالة الأصباغ الطبيعية للأطلس والحداثة البصرية المعاصرة.',
    bioFr: 'L’artiste peintre contemporain marocain Mohamed El Gali. Ses œuvres sont exclusivement gérées par la galerie CiPEX, combinant pigments naturels de l’Atlas et modernité visuelle.',
    commissionRate: 15,
    artworksCount: 0,
    totalSalesMAD: 0,
    email: 'contact@m-elgali.ma',
    phone: '0661889900',
    contractStatus: 'active'
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [];

export const INITIAL_INVENTORY: InventoryLocation[] = [
  {
    id: 'wh-1',
    nameAr: 'صالة المعرض الرئيسية - الدار البيضاء',
    nameFr: 'Galerie Principale - Casablanca',
    cityAr: 'الدار البيضاء',
    cityFr: 'Casablanca',
    addressAr: 'شارع المسيرة الخضراء، المعاريف، الدار البيضاء',
    addressFr: 'Boulevard Al Massira Al Khadra, Maarif, Casablanca',
    managerName: 'أمين التازي',
    phone: '0522334455',
    artworksCount: 0,
    capacity: 30,
    type: 'gallery'
  },
  {
    id: 'wh-2',
    nameAr: 'المستودع الرئيسي لحفظ الأعمال - الرباط',
    nameFr: 'Entrepôt Central de Stockage - Rabat',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    addressAr: 'المنطقة الصناعية أكدال، الرباط',
    addressFr: 'Zone Industrielle Agdal, Rabat',
    managerName: 'حسن العلمي',
    phone: '0537667788',
    artworksCount: 0,
    capacity: 50,
    type: 'warehouse'
  }
];

export const INITIAL_SHIPPING: ShippingOrder[] = [];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_DEALS: Deal[] = [];

export const INITIAL_OFFERS: Offer[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_EXHIBITIONS: Exhibition[] = [];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [];

export const INITIAL_SYNC_LOGS: SyncLog[] = [];
