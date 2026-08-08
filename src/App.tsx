import React, { useState, useEffect, useCallback } from 'react';
import { 
  Language, 
  ThemeMode, 
  Artwork, 
  Artist, 
  Customer, 
  Deal, 
  Offer, 
  Invoice, 
  Exhibition, 
  ActivityNotification, 
  SyncLog,
  PipelineStage,
  InventoryLocation,
  ShippingOrder,
  User,
  UserRole
} from './types';
import { 
  INITIAL_ARTISTS, 
  INITIAL_ARTWORKS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DEALS, 
  INITIAL_OFFERS, 
  INITIAL_INVOICES, 
  INITIAL_EXHIBITIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SYNC_LOGS,
  INITIAL_INVENTORY,
  INITIAL_SHIPPING
} from './data/mockData';
import { 
  Sidebar, 
  Header 
} from './components/Navigation';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { ArtworksView } from './components/ArtworksView';
import { SalesPipelineView } from './components/SalesPipelineView';
import { OffersAndInvoicesView } from './components/OffersAndInvoicesView';
import { GoogleSyncView } from './components/GoogleSyncView';
import { ReportsView } from './components/ReportsView';
import { ManagementModulesView } from './components/ManagementModulesView';
import { InventoryView } from './components/InventoryView';
import { ShippingView } from './components/ShippingView';
import { ProfileView } from './components/ProfileView';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { logSessionEventToSheets, syncFullGalleryToTargetSpreadsheet, TARGET_ADMIN_EMAIL } from './lib/googleServices';

