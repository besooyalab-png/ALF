
import React from 'react';
import { LegalContent, ContentType } from '../types';
import { Calendar, User, Eye, Download, ArrowLeft } from 'lucide-react';

interface Props {
  item: LegalContent;
  onClick?: () => void;
}

const ContentCard: React.FC<Props> = ({ item, onClick }) => {
  const getBadgeColor = () => 'bg-[#1e3a8a] text-white';

  const getBadgeLabel = () => {
    switch(item.type) {
      case ContentType.ARTICLE: return 'مقالة قانونية';
      case ContentType.BOOK: return 'كتاب مرجعي';
      case ContentType.CASE: return 'قضية محلولة';
      case ContentType.SUMMARY: return 'ملخص وافٍ';
      case ContentType.EXPLANATION: return 'شرح ميسر';
      case ContentType.EDUCATION: return 'محتوى تعليمي';
      default: return 'عام';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 cursor-pointer flex flex-col h-full group relative"
    >
      <div className="relative h-56 md:h-64 bg-gray-200 overflow-hidden">
        <img 
          src={item.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800'} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-widest border border-white/20 backdrop-blur-md ${getBadgeColor()}`}>
            {getBadgeLabel()}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[10px] text-[#b4924c] font-black uppercase mb-4 tracking-tighter">
          <Calendar size={14} />
          <span>{item.date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
          <User size={14} />
          <span>{item.author}</span>
        </div>

        <h3 className="text-lg md:text-xl font-black text-[#1e3a8a] mb-4 line-clamp-2 leading-tight group-hover:text-[#b4924c] transition-colors">
          {item.title}
        </h3>
        
        <p className="text-sm md:text-base text-gray-600 line-clamp-3 mb-6 leading-relaxed font-bold">
          {item.summary}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100">
          <span className="text-[10px] font-black text-white px-3 py-1.5 bg-[#b4924c] rounded-lg shadow-sm">
            {item.category}
          </span>
          <div className="flex items-center gap-2 text-[#1e3a8a] font-black text-sm group-hover:translate-x-[-3px] transition-transform">
             {item.type === ContentType.BOOK ? 'تحميل' : 'المزيد'}
             <ArrowLeft size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
