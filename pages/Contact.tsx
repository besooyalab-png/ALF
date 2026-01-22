
import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { storageService } from '../services/storageService';

const Contact: React.FC = () => {
  const settings = storageService.getSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}`;

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500 py-10 font-['Cairo'] text-right">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-[#1e3a8a]">تواصل معنا</h1>
        <p className="text-gray-500 text-xl leading-relaxed font-bold">
          يسعدنا استقبال استفساراتكم مباشرة عبر الواتساب.
        </p>
      </div>

      <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border-4 border-[#1e3a8a] text-center relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-[#1e3a8a] text-white p-8 rounded-full mb-8 shadow-2xl">
            <MessageCircle size={60} />
          </div>
          
          <h2 className="text-3xl font-black text-[#1e3a8a] mb-10">واتساب مباشر</h2>
          
          <a 
            href={whatsappLink}
            target="_blank" 
            rel="noreferrer" 
            className="bg-[#1e3a8a] hover:bg-blue-800 text-white w-full py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            بدء المحادثة الآن <ExternalLink size={28} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
