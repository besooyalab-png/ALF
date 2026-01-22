
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Articles from './pages/Articles.tsx';
import Library from './pages/Library.tsx';
import Contact from './pages/Contact.tsx';
import Admin from './pages/Admin.tsx';
import { storageService } from './services/storageService.ts';
import { ContentType, LegalContent } from './types.ts';
import ContentCard from './components/ContentCard.tsx';
import { X, Calendar, User, Tag, Scale, Target, Compass, ShieldCheck, ArrowLeft } from 'lucide-react';

const DetailModal: React.FC<{ item: LegalContent | null, onClose: () => void }> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-0 md:p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[92vh] md:rounded-[30px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-400 text-right">
        <div className="relative h-60 md:h-[350px] shrink-0">
          <img 
            src={item.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200'} 
            className="w-full h-full object-cover" 
            alt={item.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          <button 
            onClick={onClose} 
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all z-20 border border-white/20"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-6 right-6 left-6 text-white z-10">
            <span className="bg-[#b4924c] px-4 py-1.5 rounded-lg text-xs font-black mb-3 inline-block shadow-2xl">{item.category}</span>
            <h2 className="text-xl md:text-3xl font-black leading-tight drop-shadow-2xl">{item.title}</h2>
          </div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto grow bg-white">
          <div className="flex flex-wrap items-center gap-6 mb-6 py-4 border-b-2 border-gray-100 text-gray-500 font-black text-base">
            <div className="flex items-center gap-2"><Calendar size={20} className="text-[#b4924c]" /> <span>{item.date}</span></div>
            <div className="flex items-center gap-2"><User size={20} className="text-[#b4924c]" /> <span>{item.author}</span></div>
            <div className="flex items-center gap-2"><Tag size={20} className="text-[#b4924c]" /> <span>القسم: {item.type}</span></div>
          </div>

          <div className="prose prose-lg prose-blue max-w-none">
            <p className="text-lg md:text-xl text-gray-900 leading-[1.7] whitespace-pre-wrap font-bold text-right">
              {item.content || item.summary}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-gray-50 border-t-2 flex justify-center sticky bottom-0">
          <button 
            onClick={onClose} 
            className="bg-[#1e3a8a] text-white w-full md:w-auto px-12 py-4 rounded-xl font-black shadow-xl hover:bg-blue-800 transition-all active:scale-95 flex items-center justify-center gap-3 text-xl"
          >
            إغلاق <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DynamicList: React.FC<{ type: ContentType, title: string, subtitle?: string }> = ({ type, title, subtitle }) => {
  const [items, setItems] = useState<LegalContent[]>([]);
  const [selectedItem, setSelectedItem] = useState<LegalContent | null>(null);

  useEffect(() => {
    setItems(storageService.getContent().filter(i => i.type === type));
  }, [type]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-12 rounded-[30px] shadow-sm border-2 border-gray-100 border-r-[8px] border-r-[#b4924c]">
        <h1 className="text-2xl md:text-4xl font-black text-[#1e3a8a] mb-2">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl text-gray-500 font-bold italic">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {items.map(item => (
          <ContentCard 
            key={item.id} 
            item={item} 
            onClick={() => setSelectedItem(item)} 
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 text-gray-300">
          <Scale size={48} className="mx-auto mb-6 opacity-20" />
          <p className="text-xl md:text-2xl font-black italic">لا يوجد محتوى حالياً.</p>
        </div>
      )}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

const About = () => {
  const settings = storageService.getSettings();
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-['Cairo'] text-right">
      <div className="bg-white p-8 md:p-20 rounded-[40px] shadow-sm border-2 border-gray-100 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#b4924c]"></div>
        <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl">
          <Scale size={48} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[#1e3a8a] tracking-tight">عن المؤسسة</h1>
        <div className="w-24 h-1.5 bg-[#b4924c] mx-auto rounded-full"></div>
        <div className="max-w-4xl mx-auto space-y-8">
          {settings.aboutDescription.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-gray-800 leading-[1.7] text-xl md:text-2xl font-bold">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-lg border-2 border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-3 h-full bg-[#b4924c]"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-amber-50 text-[#b4924c] rounded-2xl shadow-sm">
              <Compass size={36} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1e3a8a]">رؤيتنا</h2>
          </div>
          <p className="text-gray-900 leading-relaxed text-lg md:text-xl font-bold">{settings.vision}</p>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-lg border-2 border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-3 h-full bg-[#1e3a8a]"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-50 text-[#1e3a8a] rounded-2xl shadow-sm">
              <Target size={36} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1e3a8a]">رسالتنا</h2>
          </div>
          <p className="text-gray-900 leading-relaxed text-lg md:text-xl font-bold">{settings.mission}</p>
        </div>
      </div>

      <div className="bg-[#1e3a8a] text-white p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden text-center md:text-right border-b-[10px] border-[#b4924c]">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-black flex items-center justify-center md:justify-start gap-4">
               التزامنا القانوني <ShieldCheck size={40} className="text-[#b4924c]" />
            </h2>
            <p className="text-blue-50 text-lg md:text-xl font-bold leading-relaxed">
              نحن نؤمن بأن العلم حق للجميع، ولذلك نسعى جاهدين لتقديم المعلومة القانونية الدقيقة بأسلوب يتناسب مع الجميع، متطوعين لخدمة العدالة وترسيخ سيادة القانون.
            </p>
          </div>
          <div className="bg-[#b4924c] p-6 md:p-8 rounded-3xl shadow-xl rotate-2 hover:rotate-0 transition-all cursor-default">
            <p className="text-white font-black text-xl md:text-2xl">ثقافة • وعي • قانون</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/summaries" element={<DynamicList type={ContentType.SUMMARY} title="ملخصات قانونية" subtitle="خلاصة القوانين بأسلوب عصري" />} />
          <Route path="/explanations" element={<DynamicList type={ContentType.EXPLANATION} title="شرح القوانين" subtitle="تبسيط النصوص التشريعية المعقدة" />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/education" element={<DynamicList type={ContentType.EDUCATION} title="محتوى تعليمي" subtitle="بناء جيل قانوني واعد" />} />
          <Route path="/library" element={<Library />} />
          <Route path="/cases" element={<DynamicList type={ContentType.CASE} title="أرشيف القضايا" subtitle="دروس مستفادة من الواقع العملي" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
