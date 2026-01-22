
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { ContentType, LegalContent } from '../types';
import ContentCard from '../components/ContentCard';
import { Library as LibraryIcon, X, Calendar, User } from 'lucide-react';

const DetailModal: React.FC<{ item: LegalContent | null, onClose: () => void }> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300 text-right">
        <div className="relative h-64 md:h-80 shrink-0">
          <img src={item.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80"></div>
          <button onClick={onClose} className="absolute top-4 left-4 bg-white/20 text-white p-2 rounded-full backdrop-blur-md"><X size={24} /></button>
          <div className="absolute bottom-6 right-6 left-6 text-white">
            <h2 className="text-2xl md:text-3xl font-black leading-tight">{item.title}</h2>
          </div>
        </div>
        <div className="p-6 md:p-10 overflow-y-auto grow">
          <div className="flex flex-wrap items-center gap-6 mb-8 py-4 border-b border-gray-100 text-gray-500 text-sm">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-[#b4924c]" /> <span>{item.date}</span></div>
          </div>
          <div className="prose prose-blue max-w-none">
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
              {item.content || item.summary}
            </p>
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="inline-block mt-8 bg-amber-600 text-white px-8 py-3 rounded-xl font-bold">تحميل المرجع (PDF)</a>
            )}
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t flex justify-center">
          <button onClick={onClose} className="bg-[#1e3a8a] text-white px-10 py-3 rounded-2xl font-black shadow-lg">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

const Library: React.FC = () => {
  const [books, setBooks] = useState<LegalContent[]>([]);
  const [selectedItem, setSelectedItem] = useState<LegalContent | null>(null);

  useEffect(() => {
    setBooks(storageService.getContent().filter(i => i.type === ContentType.BOOK));
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-[#1e3a8a] text-white p-10 rounded-3xl relative overflow-hidden">
        <h1 className="text-4xl font-black flex items-center gap-4"><LibraryIcon size={32} /> المكتبة الرقمية</h1>
        <p className="mt-4 text-blue-100 max-w-xl">تصفح وحمل أهم المراجع والكتب القانونية المتوفرة لدينا.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {books.map(book => (
          <ContentCard key={book.id} item={book} onClick={() => setSelectedItem(book)} />
        ))}
      </div>
      {books.length === 0 && <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">المكتبة فارغة حالياً.</div>}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default Library;
