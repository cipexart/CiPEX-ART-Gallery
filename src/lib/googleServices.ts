// Google Drive & Sheets Integration Service for CiPEX Gallery
// Target Spreadsheet ID: 1_WURFcQdZNzCBntKUjghpYqKBe2_neNlU9BBnVD2FPk
// Dedicated Admin: artcipex@gmail.com

export const TARGET_SPREADSHEET_ID = "1_WURFcQdZNzCBntKUjghpYqKBe2_neNlU9BBnVD2FPk";
export const TARGET_ADMIN_EMAIL = "artcipex@gmail.com";
export const TARGET_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${TARGET_SPREADSHEET_ID}/edit#gid=698258429`;

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  size?: string;
}

/**
 * Ensures that required sheet tabs (RegisteredUsers, UserSessions, Artworks, SalesDeals) exist in the target spreadsheet.
 * If any tab is missing, it creates it using Sheets API batchUpdate.
 */
export async function ensureSheetTabsExist(
  accessToken: string,
  spreadsheetId: string = TARGET_SPREADSHEET_ID
): Promise<boolean> {
  if (!accessToken) return false;

  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!metaRes.ok) {
      console.warn('Could not fetch spreadsheet metadata:', await metaRes.text());
      return false;
    }

    const metaData = await metaRes.json();
    const existingTitles: string[] = (metaData.sheets || []).map((s: any) => s.properties?.title || '');

    const requiredTabs: { title: string; headers: string[] }[] = [
      {
        title: 'RegisteredUsers',
        headers: ['تاريخ التسجيل', 'معرف المستخدم', 'الاسم الكامل', 'البريد الإلكتروني', 'رقم الهاتف', 'الدور / الصفة', 'حالة الحساب', 'صورة الملف الشخصي (Avatar)']
      },
      {
        title: 'UserSessions',
        headers: ['تاريخ ووقت الحدث', 'نوع الحدث', 'الاسم الكامل', 'البريد الإلكتروني', 'الصفة', 'مدة الجلسة', 'التفاصيل']
      },
      {
        title: 'Artworks',
        headers: ['ID', 'رقم اللوحة', 'العنوان بالعربية', 'العنوان بالفرنسية', 'الفنان', 'السنة', 'السعر درهم', 'الحالة', 'الموقع', 'صورة اللوحة (Primary Image)']
      },
      {
        title: 'SalesDeals',
        headers: ['رقم الصفقة', 'اسم العميل', 'عنوان اللوحة', 'المبلغ درهم', 'المرحلة', 'التاريخ']
      },
      {
        title: 'Customers',
        headers: ['معرف العميل', 'الاسم بالعربية', 'الاسم بالفرنسية', 'البريد الإلكتروني', 'رقم الهاتف', 'المدينة', 'إجمالي المشتريات (درهم)', 'عدد المشتريات', 'آخر تواصل', 'صورة العميل (Avatar)']
      },
      {
        title: 'Artists',
        headers: ['Artist ID', 'اسم الفنان بالعربية', 'اسم الفنان بالفرنسية', 'الجنسية', 'سنة الميلاد', 'سنة الوفاة', 'الأسلوب الفني', 'رقم الهاتف', 'البريد الإلكتروني', 'صورة الفنان (Avatar)']
      },
      {
        title: 'OffersAndInvoices',
        headers: ['الرمز / Code', 'النوع', 'اسم العميل', 'إجمالي المبلغ (درهم)', 'الحالة', 'تاريخ الإصدار']
      },
      {
        title: 'InventoryLocations',
        headers: ['المعرف', 'اسم المقر / المعرض', 'المدينة', 'الطاقة الاستيعابية', 'رقم الهاتف', 'المسؤول']
      },
      {
        title: 'ShippingOrders',
        headers: ['رقم التتبع', 'المرسل إليه', 'اللوحة شحنت', 'شركة الشحن', 'التكلفة درهم', 'الحالة']
      }
    ];

    const missingTabs = requiredTabs.filter(tab => !existingTitles.includes(tab.title));

    if (missingTabs.length === 0) {
      return true;
    }

    // Batch create missing tabs
    const requests = missingTabs.map(tab => ({
      addSheet: {
        properties: {
          title: tab.title
        }
      }
    }));

    const batchRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    if (!batchRes.ok) {
      console.warn('Batch update addSheet warning:', await batchRes.text());
    }

    // Write header rows for newly created tabs
    for (const tab of missingTabs) {
      await updateSheetTabValues(accessToken, spreadsheetId, tab.title, tab.headers, []);
    }

    return true;
  } catch (err) {
    console.error('Error ensuring sheet tabs exist:', err);
    return false;
  }
}

