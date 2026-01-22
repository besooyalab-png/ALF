
import { LegalContent, ContentType } from '../types';

const CONTENT_KEY = 'legal_platform_content';
const SETTINGS_KEY = 'legal_platform_settings';

export interface PlatformSettings {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutDescription: string;
  vision: string;
  mission: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  primaryColor: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  appName: 'مؤسسة الحق القانونية',
  heroTitle: 'مرحباً بكم في مؤسسة الحق القانونية',
  heroSubtitle: 'مرحبًا بكم في مؤسسة الحق القانونية ⚖️\nنسعد بزيارتكم، ونتمنى لكم تجربة مفيدة ومحتوى قانوني موثوق.',
  aboutDescription: 'مؤسسة الحق القانونية هي مؤسسة قانونية تهدف إلى نشر الوعي والثقافة القانونية بين أفراد المجتمع، وتقديم المعرفة القانونية بشكل مبسط وواضح يخدم جميع الفئات، من طلاب وباحثين ومهتمين بالشأن القانوني.\n\nتسعى المؤسسة إلى ترسيخ مبادئ العدالة وسيادة القانون، والمساهمة في رفع المستوى القانوني العام من خلال محتوى علمي موثوق، يشمل الشرح المبسط للقوانين، والملخصات القانونية، والمقالات، والدراسات، والقضايا العملية، دون أي هدف ربحي، إيمانًا منها بأن العلم حق للجميع.\n\nوتعتمد المؤسسة في عملها على نخبة من القانونيين وطلبة القانون، بروح تطوعية خالصة، تسعى لخدمة المجتمع وبناء جيل واعٍ بحقوقه وواجباته، قادر على فهم القانون وتطبيقه بصورة صحيحة.',
  vision: 'أن نكون منصة قانونية موثوقة ومؤثرة على مستوى جمهورية مصر العربية.',
  mission: 'تبسيط القانون ونشر العلم القانوني الصحيح لخدمة المجتمع ودعم العدالة.',
  phone: '01108816044',
  whatsapp: '201108816044', 
  email: 'info@alf-legal.com',
  address: 'عن بعد / أونلاين',
  primaryColor: '#1e3a8a'
};

export const storageService = {
  // جلب المحتوى مع إمكانية الدمج من ملف خارجي إذا وجد (للمزامنة العالمية)
  getContent: (): LegalContent[] => {
    const localData = localStorage.getItem(CONTENT_KEY);
    return localData ? JSON.parse(localData) : [];
  },

  saveContent: (content: LegalContent[]) => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  },

  getSettings: (): PlatformSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: PlatformSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // دالة لتصدير كافة البيانات كملف JSON للنشر على GitHub
  exportFullData: () => {
    const data = {
      content: storageService.getContent(),
      settings: storageService.getSettings()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site_data.json';
    link.click();
  },

  // دالة لاستيراد البيانات (تستخدم عند تحديث الموقع من قبل الأدمن)
  importFullData: (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.content) storageService.saveContent(parsed.content);
      if (parsed.settings) storageService.saveSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }
};
