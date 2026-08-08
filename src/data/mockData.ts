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
    artworksCount: 24,
    totalSalesMAD: 1250000,
    email: 'contact@m-elgali.ma',
    phone: '0661889900',
    contractStatus: 'active'
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'artwk-1',
    uuid: 'ART-2024-001',
    artworkNumber: 'ART-2024-001',
    titleAr: 'غروب في ضفاف أبي رقراق',
    titleFr: 'Coucher de Soleil sur Bouregreg',
    artistId: 'art-1',
    artistNameAr: 'محمد الجالي',
    artistNameFr: 'Mohamed El Gali',
    year: 2024,
    mediumAr: 'زيت وأصباغ طبيعية على قماش',
    mediumFr: 'Huile et pigments naturels sur toile',
    materialAr: 'قماش كتان وفاخر',
    materialFr: 'Toile en lin haut de gamme',
    dimensions: { height: 100, width: 140, unit: 'cm' },
    weightKg: 5.5,
    styleAr: 'تجريدي معاصر',
    styleFr: 'Abstrait Contemporain',
    categoryAr: 'لوحات زيتية',
    categoryFr: 'Peinture à l’huile',
    purchaseCostMAD: 30000,
    sellingPriceMAD: 65000,
    estimatedValueMAD: 70000,
    insuranceValueMAD: 75000,
    commissionRate: 15,
    descriptionAr: 'عمل فني رائد للفنان محمد الجالي يجسد انعكاس أشعة الشمس الغاربة على مياه نهر أبي رقراق بلمسات تجريدية دافئة.',
    descriptionFr: 'Une œuvre majeure de Mohamed El Gali capturant les reflets du soleil couchant sur le Bouregreg.',
    status: 'available',
    primaryImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'صالة العرض الرئيسية - الدار البيضاء',
    warehouseId: 'wh-1',
    isUnique: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-05-10'
  },
  {
    id: 'artwk-2',
    uuid: 'ART-2024-002',
    artworkNumber: 'ART-2024-002',
    titleAr: 'أصداء الأطلس الكبير',
    titleFr: 'Échos du Haut-Atlas',
    artistId: 'art-1',
    artistNameAr: 'محمد الجالي',
    artistNameFr: 'Mohamed El Gali',
    year: 2023,
    mediumAr: 'أكريليك وأنسجة خشبية',
    mediumFr: 'Acrylique et texture bois',
    materialAr: 'خشب أرز معالج',
    materialFr: 'Bois de cèdre traité',
    dimensions: { height: 120, width: 120, unit: 'cm' },
    weightKg: 8,
    styleAr: 'تجريدي تعبيري',
    styleFr: 'Abstrait Expressif',
    categoryAr: 'فن الأكريليك',
    categoryFr: 'Peinture Acrylique',
    purchaseCostMAD: 25000,
    sellingPriceMAD: 55000,
    estimatedValueMAD: 60000,
    insuranceValueMAD: 65000,
    commissionRate: 15,
    descriptionAr: 'لوحة ذات أبعاد ملموسة تعبر عن صمود جبال الأطلس وشموخ القمم البربرية العريقة بقلم الفنان محمد الجالي.',
    descriptionFr: 'Toile en relief exprimant la majesté des montagnes de l’Atlas par l’artiste Mohamed El Gali.',
    status: 'available',
    primaryImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'مستودع المعرض - الرباط',
    warehouseId: 'wh-2',
    isUnique: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-05-12'
  },
  {
    id: 'artwk-3',
    uuid: 'ART-2024-003',
    artworkNumber: 'ART-2024-003',
    titleAr: 'إيقاعات نيليّة',
    titleFr: 'Rythmes Indigo',
    artistId: 'art-1',
    artistNameAr: 'محمد الجالي',
    artistNameFr: 'Mohamed El Gali',
    year: 2024,
    mediumAr: 'حبر وزيت على ورق مقوى',
    mediumFr: 'Encre et huile sur papier marouflé',
    materialAr: 'ورق يدوي عتيق',
    materialFr: 'Papier artisanal vieilli',
    dimensions: { height: 90, width: 70, unit: 'cm' },
    weightKg: 3,
    styleAr: 'تجريدي حروفي',
    styleFr: 'Abstraction Calligraphique',
    categoryAr: 'تقنيات مختلطة',
    categoryFr: 'Techniques mixtes',
    purchaseCostMAD: 22000,
    sellingPriceMAD: 48000,
    estimatedValueMAD: 50000,
    insuranceValueMAD: 55000,
    commissionRate: 15,
    descriptionAr: 'تداخلات اللون الأزرق النيلي النادر المستوحى من مدينة شفشاون مع أشكال تجريدية هندسية متوازنة.',
    descriptionFr: 'Mélange de bleu indigo inspiré de Chefchaouen avec des formes géométriques abstraites.',
    status: 'reserved',
    primaryImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'صالة العرض - مراكش',
    warehouseId: 'wh-3',
    isUnique: true,
    createdAt: '2024-02-20',
    updatedAt: '2024-05-15'
  }
];

