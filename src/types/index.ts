export type UserRole = 'admin' | 'visitor';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  bio?: string;
  createdAt?: string;
  isVerified?: boolean;
  preferredCategory?: string;
}

export type Language = 'ar' | 'fr';
export type ThemeMode = 'light' | 'dark';

export type ArtworkStatus = 
  | 'available' 
  | 'reserved' 
  | 'sold' 
  | 'loan' 
  | 'exhibition' 
  | 'storage' 
  | 'damaged' 
  | 'archived';

export interface Artwork {
  id: string;
  uuid: string;
  artworkNumber: string;
  titleAr: string;
  titleFr: string;
  artistId: string;
  artistNameAr: string;
  artistNameFr: string;
  year: number;
  mediumAr: string;
  mediumFr: string;
  materialAr: string;
  materialFr: string;
  dimensions: {
    height: number;
    width: number;
    depth?: number;
    unit: 'cm';
  };
  weightKg?: number;
  styleAr: string;
  styleFr: string;
  categoryAr: string;
  categoryFr: string;
  purchaseCostMAD: number;
  sellingPriceMAD: number;
  estimatedValueMAD: number;
  insuranceValueMAD: number;
  commissionRate: number; // e.g. 25 (%)
  descriptionAr: string;
  descriptionFr: string;
  status: ArtworkStatus;
  primaryImage: string;
  galleryImages: string[];
  location: string;
  warehouseId?: string;
  qrCodeUrl?: string;
  barcode?: string;
  edition?: string;
  isUnique: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  nameAr: string;
  nameFr: string;
  avatar: string;
  countryAr: string;
  countryFr: string;
  bioAr: string;
  bioFr: string;
  commissionRate: number; // percentage
  artworksCount: number;
  totalSalesMAD: number;
  email: string;
  phone: string;
  contractStatus: 'active' | 'pending' | 'expired';
}

export interface Customer {
  id: string;
  nameAr: string;
  nameFr: string;
  avatar: string;
  cityAr: string;
  cityFr: string;
  countryAr: string;
  countryFr: string;
  email: string;
  phone: string;
  totalPurchasesMAD: number;
  purchasesCount: number;
  favoriteArtists: string[];
  favoriteStyles: string[];
  budgetMAD: number;
  lastContactDate: string;
  tags: string[];
  notesAr: string;
  notesFr: string;
}

export type PipelineStage = 
  | 'lead' 
  | 'interested' 
  | 'offer_sent' 
  | 'negotiation' 
  | 'reserved' 
  | 'invoice' 
  | 'paid' 
  | 'shipping' 
  | 'delivered' 
  | 'closed';

export interface Deal {
  id: string;
  dealNumber: string;
  customerId: string;
  customerNameAr: string;
  customerNameFr: string;
  artworkId: string;
  artworkTitleAr: string;
  artworkTitleFr: string;
  artworkImage: string;
  stage: PipelineStage;
  amountMAD: number;
  probability: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfferItem {
  artworkId: string;
  artworkTitleAr: string;
  artworkTitleFr: string;
  originalPriceMAD: number;
  discountPercent: number;
  finalPriceMAD: number;
  artworkImage: string;
}

export interface Offer {
  id: string;
  offerNumber: string;
  customerId: string;
  customerNameAr: string;
  customerNameFr: string;
  items: OfferItem[];
  subtotalMAD: number;
  discountMAD: number;
  taxMAD: number; // 15% VAT
  totalMAD: number;
  validUntil: string;
  customMessageAr: string;
  customMessageFr: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'quotation' | 'invoice' | 'receipt' | 'refund' | 'credit_note';
  customerId: string;
  customerNameAr: string;
  customerNameFr: string;
  artworkTitlesAr: string[];
  artworkTitlesFr: string[];
  totalMAD: number;
  paidMAD: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
  paymentMethod?: 'cash' | 'transfer' | 'cheque' | 'card' | 'installments';
}

export interface Exhibition {
  id: string;
  titleAr: string;
  titleFr: string;
  locationAr: string;
  locationFr: string;
  startDate: string;
  endDate: string;
  artworksCount: number;
  coverImage: string;
  status: 'upcoming' | 'active' | 'completed';
  revenueMAD: number;
  descriptionAr: string;
  descriptionFr: string;
}

export interface InventoryLocation {
  id: string;
  nameAr: string;
  nameFr: string;
  cityAr: string;
  cityFr: string;
  addressAr: string;
  addressFr: string;
  managerName: string;
  phone: string;
  artworksCount: number;
  capacity: number;
  type: 'gallery' | 'warehouse' | 'museum' | 'transit';
}

export interface ShippingOrder {
  id: string;
  orderNumber: string;
  artworkId: string;
  artworkTitleAr: string;
  artworkTitleFr: string;
  artworkImage: string;
  customerId: string;
  customerNameAr: string;
  customerNameFr: string;
  carrier: string; // e.g. DHL Express Art, CTM Premium, Specialized Courier
  trackingNumber: string;
  originCity: string;
  destinationCity: string;
  destinationAddress: string;
  status: 'pending' | 'crate_packaging' | 'in_transit' | 'customs' | 'delivered';
  shippingCostMAD: number;
  insuranceValueMAD: number;
  crateType: string; // e.g. "صندوق خشبي مصفح ومقاوم للرطوبة"
  departureDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  notes: string;
}

export interface MovementLog {
  id: string;
  artworkId: string;
  artworkTitleAr: string;
  artworkTitleFr: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  handledBy: string;
  notes: string;
}

export interface SyncLog {
  id: string;
  action: string;
  entity: string;
  status: 'synced' | 'pending' | 'syncing' | 'error';
  timestamp: string;
  details: string;
}

export interface ActivityNotification {
  id: string;
  type: 'sale' | 'offer' | 'exhibition' | 'payment' | 'sync';
  titleAr: string;
  titleFr: string;
  time: string;
  read: boolean;
}
