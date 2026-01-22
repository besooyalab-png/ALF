
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, X, LogIn, Upload, Image as ImageIcon,
  AlertTriangle, CheckCircle, ArrowRight, Save, Download
} from 'lucide-react';
import { storageService, PlatformSettings } from '../services/storageService';
import { LegalContent, ContentType } from '../types';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  
  const [data, setData] = useState<LegalContent[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(storageService.getSettings());
  const [editingItem, setEditingItem] = useState<Partial<LegalContent> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuth) {
      loadData();
    }
  }, [isAuth]);

  const loadData = () => {
    setData(storageService.getContent());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'X0UIkljGzJzjEU3ZUYZvmohamed') {
      setIsAuth(true);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContent = () => {
    if (editingItem && editingItem.title) {
      const currentData = storageService.getContent();
      let newData;
      
      const existsIndex = currentData.findIndex(i => i.id === editingItem.id);
      if (existsIndex > -1) {
        currentData[existsIndex] = editingItem as LegalContent;
        newData = [...currentData];
      } else {
        const newItem = {
          ...editingItem,
          id: editingItem.id || Date.now().toString(),
          date: editingItem.date || new Date().toLocaleDateString('ar-EG'),
          author: editingItem.author || 'الإدارة',
          category: editingItem.category || 'عام'
        } as LegalContent;
        newData = [newItem, ...currentData];
      }
      
      storageService.saveContent(newData);
      setData(newData);
      setEditingItem(null);
      triggerToast('تم حفظ التغييرات محلياً');
    }
  };

  const executeDelete = () => {
    if (!itemToDelete) return;
    const updatedData = data.filter(item => item.id !== itemToDelete);
    storageService.saveContent(updatedData);
    setData(updatedData);
    setItemToDelete(null);
    triggerToast('تم الحذف بنجاح');
  };

  if (!isAuth) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-8">
            <LogIn size={40} />
          </div>
          <h2 className="text-3xl font-black mb-8 text-black">لوحة التحكم</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-5 focus:ring-4 focus:ring-blue-100 outline-none text-center font-black text-xl"
            />
            <button type="submit" className="w-full bg-[#1e3a8a] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-800 transition-all">دخول الآدمن</button>
          </form>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-gray-400 font-bold hover:text-[#1e3a8a]">
            <ArrowRight size={20} /> العودة للموقع
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 font-['Cairo'] text-right text-black">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-green-600 text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle size={20} /> {showToast}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex flex-wrap bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-fit gap-2">
        <button onClick={() => setActiveTab('content')} className={`px-6 py-3 rounded-xl font-black transition-all ${activeTab === 'content' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>المحتوى</button>
        <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl font-black transition-all ${activeTab === 'settings' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>الإعدادات</button>
      </div>

      {activeTab === 'content' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 gap-6">
            <div>
              <h1 className="text-3xl font-black text-[#1e3a8a]">إدارة المنشورات</h1>
              <p className="text-gray-400 font-bold mt-1">يمكنك إضافة الصور والمقالات وحذفها من هنا.</p>
            </div>
            <button 
              onClick={() => setEditingItem({
                id: Date.now().toString(),
                type: ContentType.ARTICLE,
                title: '', summary: '', content: '', category: 'قانوني',
                author: 'الإدارة', date: new Date().toLocaleDateString('ar-EG'),
                imageUrl: ''
              })}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3"
            >
              <Plus size={24} /> إضافة جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col group relative">
                <div className="h-32 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                  <img src={item.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-black text-[#1e3a8a] mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-gray-400 text-sm font-bold mb-4 line-clamp-2">{item.summary}</p>
                <div className="mt-auto flex gap-3">
                  <button onClick={() => setEditingItem(item)} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-black hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
                  <button onClick={() => setItemToDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-10">
          <h2 className="text-3xl font-black text-[#1e3a8a] border-b pb-6">هوية الموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-lg font-black block">اسم المؤسسة (يظهر في الأعلى)</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-5 text-black font-black outline-none" value={settings.appName} onChange={(e) => setSettings({...settings, appName: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-lg font-black block">نص الترحيب الرئيسي</label>
              <textarea rows={3} className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-5 text-black font-black outline-none" value={settings.heroSubtitle} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { storageService.saveSettings(settings); triggerToast('تم حفظ الإعدادات'); }} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-blue-800 transition-all text-xl">حفظ التغييرات</button>
        </div>
      )}

      {/* Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 text-center shadow-2xl animate-in zoom-in">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black mb-2">حذف المنشور؟</h2>
            <p className="text-gray-500 font-bold mb-8">لن تتمكن من استعادة هذا المنشور بعد حذفه.</p>
            <div className="flex flex-col gap-3">
              <button onClick={executeDelete} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black">نعم، احذف الآن</button>
              <button onClick={() => setItemToDelete(null)} className="w-full bg-gray-100 text-black py-4 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 z-[900] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black text-[#1e3a8a]">إدارة المنشور</h2>
              <button onClick={() => setEditingItem(null)} className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-black text-gray-700">عنوان المنشور</label>
                  <input type="text" placeholder="العنوان..." value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-4 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="font-black text-gray-700">القسم</label>
                  <select 
                    value={editingItem.type} 
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value as ContentType})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-4 font-bold outline-none"
                  >
                    <option value={ContentType.ARTICLE}>مقالة قانونية</option>
                    <option value={ContentType.SUMMARY}>ملخص قانوني</option>
                    <option value={ContentType.BOOK}>كتاب / مرجع</option>
                    <option value={ContentType.EXPLANATION}>شرح قوانين</option>
                    <option value={ContentType.EDUCATION}>محتوى تعليمي</option>
                    <option value={ContentType.CASE}>أرشيف قضايا</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-black text-gray-700">وصف قصير</label>
                <textarea rows={2} value={editingItem.summary} onChange={(e) => setEditingItem({...editingItem, summary: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-4 font-bold outline-none" />
              </div>

              <div className="space-y-2">
                <label className="font-black text-gray-700">المحتوى بالتفصيل</label>
                <textarea rows={6} value={editingItem.content} onChange={(e) => setEditingItem({...editingItem, content: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-4 font-bold outline-none" />
              </div>

              <div className="space-y-4">
                <label className="font-black text-gray-700 block">صورة المنشور</label>
                <div className="flex items-center gap-6">
                  {editingItem.imageUrl && (
                    <img src={editingItem.imageUrl} className="w-24 h-24 rounded-2xl object-cover border" />
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl font-black text-gray-500 hover:border-[#1e3a8a] transition-all"
                  >
                    <ImageIcon size={20} /> {editingItem.imageUrl ? 'تغيير الصورة' : 'رفع صورة'}
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex gap-4">
              <button onClick={handleSaveContent} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"><Save size={20} /> حفظ التعديل</button>
              <button onClick={() => setEditingItem(null)} className="px-10 bg-white text-gray-500 border border-gray-200 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