export const INITIAL_INVENTORY: InventoryLocation[] = [
  {
    id: 'wh-1',
    nameAr: 'صالة العرض الرئيسية - CiPEX أنفا',
    nameFr: 'Galerie Principale CiPEX Anfa',
    cityAr: 'الدار البيضاء',
    cityFr: 'Casablanca',
    addressAr: 'شارع المسيرة الخضراء، حي أنفا، الدار البيضاء',
    addressFr: 'Boulevard Massira Khadra, Anfa, Casablanca',
    managerName: 'أحمد المعيدي',
    phone: '0522334455',
    artworksCount: 12,
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
    artworksCount: 8,
    capacity: 50,
    type: 'warehouse'
  },
  {
    id: 'wh-3',
    nameAr: 'صالة المعارض الخاصة - مراكش النخيل',
    nameFr: 'Showroom VIP - Marrakech Palmeraie',
    cityAr: 'مراكش',
    cityFr: 'Marrakech',
    addressAr: 'طريق النخيل، مراكش',
    addressFr: 'Route de la Palmeraie, Marrakech',
    managerName: 'فاطمة الزهراء',
    phone: '0524112233',
    artworksCount: 5,
    capacity: 20,
    type: 'gallery'
  },
  {
    id: 'wh-4',
    nameAr: 'مخزن الشحن والتجهيز - طنجة المتوسط',
    nameFr: 'Dépôt d’Expédition - Tanger Med',
    cityAr: 'طنجة',
    cityFr: 'Tanger',
    addressAr: 'حي مالاباطا، طنجة',
    addressFr: 'Quartier Malabata, Tanger',
    managerName: 'طارق ابن زياد',
    phone: '0539998877',
    artworksCount: 3,
    capacity: 25,
    type: 'transit'
  }
];

