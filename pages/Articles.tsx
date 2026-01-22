
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { ContentType, LegalContent } from '../types';
import ContentCard from '../components/ContentCard';
import { Search, X, Calendar, User, Tag } from 'lucide-react';

const DetailModal: React.FC<{ item: LegalContent | null, onClose: () => void }> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300 text-right">
        <div className="relative h-64 md:h-80 shrink-0">
          <img src={item.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80"></div>
          <button onClick={onClose} className="absolute top-4 left-4 bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all"><X size={24} /></button>
          <div className="absolute bottom-6 right-6 left-6 text-white">
            <h2 className="text-2xl md:text-3xl font-black leading-tight">{item.title}</h2>
          </div>
        </div>
        <div className="p-6 md:p-10 overflow-y-auto grow">
          <div className="flex flex-wrap items-center gap-6 mb-8 py-4 border-b border-gray-100 text-gray-500 text-sm">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-[#b4924c]" /> <span>{item.date}</span></div>
            <div className="flex items-center gap-2"><User size={18} className="text-[#b4924c]" /> <span>{item.author}</span></div>
          </div>
          <div className="prose prose-blue max-w-none">
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
              {item.content || item.summary}
            </p>
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t flex justify-center">
          <button onClick={onClose} className="bg-[#1e3a8a] text-white px-10 py-3 rounded-2xl font-black shadow-lg">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

const Articles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<LegalContent[]>([]);
  const [selectedItem, setSelectedItem] = useState<LegalContent | null>(null);

  useEffect(() => {
    setArticles(storageService.getContent().filter(i => i.type === ContentType.ARTICLE));
  }, []);

  const filtered = articles.filter(a => a.title.includes(searchTerm));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-white p-6 rounded-2xl border">
        <h1 className="text-3xl font-black text-gray-900">المحتوى القانوني</h1>
        <div className="relative md:w-64">
          <input 
            type="text" 
            placeholder="بحث..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-gray-50 border rounded-xl py-3 pr-10 pl-4 outline-none text-black" 
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map(article => (
          <ContentCard key={article.id} item={article} onClick={() => setSelectedItem(article)} />
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">لا توجد مقالات مضافة حالياً.</div>}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default Articles;
