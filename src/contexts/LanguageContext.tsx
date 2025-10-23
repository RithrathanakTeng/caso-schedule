import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'km';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.userRoles': 'User Roles',
    'nav.howItWorks': 'How It Works',
    'nav.aiAdvantage': 'AI Advantage',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signIn': 'Sign In',
    'nav.requestDemo': 'Request Demo',
    'nav.dashboard': 'Dashboard',
    
    // Common UI
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.refresh': 'Refresh',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.syncing': 'Syncing...',
    'common.updated': 'Updated',
    'common.justNow': 'just now',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.mySchedule': 'My Schedule',
    'dashboard.notifications': 'Notifications',
    'dashboard.settings': 'Settings',
    'dashboard.logout': 'Logout',
    
    // Teacher Dashboard
    'teacher.mySchedule': 'My Schedule',
    'teacher.availability': 'Availability',
    'teacher.subjects': 'Subject Teaching Preferences',
    'teacher.notifications': 'Notifications',
    'teacher.noSchedule': 'No schedule entries found for this week',
    'teacher.lastUpdated': 'Last updated',
    
    // Schedule
    'schedule.monday': 'Monday',
    'schedule.tuesday': 'Tuesday',
    'schedule.wednesday': 'Wednesday',
    'schedule.thursday': 'Thursday',
    'schedule.friday': 'Friday',
    'schedule.saturday': 'Saturday',
    'schedule.sunday': 'Sunday',
    'schedule.room': 'Room',
    'schedule.notes': 'Notes',
    'schedule.time': 'Time',
    
    // Availability
    'availability.set': 'Set Availability',
    'availability.available': 'Available',
    'availability.unavailable': 'Unavailable',
    'availability.dayOfWeek': 'Day of Week',
    'availability.startTime': 'Start Time',
    'availability.endTime': 'End Time',
    
    // Subjects
    'subject.select': 'Select Subject',
    'subject.preferences': 'Teaching Preferences',
    'subject.assigned': 'Assigned',
    'subject.preferred': 'Preferred',
    
    // Notifications
    'notification.markAllRead': 'Mark All as Read',
    'notification.noNew': 'No new notifications',
    'notification.viewAll': 'View All',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    
    // Errors
    'error.required': 'This field is required',
    'error.invalidEmail': 'Invalid email address',
    'error.passwordTooShort': 'Password must be at least 6 characters',
    'error.loadingFailed': 'Failed to load data',
    'error.saveFailed': 'Failed to save changes',
    
    // Success messages
    'success.saved': 'Changes saved successfully',
    'success.deleted': 'Deleted successfully',
    'success.updated': 'Updated successfully',
  },
  km: {
    // Navigation
    'nav.home': 'ដើម',
    'nav.features': 'លក្ខណៈពិសេស',
    'nav.userRoles': 'តួនាទីអ្នកប្រើប្រាស់',
    'nav.howItWorks': 'របៀបប្រើប្រាស់',
    'nav.aiAdvantage': 'អត្ថប្រយោជន៍ AI',
    'nav.about': 'អំពី',
    'nav.contact': 'ទំនាក់ទំនង',
    'nav.signIn': 'ចូល',
    'nav.requestDemo': 'ស្នើសុំការបង្ហាញ',
    'nav.dashboard': 'ផ្ទាំងគ្រប់គ្រង',
    
    // Common UI
    'common.loading': 'កំពុងផ្ទុក...',
    'common.error': 'កំហុស',
    'common.success': 'ជោគជ័យ',
    'common.save': 'រក្សាទុក',
    'common.cancel': 'បោះបង់',
    'common.delete': 'លុប',
    'common.edit': 'កែសម្រួល',
    'common.add': 'បន្ថែម',
    'common.refresh': 'ធ្វើឱ្យស្រស់',
    'common.search': 'ស្វែងរក',
    'common.filter': 'ច្រោះ',
    'common.export': 'នាំចេញ',
    'common.syncing': 'កំពុងធ្វើសមកាលកម្ម...',
    'common.updated': 'បានធ្វើបច្ចុប្បន្នភាព',
    'common.justNow': 'ភ្លាមៗនេះ',
    
    // Dashboard
    'dashboard.welcome': 'សូមស្វាគមន៍',
    'dashboard.overview': 'ទិដ្ឋភាពទូទៅ',
    'dashboard.mySchedule': 'កាលវិភាគរបស់ខ្ញុំ',
    'dashboard.notifications': 'ការជូនដំណឹង',
    'dashboard.settings': 'ការកំណត់',
    'dashboard.logout': 'ចាកចេញ',
    
    // Teacher Dashboard
    'teacher.mySchedule': 'កាលវិភាគរបស់ខ្ញុំ',
    'teacher.availability': 'ភាពអាចរកបាន',
    'teacher.subjects': 'ចំណូលចិត្តបង្រៀនមុខវិជ្ជា',
    'teacher.notifications': 'ការជូនដំណឹង',
    'teacher.noSchedule': 'រកមិនឃើញកាលវិភាគសម្រាប់សប្តាហ៍នេះទេ',
    'teacher.lastUpdated': 'បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ',
    
    // Schedule
    'schedule.monday': 'ច័ន្ទ',
    'schedule.tuesday': 'អង្គារ',
    'schedule.wednesday': 'ពុធ',
    'schedule.thursday': 'ព្រហស្បតិ៍',
    'schedule.friday': 'សុក្រ',
    'schedule.saturday': 'សៅរ៍',
    'schedule.sunday': 'អាទិត្យ',
    'schedule.room': 'បន្ទប់',
    'schedule.notes': 'ចំណាំ',
    'schedule.time': 'ពេលវេលា',
    
    // Availability
    'availability.set': 'កំណត់ភាពអាចរកបាន',
    'availability.available': 'អាចរកបាន',
    'availability.unavailable': 'មិនអាចរកបាន',
    'availability.dayOfWeek': 'ថ្ងៃក្នុងសប្តាហ៍',
    'availability.startTime': 'ពេលចាប់ផ្តើម',
    'availability.endTime': 'ពេលបញ្ចប់',
    
    // Subjects
    'subject.select': 'ជ្រើសរើសមុខវិជ្ជា',
    'subject.preferences': 'ចំណូលចិត្តបង្រៀន',
    'subject.assigned': 'បានចាត់តាំង',
    'subject.preferred': 'ចង់បាន',
    
    // Notifications
    'notification.markAllRead': 'សម្គាល់ទាំងអស់ថាបានអាន',
    'notification.noNew': 'គ្មានការជូនដំណឹងថ្មីទេ',
    'notification.viewAll': 'មើលទាំងអស់',
    
    // Auth
    'auth.email': 'អ៊ីមែល',
    'auth.password': 'ពាក្យសម្ងាត់',
    'auth.signIn': 'ចូល',
    'auth.signUp': 'ចុះឈ្មោះ',
    'auth.forgotPassword': 'ភ្លេចពាក្យសម្ងាត់?',
    'auth.dontHaveAccount': 'មិនទាន់មានគណនីមែនទេ?',
    'auth.alreadyHaveAccount': 'មានគណនីរួចហើយ?',
    
    // Errors
    'error.required': 'ផ្នែកនេះត្រូវការបំពេញ',
    'error.invalidEmail': 'អាសយដ្ឋានអ៊ីមែលមិនត្រឹមត្រូវ',
    'error.passwordTooShort': 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ',
    'error.loadingFailed': 'បរាជ័យក្នុងការផ្ទុកទិន្នន័យ',
    'error.saveFailed': 'បរាជ័យក្នុងការរក្សាទុកការផ្លាស់ប្តូរ',
    
    // Success messages
    'success.saved': 'រក្សាទុកការផ្លាស់ប្តូរបានជោគជ័យ',
    'success.deleted': 'លុបបានជោគជ័យ',
    'success.updated': 'ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Language;
    if (saved && (saved === 'en' || saved === 'km')) {
      setLanguageState(saved);
      document.documentElement.setAttribute('data-language', saved);
      document.documentElement.setAttribute('lang', saved === 'km' ? 'km' : 'en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    document.documentElement.setAttribute('data-language', lang);
    document.documentElement.setAttribute('lang', lang === 'km' ? 'km' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
