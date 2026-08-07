import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Palette, 
  Users, 
  UserCheck, 
  FileText, 
  Receipt, 
  Building2, 
  Package, 
  Truck, 
  BarChart3, 
  RefreshCw, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Search, 
  X,
  Plus,
  LogOut,
  Shield,
  Eye,
  User as UserIcon
} from 'lucide-react';
import { Language, ThemeMode, ActivityNotification, User, UserRole } from '../types';
import { getTranslation } from '../i18n/translations';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  userRole: UserRole;
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  lang,
  userRole,
  currentUser,
  onLogout
}) => {
  const isAr = lang === 'ar';

  const allMenuItems = [
    { id: 'dashboard', labelKey: 'navDashboard', icon: LayoutDashboard },
    { id: 'sales', labelKey: 'navSales', icon: ShoppingBag },
    { id: 'artworks', labelKey: 'navArtworks', icon: Palette },
    { id: 'artists', labelKey: 'navArtists', icon: UserCheck },
    { id: 'customers', labelKey: 'navCustomers', icon: Users },
    { id: 'offers', labelKey: 'navOffers', icon: FileText },
    { id: 'invoices', labelKey: 'navInvoices', icon: Receipt },
    { id: 'exhibitions', labelKey: 'navExhibitions', icon: Building2 },
    { id: 'inventory', labelKey: 'navInventory', icon: Package },
    { id: 'shipping', labelKey: 'navShipping', icon: Truck },
    { id: 'reports', labelKey: 'navReports', icon: BarChart3 },
    { id: 'sync', labelKey: 'navSync', icon: RefreshCw },
    { id: 'settings', labelKey: 'navSettings', icon: Settings },
    { id: 'profile', labelKey: 'navProfile', icon: UserIcon },
  ];

  // Restrict items for visitor role (visitors can see Artworks, Exhibitions, and Profile)
  const menuItems = userRole === 'visitor'
    ? allMenuItems.filter((item) => item.id === 'artworks' || item.id === 'exhibitions' || item.id === 'profile')
    : allMenuItems;

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-200 flex flex-col h-screen sticky top-0 border-l border-r border-slate-800 shadow-xl z-20 transition-all select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <img 
          src="/cipex_logo.jpg" 
          alt="CiPEX Logo" 
          className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-indigo-500/20 bg-slate-800/80 p-0.5 border border-slate-700/60 shrink-0" 
        />
        <div>
          <h1 className="font-black text-lg text-white tracking-wider leading-tight">
            CiPEX
          </h1>
          <p className="text-[11px] text-amber-400 font-semibold">
            {getTranslation(lang, 'gallerySubTitle')}
          </p>
        </div>
      </div>

      {/* User Info Bar */}
      <div className="p-3.5 mx-3 my-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2">
        <button 
          onClick={() => setCurrentTab('profile')}
          className="flex items-center gap-2.5 overflow-hidden text-left rtl:text-right hover:opacity-80 transition-opacity"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/40 shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'زائر'}</p>
            <p className={`text-[10px] font-bold ${userRole === 'admin' ? 'text-amber-400' : 'text-indigo-400'}`}>
              {userRole === 'admin' ? getTranslation(lang, 'adminBadge') : getTranslation(lang, 'visitorBadge')}
            </p>
          </div>
        </button>

        <button
          onClick={onLogout}
          title={getTranslation(lang, 'logout')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{getTranslation(lang, item.labelKey as any)}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Offline Badge */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-300">RealmDB Offline</span>
          </div>
          <span className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded">v2.4</span>
        </div>
      </div>
    </aside>
  );
};

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  notifications: ActivityNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<ActivityNotification[]>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAddArtwork: () => void;
  userRole: UserRole;
  currentUser: User | null;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  notifications,
  setNotifications,
  searchQuery,
  setSearchQuery,
  onOpenAddArtwork,
  userRole,
  currentUser,
  onLogout,
  onSwitchRole
}) => {
  const [showNotifs, setShowNotifs] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 sticky top-0 z-10 shadow-sm flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 left-3 rtl:right-3 rtl:left-auto" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getTranslation(lang, 'searchPlaceholder')}
          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-xl pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 right-3 rtl:left-3 rtl:right-auto"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Admin Quick Add Artwork Button */}
        {userRole === 'admin' && (
          <>
            <button
              onClick={onOpenAddArtwork}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(lang, 'addArtwork')}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Google Sheets Sync</span>
            </div>
          </>
        )}

        {/* Role Switcher Button */}
        <button
          onClick={onSwitchRole}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            userRole === 'admin'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
              : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100'
          }`}
        >
          {userRole === 'admin' ? <Eye className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          <span>
            {userRole === 'admin'
              ? getTranslation(lang, 'switchToVisitor')
              : getTranslation(lang, 'switchToAdmin')}
          </span>
        </button>

        {/* Notifications Dropdown (for Admin) */}
        {userRole === 'admin' && (
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute top-full mt-2 left-0 rtl:left-auto rtl:right-0 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {getTranslation(lang, 'notifications')}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      {getTranslation(lang, 'markAllRead')}
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        notif.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <p className="font-semibold mb-1">
                        {lang === 'ar' ? notif.titleAr : notif.titleFr}
                      </p>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'light' ? getTranslation(lang, 'darkTheme') : getTranslation(lang, 'lightTheme')}
        >
          {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title={getTranslation(lang, 'logout')}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