export default function App() {
  // App State
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [currentTab, setCurrentTab] = useState<string>('artworks');

  // Track session start time for session duration analytics
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  // Persistent User & Auth State (stored in localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cipl_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Persistent Google OAuth Access Token
  const [googleAccessToken, setGoogleAccessTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('cipl_google_token') || null;
    } catch (e) {
      return null;
    }
  });

  const setGoogleAccessToken = (token: string | null) => {
    setGoogleAccessTokenState(token);
    try {
      if (token) {
        localStorage.setItem('cipl_google_token', token);
      } else {
        localStorage.removeItem('cipl_google_token');
      }
    } catch (e) {
      console.error('Failed to save google token:', e);
    }
  };

  // Core Collections State
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem('cipl_artworks');
      return saved ? JSON.parse(saved) : INITIAL_ARTWORKS;
    } catch (e) {
      return INITIAL_ARTWORKS;
    }
  });

  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const savedCust = localStorage.getItem('cipl_customers');
      let baseCust: Customer[] = savedCust ? JSON.parse(savedCust) : INITIAL_CUSTOMERS;
      
      // Merge all registered users into customers list so Admin always sees new signups
      const savedUsers = localStorage.getItem('cipl_registered_users');
      const regUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];

      regUsers.forEach(u => {
        if (u.role !== 'admin' && u.email) {
          const exists = baseCust.some(c => c.email.toLowerCase() === u.email.toLowerCase());
          if (!exists) {
            baseCust.unshift({
              id: u.id || `cust-${Date.now()}`,
              nameAr: u.name || 'زائر جديد',
              nameFr: u.name || 'Nouveau Visiteur',
              avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              cityAr: u.city || 'الدار البيضاء',
              cityFr: u.city || 'Casablanca',
              countryAr: 'المغرب',
              countryFr: 'Maroc',
              email: u.email,
              phone: u.phone || '+212 600 000000',
              totalPurchasesMAD: 0,
              purchasesCount: 0,
              favoriteArtists: ['محمد الجالي'],
              favoriteStyles: ['تجريدي معاصر'],
              budgetMAD: 50000,
              lastContactDate: new Date().toISOString().slice(0, 10),
              tags: ['عضو مسجل جديد', 'زائر مؤكد عبر المنصة'],
              notesAr: u.bio || 'تم تسجيل الحساب عبر المنصة.',
              notesFr: u.bio || 'Inscrit via la plateforme.'
            });
          }
        }
      });

      return baseCust;
    } catch (e) {
      return INITIAL_CUSTOMERS;
    }
  });

  // Save artworks to local storage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('cipl_artworks', JSON.stringify(artworks));
    } catch (e) {
      console.error('Failed to save artworks to localStorage:', e);
    }
  }, [artworks]);

  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem('cipl_deals');
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch (e) { return INITIAL_DEALS; }
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem('cipl_offers');
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch (e) { return INITIAL_OFFERS; }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('cipl_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch (e) { return INITIAL_INVOICES; }
  });

  const [exhibitions, setExhibitions] = useState<Exhibition[]>(() => {
    try {
      const saved = localStorage.getItem('cipl_exhibitions');
      return saved ? JSON.parse(saved) : INITIAL_EXHIBITIONS;
    } catch (e) { return INITIAL_EXHIBITIONS; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cipl_customers', JSON.stringify(customers));
      localStorage.setItem('cipl_deals', JSON.stringify(deals));
      localStorage.setItem('cipl_offers', JSON.stringify(offers));
      localStorage.setItem('cipl_invoices', JSON.stringify(invoices));
      localStorage.setItem('cipl_exhibitions', JSON.stringify(exhibitions));
    } catch (e) { console.error('Failed to save to localStorage:', e); }
  }, [customers, deals, offers, invoices, exhibitions]);

  const [notifications, setNotifications] = useState<ActivityNotification[]>(INITIAL_NOTIFICATIONS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);
  const [inventoryLocations, setInventoryLocations] = useState<InventoryLocation[]>(INITIAL_INVENTORY);
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>(INITIAL_SHIPPING);

  // Search & Modal States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isAddArtworkModalOpen, setIsAddArtworkModalOpen] = useState(false);

  // Sync visitor/customer profiles into Customers list for Admin view
  const syncUserToCustomers = (user: User) => {
    if (!user || user.role === 'admin') return;

    setCustomers(prevCustomers => {
      const existingIndex = prevCustomers.findIndex(c => c.email.toLowerCase() === user.email.toLowerCase());
      
      const newCustomerObj: Customer = {
        id: user.id || `cust-${Date.now()}`,
        nameAr: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'زائر جديد'),
        nameFr: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Nouveau Visiteur'),
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        cityAr: user.city || 'الدار البيضاء',
        cityFr: user.city || 'Casablanca',
        countryAr: 'المغرب',
        countryFr: 'Maroc',
        email: user.email,
        phone: user.phone || '+212 600 000000',
        totalPurchasesMAD: existingIndex >= 0 ? prevCustomers[existingIndex].totalPurchasesMAD : 0,
        purchasesCount: existingIndex >= 0 ? prevCustomers[existingIndex].purchasesCount : 0,
        favoriteArtists: existingIndex >= 0 ? prevCustomers[existingIndex].favoriteArtists : ['محمد الجالي'],
        favoriteStyles: existingIndex >= 0 ? prevCustomers[existingIndex].favoriteStyles : ['تجريدي معاصر'],
        budgetMAD: existingIndex >= 0 ? prevCustomers[existingIndex].budgetMAD : 50000,
        lastContactDate: new Date().toISOString().slice(0, 10),
        tags: ['عضو مسجل جديد', 'زائر مؤكد عبر المنصة'],
        notesAr: user.bio || 'تم تسجيل العميل وتأكيد الحساب بنجاح في المنصة.',
        notesFr: user.bio || 'Compte créé via la plateforme.'
      };

      let updatedList: Customer[];
      if (existingIndex >= 0) {
        updatedList = [...prevCustomers];
        updatedList[existingIndex] = {
          ...updatedList[existingIndex],
          ...newCustomerObj
        };
      } else {
        updatedList = [newCustomerObj, ...prevCustomers];
      }

      try {
        localStorage.setItem('cipl_customers', JSON.stringify(updatedList));
      } catch (e) {
        console.error('Failed to save customers to storage:', e);
      }

      return updatedList;
    });
  };

  // Automatic background sync to Google Sheets whenever data changes or login occurs
  const performAutoSync = useCallback(async (tokenOverride?: string) => {
    const activeToken = tokenOverride || googleAccessToken;
    if (!activeToken) return;

    try {
      let registeredUsersList: User[] = [];
      try {
        const saved = localStorage.getItem('cipl_registered_users');
        registeredUsersList = saved ? JSON.parse(saved) : [];
      } catch (e) {}

      if (currentUser && !registeredUsersList.some(u => u.email.toLowerCase() === currentUser.email.toLowerCase())) {
        registeredUsersList = [currentUser, ...registeredUsersList];
      }

      await syncFullGalleryToTargetSpreadsheet(activeToken, {
        artworks,
        deals,
        customers,
        artists,
        registeredUsers: registeredUsersList
      });
      console.log('✅ Automatic sync to Google Sheets completed.');
    } catch (err) {
      console.warn('Auto-sync background error:', err);
    }
  }, [googleAccessToken, artworks, deals, customers, artists, currentUser]);

  // Debounced auto-sync whenever artworks, deals, customers, or artists change
  useEffect(() => {
    if (!googleAccessToken) return;
    const timer = setTimeout(() => {
      performAutoSync();
    }, 1200);
    return () => clearTimeout(timer);
  }, [artworks, deals, customers, artists, googleAccessToken, performAutoSync]);

  // Sync default tab on user role change & ensure current user is synced to customers list
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin' && currentTab === 'artworks') {
        setCurrentTab('dashboard');
      } else if (currentUser.role !== 'admin' && currentTab === 'dashboard') {
        setCurrentTab('artworks');
      }

      syncUserToCustomers(currentUser);
    }
  }, [currentUser?.role, currentUser?.email]);

  // Auth Handlers
  const handleLogin = (user: User, token?: string) => {
    setCurrentUser(user);
    setSessionStartTime(Date.now());
    if (token) {
      setGoogleAccessToken(token);
    }
    try {
      localStorage.setItem('cipl_current_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user session:', e);
    }

    syncUserToCustomers(user);

    // Trigger automatic sync immediately on login
    performAutoSync(token || googleAccessToken || undefined);

    if (user.role === 'admin') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('artworks');
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      const durationMs = Date.now() - sessionStartTime;
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
      try {
        await logSessionEventToSheets(googleAccessToken, {
          email: currentUser.email,
          name: currentUser.name,
          role: currentUser.role,
          eventType: 'LOGOUT',
          timestamp: new Date().toLocaleString('ar-MA', { timeZone: 'Africa/Casablanca' }),
          durationMinutes,
          details: `انتهت الجلسة. استغرقت الجلسة ${durationMinutes} دقيقة`
        });
      } catch (err) {
        console.warn('Logout session log error:', err);
      }
    }

    setCurrentUser(null);
    setGoogleAccessToken(null);
    try {
      localStorage.removeItem('cipl_current_user');
    } catch (e) {
      console.error('Failed to clear user session:', e);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('cipl_current_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to update user session in storage:', e);
    }

    syncUserToCustomers(updatedUser);
  };

  const handleSwitchRole = () => {
    if (!currentUser) return;
    let nextRole: UserRole = 'visitor';
    let nextName = '';

    if (currentUser.role === 'admin') {
      nextRole = 'visitor';
      nextName = lang === 'ar' ? 'زائر المعرض (معاينة)' : 'Visiteur Invité';
    } else {
      if (currentUser.email.toLowerCase() === TARGET_ADMIN_EMAIL.toLowerCase()) {
        nextRole = 'admin';
        nextName = lang === 'ar' ? 'الفنان محمد الجالي (مدير المعرض الرئيسي)' : 'Mohamed El Gali (Directeur)';
      } else {
        alert(lang === 'ar' 
          ? 'صلاحيات مدير المعرض محصورة حصرياً في البريد الإلكتروني artcipex@gmail.com' 
          : 'Le rôle Administrateur est réservé uniquement à artcipex@gmail.com');
        return;
      }
    }

    const updatedUser: User = {
      ...currentUser,
      role: nextRole,
      name: nextName
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('cipl_current_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    if (nextRole === 'admin') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('artworks');
    }
  };

  // Visitor Inquiry Handler
  const handleInquireArtwork = (artwork: Artwork, note: string) => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      dealNumber: `DEAL-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser?.id || `cust-${Date.now()}`,
      customerNameAr: currentUser?.name || 'مقتني جديد',
      customerNameFr: currentUser?.name || 'Nouveau Client',
      artworkId: artwork.id,
      artworkTitleAr: artwork.titleAr,
      artworkTitleFr: artwork.titleFr,
      artworkImage: artwork.primaryImage,
      stage: 'lead',
      amountMAD: artwork.sellingPriceMAD,
      probability: 50,
      notes: note || 'طلب اقتناء مباشر عبر كاتالوج اللوحات',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setDeals(prev => [newDeal, ...prev]);

    // Add notification for Admin
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      type: 'offer',
      titleAr: `طلب اقتناء جديد للوحة "${artwork.titleAr}" من المقتني ${currentUser?.name || 'زائر'}`,
      titleFr: `Nouvelle demande pour "${artwork.titleFr}" par ${currentUser?.name || 'Visiteur'}`,
      time: 'الآن',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handlers
  const handleSaveArtwork = (newArtwork: Artwork) => {
    setArtworks(prev => [newArtwork, ...prev]);
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      type: 'sale',
      titleAr: `تم إضافة اللوحة الفنية "${newArtwork.titleAr}" بنجاح`,
      titleFr: `Nouvelle œuvre "${newArtwork.titleFr}" ajoutée`,
      time: 'الآن',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateArtwork = (updatedArtwork: Artwork) => {
    setArtworks(prev => prev.map(a => a.id === updatedArtwork.id ? updatedArtwork : a));
  };

  const handleDeleteArtwork = (id: string) => {
    setArtworks(prev => prev.filter(a => a.id !== id));
  };

  // Inventory & Shipping Handlers
  const handleAddLocation = (loc: InventoryLocation) => {
    setInventoryLocations(prev => [loc, ...prev]);
  };

  const handleUpdateLocation = (loc: InventoryLocation) => {
    setInventoryLocations(prev => prev.map(l => l.id === loc.id ? loc : l));
  };

  const handleTransferArtworkLocation = (artworkId: string, newLocationId: string, newLocationName: string) => {
    setArtworks(prev => prev.map(a => {
      if (a.id === artworkId) {
        return {
          ...a,
          warehouseId: newLocationId,
          location: newLocationName,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));
  };

  const handleUpdateArtworkImage = (artworkId: string, newImageUrl: string) => {
    setArtworks(prev => prev.map(a => {
      if (a.id === artworkId) {
        return {
          ...a,
          primaryImage: newImageUrl,
          galleryImages: [newImageUrl, ...(a.galleryImages || []).slice(1)]
        };
      }
      return a;
    }));
  };

  const handleAddShippingOrder = (order: ShippingOrder) => {
    setShippingOrders(prev => [order, ...prev]);
  };

  const handleUpdateShippingOrder = (order: ShippingOrder) => {
    setShippingOrders(prev => prev.map(o => o.id === order.id ? order : o));
  };

  const handleUpdateShippingStatus = (orderId: string, newStatus: ShippingOrder['status']) => {
    setShippingOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          actualDeliveryDate: newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : o.actualDeliveryDate
        };
      }
      return o;
    }));
  };

  const handleUpdateDealStage = (dealId: string, newStage: PipelineStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] } : d));
  };

  const handleAddDeal = (deal: Deal) => {
    setDeals(prev => [deal, ...prev]);
  };

  const handleCreateOffer = (newOffer: Offer) => {
    setOffers(prev => [newOffer, ...prev]);
  };

  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleRunSync = () => {
    const newLog: SyncLog = {
      id: `slog-${Date.now()}`,
      action: 'Manual Trigger Sync',
      entity: 'Full RealmDB State',
      status: 'synced',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: 'Synced artworks, deals & customers with Google Sheets & Drive.'
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  // If not logged in, render Login Portal first
  if (!currentUser) {
    return (
      <LoginView
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onLogin={handleLogin}
      />
    );
  }

  // Active Role
  const role = currentUser.role;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          lang={lang} 
          userRole={role}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <Header
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            notifications={notifications}
            setNotifications={setNotifications}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenAddArtwork={() => {
              setCurrentTab('artworks');
              setIsAddArtworkModalOpen(true);
            }}
            userRole={role}
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchRole={handleSwitchRole}
          />

          <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
            {role === 'admin' && currentTab === 'dashboard' && (
              <DashboardView
                artworks={artworks}
                artists={artists}
                customers={customers}
                deals={deals}
                lang={lang}
                onOpenArtworkModal={(art) => setSelectedArtwork(art)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'artworks' && (
              <ArtworksView
                artworks={artworks}
                artists={artists}
                lang={lang}
                userRole={role}
                onSaveArtwork={handleSaveArtwork}
                onUpdateArtwork={handleUpdateArtwork}
                onDeleteArtwork={handleDeleteArtwork}
                onOpenArtworkModal={(art) => setSelectedArtwork(art)}
                isAddModalOpen={isAddArtworkModalOpen}
                setIsAddModalOpen={setIsAddArtworkModalOpen}
                onInquireArtwork={handleInquireArtwork}
              />
            )}

            {role === 'admin' && currentTab === 'sales' && (
              <SalesPipelineView
                deals={deals}
                lang={lang}
                onUpdateDealStage={handleUpdateDealStage}
                onAddDeal={handleAddDeal}
              />
            )}

            {role === 'admin' && (currentTab === 'offers' || currentTab === 'invoices') && (
              <OffersAndInvoicesView
                offers={offers}
                invoices={invoices}
                customers={customers}
                artworks={artworks}
                lang={lang}
                onCreateOffer={handleCreateOffer}
                onCreateInvoice={handleCreateInvoice}
              />
            )}

            {role === 'admin' && currentTab === 'sync' && (
              <GoogleSyncView
                syncLogs={syncLogs}
                lang={lang}
                onRunSync={handleRunSync}
                artworks={artworks}
                deals={deals}
                customers={customers}
                invoices={invoices}
                googleAccessToken={googleAccessToken}
                setGoogleAccessToken={setGoogleAccessToken}
              />
            )}

            {role === 'admin' && currentTab === 'reports' && (
              <ReportsView
                artworks={artworks}
                artists={artists}
                customers={customers}
                deals={deals}
                lang={lang}
              />
            )}

            {role === 'admin' && currentTab === 'inventory' && (
              <InventoryView
                locations={inventoryLocations}
                artworks={artworks}
                lang={lang}
                onAddLocation={handleAddLocation}
                onUpdateLocation={handleUpdateLocation}
                onTransferArtworkLocation={handleTransferArtworkLocation}
                onUpdateArtworkImage={handleUpdateArtworkImage}
              />
            )}

            {role === 'admin' && currentTab === 'shipping' && (
              <ShippingView
                shippingOrders={shippingOrders}
                artworks={artworks}
                customers={customers}
                lang={lang}
                onAddShippingOrder={handleAddShippingOrder}
                onUpdateShippingOrder={handleUpdateShippingOrder}
                onUpdateShippingStatus={handleUpdateShippingStatus}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                googleAccessToken={googleAccessToken}
                lang={lang}
              />
            )}

            {(currentTab === 'exhibitions' || (role === 'admin' && (currentTab === 'artists' || currentTab === 'customers' || currentTab === 'settings'))) && (
              <ManagementModulesView
                type={currentTab as any}
                artists={artists}
                customers={customers}
                exhibitions={exhibitions}
                lang={lang}
                userRole={role}
                onAddArtist={(a) => setArtists(prev => [a, ...prev])}
                onUpdateArtist={(a) => setArtists(prev => prev.map(item => item.id === a.id ? a : item))}
                onDeleteArtist={(id) => setArtists(prev => prev.filter(item => item.id !== id))}
                onAddCustomer={(c) => setCustomers(prev => {
                  const updated = [c, ...prev];
                  try { localStorage.setItem('cipl_customers', JSON.stringify(updated)); } catch(e) {}
                  return updated;
                })}
                onUpdateCustomer={(c) => setCustomers(prev => {
                  const updated = prev.map(item => item.id === c.id ? c : item);
                  try { localStorage.setItem('cipl_customers', JSON.stringify(updated)); } catch(e) {}
                  return updated;
                })}
                onDeleteCustomer={(id) => setCustomers(prev => {
                  const updated = prev.filter(item => item.id !== id);
                  try { localStorage.setItem('cipl_customers', JSON.stringify(updated)); } catch(e) {}
                  return updated;
                })}
                onAddExhibition={(e) => setExhibitions(prev => [e, ...prev])}
                onUpdateExhibition={(e) => setExhibitions(prev => prev.map(item => item.id === e.id ? e : item))}
                onDeleteExhibition={(id) => setExhibitions(prev => prev.filter(item => item.id !== id))}
              />
            )}
          </main>
        </div>
      </div>

      {/* Artwork Details Modal */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        lang={lang}
        userRole={role}
        onInquire={(art) => {
          setSelectedArtwork(null);
          handleInquireArtwork(art, 'استفسار عبر العرض التفصيلي للوحة');
        }}
      />
    </div>
  );
}