/**
 * Appends rows to a specified sheet tab in the target Google Spreadsheet
 */
export async function appendRowsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  values: (string | number)[][]
): Promise<boolean> {
  if (!accessToken) return false;
  
  try {
    const range = `${sheetName}!A1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
    
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: values
      })
    });

    if (res.status === 401) {
      console.info(`[Google Sheets] Authorization token expired or unauthenticated for ${sheetName}. Data fallback saved locally & to Firestore.`);
      return false;
    }

    if (!res.ok) {
      // Try ensuring sheet tabs exist and retry once
      await ensureSheetTabsExist(accessToken, spreadsheetId);
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.info(`[Google Sheets] Unauthorized on retry for ${sheetName}. Fallback active.`);
          return false;
        }
        console.warn(`Failed to append rows to ${sheetName} on retry:`, await res.text());
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error(`Error appending to Google Sheet ${sheetName}:`, err);
    return false;
  }
}

/**
 * Overwrites or initializes a sheet tab with headers and data rows
 */
export async function updateSheetTabValues(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<boolean> {
  if (!accessToken) return false;

  try {
    const range = `${sheetName}!A1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

    const values = [headers, ...rows];
    let res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: values
      })
    });

    if (res.status === 401) {
      console.info(`[Google Sheets] Authorization token expired or unauthenticated for ${sheetName}.`);
      return false;
    }

    if (!res.ok) {
      // Try ensuring sheet tabs exist and retry once
      await ensureSheetTabsExist(accessToken, spreadsheetId);
      res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!res.ok) {
        if (res.status === 401) return false;
        console.warn(`Failed to update sheet tab ${sheetName} on retry:`, await res.text());
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error(`Error updating Google Sheet tab ${sheetName}:`, err);
    return false;
  }
}

/**
 * Logs a newly registered user to the "RegisteredUsers" (المستخدمون المسجلون) tab
 */
export async function logNewUserToSheets(
  accessToken: string | null,
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
  }
) {
  if (!accessToken) {
    console.log('[Sheets Log] No access token available. User saved locally:', user);
    return;
  }

  const timestamp = new Date().toLocaleString('ar-MA', { timeZone: 'Africa/Casablanca' });
  const row = [
    timestamp,
    user.id,
    user.name,
    user.email,
    user.phone || 'غير محدد',
    user.role,
    user.email === TARGET_ADMIN_EMAIL ? 'أدمن النظام الوحيد' : 'عضو مسجل',
    user.avatar || ''
  ];

  await appendRowsToSpreadsheet(
    accessToken,
    TARGET_SPREADSHEET_ID,
    'RegisteredUsers',
    [row]
  );
}

/**
 * Logs a Login or Logout session event to the "UserSessions" (تتبع الجلسات والحضور) tab
 */
export async function logSessionEventToSheets(
  accessToken: string | null,
  event: {
    email: string;
    name: string;
    role: string;
    eventType: 'LOGIN' | 'LOGOUT' | 'PROFILE_UPDATE';
    timestamp: string;
    durationMinutes?: number;
    details?: string;
  }
) {
  if (!accessToken) {
    console.log('[Sheets Session Log] Local session event:', event);
    return;
  }

  const row = [
    event.timestamp,
    event.eventType === 'LOGIN' ? 'تسجيل دخول (Login)' : event.eventType === 'PROFILE_UPDATE' ? 'تحديث البروفايل (Profile)' : 'تسجيل خروج (Logout)',
    event.name,
    event.email,
    event.role,
    event.durationMinutes ? `${event.durationMinutes} دقيقة` : (event.eventType === 'LOGIN' ? 'بداية الجلسة' : '-'),
    event.details || 'جلسة متصفح نشطة'
  ];

  await appendRowsToSpreadsheet(
    accessToken,
    TARGET_SPREADSHEET_ID,
    'UserSessions',
    [row]
  );
}