export const INITIAL_SHIPPING: ShippingOrder[] = [
  {
    id: 'ship-1',
    orderNumber: 'SHP-2024-801',
    artworkId: 'artwk-1',
    artworkTitleAr: 'غروب في ضفاف أبي رقراق',
    artworkTitleFr: 'Coucher de Soleil sur Bouregreg',
    artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    customerId: 'cust-1',
    customerNameAr: 'أحمد العتيبي',
    customerNameFr: 'Ahmed Al-Otaibi',
    carrier: 'DHL Express Art Special Cargo',
    trackingNumber: 'DHL-MA-9928172',
    originCity: 'الدار البيضاء',
    destinationCity: 'الرباط',
    destinationAddress: 'طريق المطار، الرياض، الرباط',
    status: 'in_transit',
    shippingCostMAD: 3500,
    insuranceValueMAD: 75000,
    crateType: 'صندوق خشبي مصفح مع حماية حرارية ومضاد للصدمات',
    departureDate: '2024-05-26',
    estimatedDeliveryDate: '2024-05-29',
    notes: 'تم فحص السلامة وإرفاق شهادة الأصالة الأصلية داخل الصندوق.'
  },
  {
    id: 'ship-2',
    orderNumber: 'SHP-2024-802',
    artworkId: 'artwk-5',
    artworkTitleAr: 'الأفق الأطلسي المفتوح',
    artworkTitleFr: 'L’Horizon Atlantique Ouvert',
    artworkImage: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400&auto=format&fit=crop&q=80',
    customerId: 'cust-2',
    customerNameAr: 'نورة الفيصل',
    customerNameFr: 'Noura El Faiçal',
    carrier: 'CTM Premium Art Transport',
    trackingNumber: 'CTM-ART-44310',
    originCity: 'الدار البيضاء',
    destinationCity: 'مراكش',
    destinationAddress: 'إقامة رياض النخيل، مراكش',
    status: 'delivered',
    shippingCostMAD: 2800,
    insuranceValueMAD: 110000,
    crateType: 'صندوق ألومنيوم مبطن بالفلين المضاد الاهتزاز',
    departureDate: '2024-05-18',
    estimatedDeliveryDate: '2024-05-20',
    actualDeliveryDate: '2024-05-20',
    notes: 'تم التسليم بنجاح مع توقيع إيصال الاستلام من قبل العميل.'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    nameAr: 'أحمد العتيبي',
    nameFr: 'Ahmed Al-Otaibi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    cityAr: 'الدار البيضاء',
    cityFr: 'Casablanca',
    countryAr: 'المغرب',
    countryFr: 'Maroc',
    email: 'ahmed.otaibi@gmail.com',
    phone: '0661112233',
    totalPurchasesMAD: 120000,
    purchasesCount: 3,
    favoriteArtists: ['محمد السليم', 'علي الشهري'],
    favoriteStyles: ['تجريدي معاصر', 'خط عربي معاصر'],
    budgetMAD: 250000,
    lastContactDate: '2024-05-25',
    tags: ['مقتني مهم', 'كبار الشخصيات', 'فن تجريدي'],
    notesAr: 'مقتني مهتم باللوحات التجريدية ذات الأحجام الكبيرة للمقر الجديد.',
    notesFr: 'Collectionneur intéressé par les grandes toiles abstraites pour ses nouveaux bureaux.'
  },
  {
    id: 'cust-2',
    nameAr: 'نورة الفيصل',
    nameFr: 'Noura El Faiçal',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    cityAr: 'الرباط',
    cityFr: 'Rabat',
    countryAr: 'المغرب',
    countryFr: 'Maroc',
    email: 'noura.f@hotmail.com',
    phone: '0662334455',
    totalPurchasesMAD: 85500,
    purchasesCount: 2,
    favoriteArtists: ['سارة الهواري'],
    favoriteStyles: ['واقعي معاصر'],
    budgetMAD: 150000,
    lastContactDate: '2024-05-20',
    tags: ['مقتنية', 'فن واقعي'],
    notesAr: 'تفضل الأعمال الفنية الهادئة المستوحاة من الطبيعة.',
    notesFr: 'Préfère les œuvres d’art calmes inspirées de la nature.'
  },
  {
    id: 'cust-3',
    nameAr: 'خالد بن سلمان',
    nameFr: 'Khalid Ben Salmane',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    cityAr: 'مراكش',
    cityFr: 'Marrakech',
    countryAr: 'المغرب',
    countryFr: 'Maroc',
    email: 'khalid.salmane@corp.ma',
    phone: '0663556677',
    totalPurchasesMAD: 60000,
    purchasesCount: 1,
    favoriteArtists: ['علي الشهري'],
    favoriteStyles: ['حروفيات'],
    budgetMAD: 100000,
    lastContactDate: '2024-05-18',
    tags: ['مستثمر', 'شركات'],
    notesAr: 'يبحث عن قروض أعمال فنية للمعارض المؤسسية.',
    notesFr: 'Recherche des prêts d’œuvres pour des expositions d’entreprise.'
  },
  {
    id: 'cust-4',
    nameAr: 'سارة القحطاني',
    nameFr: 'Sara El Qahtani',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    cityAr: 'طنجة',
    cityFr: 'Tanger',
    countryAr: 'المغرب',
    countryFr: 'Maroc',
    email: 'sara.q@yahoo.fr',
    phone: '0664778899',
    totalPurchasesMAD: 45000,
    purchasesCount: 1,
    favoriteArtists: ['ليلى الحربي'],
    favoriteStyles: ['سريالي'],
    budgetMAD: 80000,
    lastContactDate: '2024-05-10',
    tags: ['جديد'],
    notesAr: 'تخطط لتأثيث فيلا جديدة بالفنون المعاصرة.',
    notesFr: 'Achat prévu pour meubler une nouvelle villa d’art contemporain.'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    dealNumber: 'DEAL-2024-101',
    customerId: 'cust-1',
    customerNameAr: 'أحمد العتيبي',
    customerNameFr: 'Ahmed Al-Otaibi',
    artworkId: 'artwk-1',
    artworkTitleAr: 'غروب في المدينة',
    artworkTitleFr: 'Coucher de Soleil dans la Ville',
    artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    stage: 'negotiation',
    amountMAD: 50000,
    probability: 80,
    notes: 'تم تقديم خصم 5% بانتظار التأكيد النهائي.',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-26'
  },
  {
    id: 'deal-2',
    dealNumber: 'DEAL-2024-102',
    customerId: 'cust-2',
    customerNameAr: 'نورة الفيصل',
    customerNameFr: 'Noura El Faiçal',
    artworkId: 'artwk-2',
    artworkTitleAr: 'أصوات الطبيعة',
    artworkTitleFr: 'Les Sons de la Nature',
    artworkImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80',
    stage: 'offer_sent',
    amountMAD: 35000,
    probability: 60,
    notes: 'تم إرسال عرض سعر رسمي عبر البريد الإلكتروني.',
    createdAt: '2024-05-10',
    updatedAt: '2024-05-22'
  },
  {
    id: 'deal-3',
    dealNumber: 'DEAL-2024-103',
    customerId: 'cust-3',
    customerNameAr: 'خالد بن سلمان',
    customerNameFr: 'Khalid Ben Salmane',
    artworkId: 'artwk-3',
    artworkTitleAr: 'تجريد أزرق',
    artworkTitleFr: 'Abstraction Bleue',
    artworkImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
    stage: 'reserved',
    amountMAD: 38000,
    probability: 90,
    notes: 'حجز اللوحة لمدة 10 أيام لحين تجهيز المقر.',
    createdAt: '2024-05-15',
    updatedAt: '2024-05-24'
  },
  {
    id: 'deal-4',
    dealNumber: 'DEAL-2024-104',
    customerId: 'cust-4',
    customerNameAr: 'سارة القحطاني',
    customerNameFr: 'Sara El Qahtani',
    artworkId: 'artwk-4',
    artworkTitleAr: 'حلم وردي',
    artworkTitleFr: 'Rêve Rose',
    artworkImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&auto=format&fit=crop&q=80',
    stage: 'interested',
    amountMAD: 22000,
    probability: 40,
    notes: 'أبدت اهتماماً باللوحة أثناء المعرض الأخيرة.',
    createdAt: '2024-05-18',
    updatedAt: '2024-05-20'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    offerNumber: 'OFF-2024-001',
    customerId: 'cust-1',
    customerNameAr: 'أحمد العتيبي',
    customerNameFr: 'Ahmed Al-Otaibi',
    items: [
      {
        artworkId: 'artwk-1',
        artworkTitleAr: 'غروب في المدينة',
        artworkTitleFr: 'Coucher de Soleil dans la Ville',
        originalPriceMAD: 50000,
        discountPercent: 5,
        finalPriceMAD: 47500,
        artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80'
      },
      {
        artworkId: 'artwk-2',
        artworkTitleAr: 'أصوات الطبيعة',
        artworkTitleFr: 'Les Sons de la Nature',
        originalPriceMAD: 35000,
        discountPercent: 0,
        finalPriceMAD: 35000,
        artworkImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotalMAD: 85000,
    discountMAD: 2500,
    taxMAD: 12375, // 15%
    totalMAD: 94875,
    validUntil: '2024-06-30',
    customMessageAr: 'أتمنى أن تنال هذه الأعمال الرائعة إعجابكم للمقر الجديد.',
    customMessageFr: 'En espérant que ces magnifiques œuvres conviendront parfaitement à vos nouveaux locaux.',
    status: 'sent',
    createdAt: '2024-05-15'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    type: 'invoice',
    customerId: 'cust-1',
    customerNameAr: 'أحمد العتيبي',
    customerNameFr: 'Ahmed Al-Otaibi',
    artworkTitlesAr: ['الأفق البعيد'],
    artworkTitlesFr: ['L’Horizon Lointain'],
    totalMAD: 50000,
    paidMAD: 50000,
    status: 'paid',
    dueDate: '2024-05-20',
    createdAt: '2024-05-10',
    paymentMethod: 'transfer'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    type: 'invoice',
    customerId: 'cust-2',
    customerNameAr: 'نورة الفيصل',
    customerNameFr: 'Noura El Faiçal',
    artworkTitlesAr: ['لوحة الأطلس'],
    artworkTitlesFr: ['Toile de l’Atlas'],
    totalMAD: 35000,
    paidMAD: 35000,
    status: 'paid',
    dueDate: '2024-05-19',
    createdAt: '2024-05-05',
    paymentMethod: 'card'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-003',
    type: 'quotation',
    customerId: 'cust-3',
    customerNameAr: 'خالد بن سلمان',
    customerNameFr: 'Khalid Ben Salmane',
    artworkTitlesAr: ['تجريد أزرق'],
    artworkTitlesFr: ['Abstraction Bleue'],
    totalMAD: 28000,
    paidMAD: 0,
    status: 'pending',
    dueDate: '2024-06-15',
    createdAt: '2024-05-18'
  }
];

export const INITIAL_EXHIBITIONS: Exhibition[] = [
  {
    id: 'exh-1',
    titleAr: 'معرض الربيع الفني',
    titleFr: 'Exposition de Printemps',
    locationAr: 'المعرض الرئيسي - الرباط',
    locationFr: 'Galerie Principale - Rabat',
    startDate: '2024-05-01',
    endDate: '2024-05-30',
    artworksCount: 25,
    coverImage: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    revenueMAD: 320000,
    descriptionAr: 'معرض يضم أهم الأعمال المعاصرة لفنانين مغاربة ودوليين.',
    descriptionFr: 'Une exposition présentant des œuvres majeures d’artistes marocains et internationaux.'
  },
  {
    id: 'exh-2',
    titleAr: 'معرض الألوان والتراث',
    titleFr: 'Exposition Couleurs & Patrimoine',
    locationAr: 'الدار البيضاء - حي الفنون',
    locationFr: 'Casablanca - Quartier des Arts',
    startDate: '2024-06-10',
    endDate: '2024-06-30',
    artworksCount: 18,
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    status: 'upcoming',
    revenueMAD: 0,
    descriptionAr: 'استكشاف التراث المغربي الأصيل من خلال اللوحات الحروفيات والفن الواقعي.',
    descriptionFr: 'Exploration du patrimoine marocain authentique à travers la calligraphie et le réalisme.'
  },
  {
    id: 'exh-3',
    titleAr: 'معرض فنون معاصرة',
    titleFr: 'Exposition d’Art Contemporain',
    locationAr: 'مراكش - مركز الثقافة',
    locationFr: 'Marrakech - Centre Culturel',
    startDate: '2024-07-05',
    endDate: '2024-07-25',
    artworksCount: 30,
    coverImage: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=600&auto=format&fit=crop&q=80',
    status: 'upcoming',
    revenueMAD: 0,
    descriptionAr: 'جمع نخبة من الرواد والشباب في عالم الفن التجريدي.',
    descriptionFr: 'Rassemblement des pionniers et des jeunes talents de l’art abstrait.'
  }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif-1',
    type: 'sale',
    titleAr: 'تم إتمام بيع لوحة "الأفق البعيد" بقيمة 40,000 د.م.',
    titleFr: 'Vente réussie du tableau "L’Horizon Lointain" (40 000 DH)',
    time: 'منذ ساعتين',
    read: false
  },
  {
    id: 'notif-2',
    type: 'offer',
    titleAr: 'تم إرسال عرض سعر جديد للعميل أحمد العتيبي',
    titleFr: 'Nouvelle offre envoyée au client Ahmed Al-Otaibi',
    time: 'منذ 5 ساعات',
    read: false
  },
  {
    id: 'notif-3',
    type: 'sync',
    titleAr: 'تمت مزامنة 12 سجل بنجاح مع Google Sheets',
    titleFr: '12 enregistrements synchronisés avec succès sur Google Sheets',
    time: 'منذ يوم',
    read: true
  }
];

export const INITIAL_SYNC_LOGS: SyncLog[] = [
  {
    id: 'slog-1',
    action: 'Sync Artworks',
    entity: 'Artworks Collection',
    status: 'synced',
    timestamp: '2024-05-28 10:15:22',
    details: 'Synced 6 artworks to Google Sheet ID: 1A2B3C...'
  },
  {
    id: 'slog-2',
    action: 'Backup Drive',
    entity: 'Images & Invoices PDF',
    status: 'synced',
    timestamp: '2024-05-28 09:00:00',
    details: 'Uploaded 3 high-res artwork images to Google Drive folder "Gallery_Backup"'
  }
];
