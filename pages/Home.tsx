
import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService.ts';
import ContentCard from '../components/ContentCard.tsx';
import { Scale, X, Calendar, User, ArrowLeftCircle } from 'lucide-react';
import { LegalContent } from '../types.ts';

const HomeDetailModal: React.FC<{ item: LegalContent | null, onClose: () => void }> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-0 md:p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] md:rounded-[30px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-400 text-right">
        <div className="relative h-60 md:h-[350px] shrink-0">
          <img src={item.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/30 z-20"><X size={24} /></button>
          <div className="absolute bottom-6 right-6 left-6 text-white z-10">
            <span className="bg-[#b4924c] text-white px-4 py-1.5 rounded-lg text-xs font-black mb-3 inline-block uppercase shadow-xl">{item.category}</span>
            <h2 className="text-xl md:text-3xl font-black leading-tight drop-shadow-2xl">{item.title}</h2>
          </div>
        </div>
        <div className="p-6 md:p-10 overflow-y-auto grow custom-scrollbar bg-white">
          <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b-2 border-gray-100 text-gray-500 font-bold text-base">
            <div className="flex items-center gap-2"><Calendar size={20} className="text-[#b4924c]" /> <span>{item.date}</span></div>
            <div className="flex items-center gap-2"><User size={20} className="text-[#b4924c]" /> <span>بواسطة: {item.author}</span></div>
          </div>
          <div className="prose prose-lg prose-blue max-w-none">
            <p className="text-lg md:text-xl text-gray-900 leading-[1.7] whitespace-pre-wrap font-bold text-right">
              {item.content || item.summary}
            </p>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-gray-50 border-t-2 flex justify-center sticky bottom-0">
          <button onClick={onClose} className="bg-[#1e3a8a] text-white w-full md:w-auto px-12 py-4 rounded-xl font-black shadow-xl active:scale-95 transition-all text-xl hover:bg-blue-800 flex items-center justify-center gap-3">
            إغلاق <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [recentData, setRecentData] = useState<LegalContent[]>([]);
  const [selectedItem, setSelectedItem] = useState<LegalContent | null>(null);
  const settings = storageService.getSettings();
  const latestContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = storageService.getContent();
    setRecentData(content.slice(0, 12));
  }, []);

  const scrollToLatest = () => {
    latestContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 overflow-x-hidden">
      <section className="relative bg-[#1e3a8a] rounded-[30px] md:rounded-[50px] p-8 md:p-20 text-white overflow-hidden shadow-2xl text-center border-b-[8px] border-[#b4924c]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b4924c]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-2xl md:text-4xl font-black mb-10 md:mb-14 leading-[1.5] text-white drop-shadow-2xl whitespace-pre-line px-2">
            {settings.heroSubtitle}
          </h1>
          
          <div className="flex justify-center w-full">
             <button 
               onClick={scrollToLatest}
               className="bg-[#b4924c] hover:bg-white hover:text-[#1e3a8a] text-white px-8 md:px-14 py-4 md:py-6 rounded-2xl font-black text-xl md:text-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 group"
             >
               تصفح المكتبة <ArrowLeftCircle size={24} className="group-hover:translate-x-[-5px] transition-transform" />
             </button>
          </div>
        </div>
      </section>

      <section ref={latestContentRef} className="scroll-mt-10 px-2 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b-2 border-gray-100 pb-8">
          <div className="border-r-[6px] border-[#b4924c] pr-6">
            <h2 className="text-2xl md:text-4xl font-black text-[#1e3a8a]">أحدث الإصدارات</h2>
            <p className="text-gray-500 font-bold mt-2 text-lg md:text-xl">رؤية قانونية عصرية</p>
          </div>
          <div className="text-[#b4924c] font-black text-sm md:text-base flex items-center gap-3">
             <div className="w-8 h-1 bg-[#b4924c]"></div> تحديثات جديدة
          </div>
        </div>
        
        {recentData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {recentData.map(item => (
              <ContentCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 md:py-40 bg-white rounded-[40px] border-4 border-dashed border-gray-100 shadow-inner px-8">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-100">
               <Scale size={48} />
            </div>
            <p className="text-xl md:text-2xl font-black text-gray-300 italic">المحتوى قيد التجهيز من قبل خبرائنا...</p>
          </div>
        )}
      </section>

      <HomeDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default Home;