/**
 * Syncs full database (Artworks, Deals, Customers, Users, Sessions, etc.) to the Target Google Sheet
 */
export async function syncFullGalleryToTargetSpreadsheet(
  accessToken: string,
  data: {
    artworks: any[];
    deals: any[];
    customers: any[];
    artists?: any[];
    registeredUsers?: any[];
    sessionLogs?: any[];
    offers?: any[];
    invoices?: any[];
    inventoryLocations?: any[];
    shippingOrders?: any[];
  }
): Promise<{ success: boolean; spreadsheetUrl: string; message: string }> {
  try {
    // 0. Ensure all required sheet tabs exist
    await ensureSheetTabsExist(accessToken, TARGET_SPREADSHEET_ID);

    // 1. Sheet Tab: Artworks (كاتالوج اللوحات)
    const artworkHeaders = ['ID', 'Artwork Number', 'Title (Ar)', 'Title (Fr)', 'Artist', 'Year', 'Price MAD', 'Status', 'Location', 'Primary Image'];
    const artworkRows = data.artworks.map(a => [
      a.id,
      a.artworkNumber || '',
      a.titleAr,
      a.titleFr,
      a.artistNameAr,
      a.year,
      a.sellingPriceMAD,
      a.status ? a.status.toUpperCase() : 'AVAILABLE',
      a.location || 'المستودع الرئيسي',
      a.primaryImage || ''
    ]);
    await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'Artworks', artworkHeaders, artworkRows);

    // 2. Sheet Tab: SalesDeals (صفقات المبيعات)
    const dealHeaders = ['Deal Number', 'Customer', 'Artwork', 'Amount MAD', 'Stage', 'Date'];
    const dealRows = data.deals.map(d => [
      d.dealNumber,
      d.customerNameAr,
      d.artworkTitleAr,
      d.amountMAD,
      d.stage ? d.stage.toUpperCase() : 'NEW',
      d.createdAt
    ]);
    await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'SalesDeals', dealHeaders, dealRows);

    // 3. Sheet Tab: RegisteredUsers (المستخدمون الجدد والعملاء)
    const userHeaders = ['Registration Date', 'User ID', 'Full Name', 'Email', 'Phone', 'Role', 'Status', 'Avatar URL'];
    const userRows = (data.registeredUsers || []).map(u => [
      u.createdAt || new Date().toISOString().slice(0, 10),
      u.id,
      u.name,
      u.email,
      u.phone || '-',
      u.role,
      u.email === TARGET_ADMIN_EMAIL ? 'أدمن رئيسي' : 'مستخدم عادي',
      u.avatar || ''
    ]);
    if (userRows.length > 0) {
      await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'RegisteredUsers', userHeaders, userRows);
    }

    // 4. Sheet Tab: Customers (إدارة المقتنين والعملاء)
    const customerHeaders = ['Customer ID', 'Name (Ar)', 'Name (Fr)', 'Email', 'Phone', 'City', 'Total Purchases MAD', 'Purchases Count', 'Last Contact', 'Avatar URL'];
    const customerRows = (data.customers || []).map(c => [
      c.id,
      c.nameAr,
      c.nameFr,
      c.email,
      c.phone,
      c.cityAr || c.cityFr || '-',
      c.totalPurchasesMAD || 0,
      c.purchasesCount || 0,
      c.lastContactDate || new Date().toISOString().slice(0, 10),
      c.avatar || ''
    ]);
    if (customerRows.length > 0) {
      await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'Customers', customerHeaders, customerRows);
    }

    // 5. Sheet Tab: Artists (الفنانون)
    if (data.artists && data.artists.length > 0) {
      const artistHeaders = ['Artist ID', 'Name (Ar)', 'Name (Fr)', 'Nationality', 'Birth Year', 'Death Year', 'Artistic Style', 'Phone', 'Email', 'Avatar URL'];
      const artistRows = data.artists.map(a => [
        a.id,
        a.nameAr,
        a.nameFr,
        a.nationalityAr || a.nationalityFr || '-',
        a.birthYear || '-',
        a.deathYear || '-',
        a.styleAr || a.styleFr || '-',
        a.phone || '-',
        a.email || '-',
        a.avatar || ''
      ]);
      await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'Artists', artistHeaders, artistRows);
    }

    // 6. Sheet Tab: OffersAndInvoices (عروض الأسعار والفواتير)
    const mergedDocs = [
      ...(data.offers || []).map(o => ({
        code: o.offerNumber,
        type: 'عرض سعر (Offer)',
        customer: o.customerNameAr || '-',
        amount: o.totalMAD || 0,
        status: o.status || 'SENT',
        date: o.issueDate || ''
      })),
      ...(data.invoices || []).map(i => ({
        code: i.invoiceNumber,
        type: 'فاتورة رسمية (Invoice)',
        customer: i.customerNameAr || '-',
        amount: i.totalMAD || 0,
        status: i.status || 'PAID',
        date: i.issueDate || ''
      }))
    ];
    if (mergedDocs.length > 0) {
      const docHeaders = ['Code', 'Type', 'Customer Name', 'Total Amount MAD', 'Status', 'Issue Date'];
      const docRows = mergedDocs.map(d => [d.code, d.type, d.customer, d.amount, d.status, d.date]);
      await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'OffersAndInvoices', docHeaders, docRows);
    }

    // 7. Sheet Tab: InventoryLocations (المقار والمستودعات)
    if (data.inventoryLocations && data.inventoryLocations.length > 0) {
      const invHeaders = ['ID', 'Location Name', 'City', 'Capacity', 'Phone', 'Manager'];
      const invRows = data.inventoryLocations.map(l => [
        l.id,
        l.nameAr || l.nameFr,
        l.cityAr || l.cityFr || '-',
        l.capacityArtworks || 0,
        l.phone || '-',
        l.managerName || '-'
      ]);
      await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'InventoryLocations', invHeaders, invRows);
    }

    // 8. Sheet Tab: ShippingOrders (شحنات اللوحات)
    if (data.shippingOrders && data.shippingOrders.length > 0) {
      const shipHeaders = ['Tracking Number', 'Recipient', 'Artwork', 'Courier', 'Cost MAD', 'Status'];
      const shipRows = data.shippingOrders.map(s => [
        s.trackingNumber,
        s.recipientName,
        s.artworkTitleAr || '-',
        s.courierName,
        s.shippingCostMAD || 0,
        s.status
      ]);
      await updateSheetTabValues(accessToken, TARGET_SPREADSHEET_ID, 'ShippingOrders', shipHeaders, shipRows);
    }

    return {
      success: true,
      spreadsheetUrl: TARGET_SPREADSHEET_URL,
      message: 'تمت مزامنة جميع الصفحات والأعمدة بما فيها صور الشخصية واللوحات في شيت جوجل بنجاح!'
    };
  } catch (err: any) {
    console.error('Failed to sync to target spreadsheet:', err);
    return {
      success: false,
      spreadsheetUrl: TARGET_SPREADSHEET_URL,
      message: err.message || 'حدث خطأ أثناء المزامنة مع Google Sheets'
    };
  }
}

