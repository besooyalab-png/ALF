
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, Library, FileText, 
  Info, MessageCircle, Menu, X, Scale, FileSignature, GraduationCap, Lightbulb
} from 'lucide-react';
import { storageService } from '../services/storageService';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const settings = storageService.getSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: <Home size={24} /> },
    { name: 'ملخصات قانونية', path: '/summaries', icon: <FileSignature size={24} /> },
    { name: 'شرح القوانين', path: '/explanations', icon: <Lightbulb size={24} /> },
    { name: 'مقالات قانونية', path: '/articles', icon: <BookOpen size={24} /> },
    { name: 'محتوى تعليمي', path: '/education', icon: <GraduationCap size={24} /> },
    { name: 'الكتب والمراجع', path: '/library', icon: <Library size={24} /> },
    { name: 'أرشيف القضايا', path: '/cases', icon: <FileText size={24} /> },
    { name: 'عن المؤسسة', path: '/about', icon: <Info size={24} /> },
    { name: 'تواصل معنا', path: '/contact', icon: <MessageCircle size={24} /> },
  ];

  const handleSecretClick = () => {
    const newCount = adminClicks + 1;
    if (newCount >= 10) {
      setAdminClicks(0);
      navigate('/admin');
    } else {
      setAdminClicks(newCount);
      setTimeout(() => setAdminClicks(0), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-['Cairo'] overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1e3a8a] text-white px-4 py-4 sticky top-0 z-50 shadow-2xl border-b-4 border-[#b4924c] h-24 flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90 border border-white/20"
        >
          {isSidebarOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        <div 
          onClick={handleSecretClick}
          className="flex flex-col items-center gap-1 cursor-default select-none active:scale-95 transition-transform"
        >
           <span className="font-black text-lg drop-shadow-md">{settings.appName}</span>
           <div className="w-10 h-1 bg-[#b4924c] rounded-full"></div>
        </div>

        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center border-2 border-[#b4924c] shadow-lg">
           <Scale size={24} className="text-[#1e3a8a]" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-[60] w-80 bg-[#1e3a8a] text-white transform transition-transform duration-500 ease-in-out
        md:relative md:translate-x-0 overflow-y-auto shadow-2xl border-l-4 border-[#b4924c]
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div 
          onClick={handleSecretClick}
          className="p-10 flex flex-col items-center gap-6 border-b border-white/10 text-center relative overflow-hidden cursor-default select-none"
        >
          <div className="bg-white p-3 rounded-full w-32 h-32 shadow-2xl flex items-center justify-center border-4 border-[#b4924c] transition-transform hover:scale-105 duration-500">
             <Scale size={64} className="text-[#1e3a8a]" />
          </div>
          <div className="font-black text-white text-2xl tracking-tight leading-tight">{settings.appName}</div>
        </div>

        <nav className="mt-8 px-6 pb-20 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center gap-5 px-6 py-5 rounded-[20px] transition-all duration-300 group
                ${location.pathname === item.path 
                  ? 'bg-[#b4924c] text-white shadow-2xl translate-x-[-10px]' 
                  : 'hover:bg-blue-800/60 text-blue-100'}
              `}
            >
              <span className={`${location.pathname === item.path ? 'text-white' : 'text-[#b4924c] group-hover:scale-110 transition-transform'}`}>
                {item.icon}
              </span>
              <span className="font-black text-lg">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-12 lg:p-16 overflow-y-auto w-full max-w-full mx-auto">
        <div className="page-transition max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 md:hidden backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;