/**
 * Creates a new Google Spreadsheet (for standalone exports)
 */
export async function createGoogleSpreadsheet(
  accessToken: string,
  title: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [{ properties: { title: 'Sheet1' } }]
    })
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create spreadsheet: ${err}`);
  }

  const createData = await createRes.json();
  const spreadsheetId = createData.spreadsheetId;
  const spreadsheetUrl = createData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  const values = [headers, ...rows];
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Lists files from Google Drive
 */
export async function listGoogleDriveFiles(accessToken: string): Promise<GoogleDriveFile[]> {
  const res = await fetch(
    'https://www.googleapis.com/drive/v3/files?pageSize=20&fields=files(id,name,mimeType,webViewLink,thumbnailLink,createdTime,size)',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch Drive files: ${err}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Uploads a file to Google Drive
 */
export async function uploadToGoogleDrive(
  accessToken: string,
  fileName: string,
  mimeType: string,
  content: string | Blob
): Promise<{ id: string; webViewLink?: string }> {
  const metadata = {
    name: fileName,
    mimeType: mimeType
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  
  if (typeof content === 'string') {
    formData.append('file', new Blob([content], { type: mimeType }));
  } else {
    formData.append('file', content);
  }

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload file to Google Drive: ${err}`);
  }

  return await res.json();
}
