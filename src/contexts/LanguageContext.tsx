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
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.confirm': 'Confirm',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.offline': 'Offline',
    'common.online': 'Online',
    'common.reconnecting': 'Reconnecting...',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.mySchedule': 'My Schedule',
    'dashboard.notifications': 'Notifications',
    'dashboard.settings': 'Settings',
    'dashboard.logout': 'Logout',
    'dashboard.profile': 'Profile',
    'dashboard.stats': 'Statistics',
    
    // Teacher Dashboard
    'teacher.dashboard': 'Teacher Dashboard',
    'teacher.mySchedule': 'My Schedule',
    'teacher.availability': 'Availability',
    'teacher.subjects': 'Subject Teaching Preferences',
    'teacher.notifications': 'Notifications',
    'teacher.noSchedule': 'No schedule entries found for this week',
    'teacher.lastUpdated': 'Last updated',
    'teacher.weeklyClasses': 'Weekly Classes',
    'teacher.upcomingClasses': 'Upcoming Classes',
    'teacher.todaySchedule': 'Today\'s Schedule',
    'teacher.role': 'Teacher',
    
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
    'schedule.subject': 'Subject',
    'schedule.course': 'Course',
    'schedule.create': 'Create Schedule',
    'schedule.edit': 'Edit Schedule',
    'schedule.delete': 'Delete Schedule',
    'schedule.view': 'View Schedule',
    'schedule.export': 'Export Schedule',
    'schedule.noEntries': 'No schedule entries',
    
    // Availability
    'availability.set': 'Set Availability',
    'availability.available': 'Available',
    'availability.unavailable': 'Unavailable',
    'availability.dayOfWeek': 'Day of Week',
    'availability.startTime': 'Start Time',
    'availability.endTime': 'End Time',
    'availability.addSlot': 'Add Time Slot',
    'availability.removeSlot': 'Remove Time Slot',
    'availability.notSet': 'Availability not set',
    'availability.updated': 'Availability updated',
    
    // Subjects
    'subject.select': 'Select Subject',
    'subject.preferences': 'Teaching Preferences',
    'subject.assigned': 'Assigned',
    'subject.preferred': 'Preferred',
    'subject.name': 'Subject Name',
    'subject.code': 'Subject Code',
    'subject.hoursPerWeek': 'Hours per Week',
    'subject.noSubjects': 'No subjects available',
    
    // Notifications
    'notification.markAllRead': 'Mark All as Read',
    'notification.noNew': 'No new notifications',
    'notification.viewAll': 'View All',
    'notification.new': 'New Notification',
    'notification.unread': 'Unread',
    'notification.settings': 'Notification Settings',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.institution': 'Institution',
    
    // Errors
    'error.required': 'This field is required',
    'error.invalidEmail': 'Invalid email address',
    'error.passwordTooShort': 'Password must be at least 6 characters',
    'error.loadingFailed': 'Failed to load data',
    'error.saveFailed': 'Failed to save changes',
    'error.deleteFailed': 'Failed to delete',
    'error.networkError': 'Network error - please check your connection',
    'error.unauthorized': 'Unauthorized access',
    'error.notFound': 'Not found',
    'error.serverError': 'Server error - please try again later',
    'error.offline': 'You are offline - viewing last update',
    
    // Success messages
    'success.saved': 'Changes saved successfully',
    'success.deleted': 'Deleted successfully',
    'success.updated': 'Updated successfully',
    'success.created': 'Created successfully',
    'success.uploaded': 'Uploaded successfully',
    
    // Home Page
    'home.hero.title': 'AI-Powered Academic Scheduling',
    'home.hero.subtitle': 'Smart timetable optimization with bilingual support for Cambodian schools and universities',
    'home.hero.description': 'Detect conflicts automatically and save hours of scheduling work',
    'home.hero.builtForCambodia': 'Built for Cambodia',
    'home.hero.watchVideo': 'Watch Video',
    'home.stats.schoolsReady': 'Schools Ready',
    'home.stats.conflictDetection': 'Conflict Detection',
    'home.stats.timeSaved': 'Time Saved',
    'home.stats.support': 'Support',
    'home.features.title': 'Why Choose Caso Schedule Pro?',
    'home.features.subtitle': 'Advanced AI technology meets Cambodian educational needs',
    'home.features.aiOptimization': 'AI-Powered Optimization',
    'home.features.aiOptimizationDesc': 'Smart algorithms automatically detect conflicts and suggest optimal scheduling solutions.',
    'home.features.bilingual': 'Bilingual Interface',
    'home.features.bilingualDesc': 'Full Khmer and English support with proper font rendering for Cambodian educators.',
    'home.features.security': 'Multi-Tenant Security',
    'home.features.securityDesc': 'Each institution has isolated data with admin-controlled access management.',
    'home.features.conflictDetection': 'Conflict Detection',
    'home.features.conflictDetectionDesc': 'Real-time alerts prevent teacher, room, and resource scheduling conflicts.',
    'home.features.roleBasedAccess': 'Role-Based Access',
    'home.features.roleBasedAccessDesc': 'Structured permissions for Admins, Coordinators, and Teachers with clear workflows.',
    'home.features.instantOptimization': 'Instant Optimization',
    'home.features.instantOptimizationDesc': 'Generate complete timetables in seconds, not hours. Save 80% of scheduling time.',
    'home.cta.title': 'Ready to Transform Your Scheduling?',
    'home.cta.subtitle': 'Join hundreds of Cambodian schools already using AI-powered scheduling',
    'home.cta.requestDemo': 'Request Free Demo',
    'home.cta.contactSales': 'Contact Sales',
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
    'common.close': 'បិទ',
    'common.submit': 'ដាក់ស្នើ',
    'common.continue': 'បន្ត',
    'common.back': 'ត្រឡប់ក្រោយ',
    'common.next': 'បន្ទាប់',
    'common.previous': 'មុន',
    'common.confirm': 'បញ្ជាក់',
    'common.view': 'មើល',
    'common.download': 'ទាញយក',
    'common.upload': 'ផ្ទុកឡើង',
    'common.offline': 'គ្មានអ៊ីនធឺណិត',
    'common.online': 'មានអ៊ីនធឺណិត',
    'common.reconnecting': 'កំពុងភ្ជាប់ឡើងវិញ...',
    
    // Dashboard
    'dashboard.welcome': 'សូមស្វាគមន៍',
    'dashboard.overview': 'ទិដ្ឋភាពទូទៅ',
    'dashboard.mySchedule': 'កាលវិភាគរបស់ខ្ញុំ',
    'dashboard.notifications': 'ការជូនដំណឹង',
    'dashboard.settings': 'ការកំណត់',
    'dashboard.logout': 'ចាកចេញ',
    'dashboard.profile': 'ប្រវត្តិរូប',
    'dashboard.stats': 'ស្ថិតិ',
    
    // Teacher Dashboard
    'teacher.dashboard': 'ផ្ទាំងគ្រប់គ្រងគ្រូបង្រៀន',
    'teacher.mySchedule': 'កាលវិភាគរបស់ខ្ញុំ',
    'teacher.availability': 'ភាពអាចរកបាន',
    'teacher.subjects': 'ចំណូលចិត្តបង្រៀនមុខវិជ្ជា',
    'teacher.notifications': 'ការជូនដំណឹង',
    'teacher.noSchedule': 'រកមិនឃើញកាលវិភាគសម្រាប់សប្តាហ៍នេះទេ',
    'teacher.lastUpdated': 'បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ',
    'teacher.weeklyClasses': 'ថ្នាក់រៀនប្រចាំសប្តាហ៍',
    'teacher.upcomingClasses': 'ថ្នាក់រៀនខាងមុខ',
    'teacher.todaySchedule': 'កាលវិភាគថ្ងៃនេះ',
    'teacher.role': 'គ្រូបង្រៀន',
    
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
    'schedule.subject': 'មុខវិជ្ជា',
    'schedule.course': 'វគ្គសិក្សា',
    'schedule.create': 'បង្កើតកាលវិភាគ',
    'schedule.edit': 'កែសម្រួលកាលវិភាគ',
    'schedule.delete': 'លុបកាលវិភាគ',
    'schedule.view': 'មើលកាលវិភាគ',
    'schedule.export': 'នាំចេញកាលវិភាគ',
    'schedule.noEntries': 'គ្មានកាលវិភាគ',
    
    // Availability
    'availability.set': 'កំណត់ភាពអាចរកបាន',
    'availability.available': 'អាចរកបាន',
    'availability.unavailable': 'មិនអាចរកបាន',
    'availability.dayOfWeek': 'ថ្ងៃក្នុងសប្តាហ៍',
    'availability.startTime': 'ពេលចាប់ផ្តើម',
    'availability.endTime': 'ពេលបញ្ចប់',
    'availability.addSlot': 'បន្ថែមពេលវេលា',
    'availability.removeSlot': 'លុបពេលវេលា',
    'availability.notSet': 'មិនទាន់កំណត់ភាពអាចរកបាន',
    'availability.updated': 'បានធ្វើបច្ចុប្បន្នភាពភាពអាចរកបាន',
    
    // Subjects
    'subject.select': 'ជ្រើសរើសមុខវិជ្ជា',
    'subject.preferences': 'ចំណូលចិត្តបង្រៀន',
    'subject.assigned': 'បានចាត់តាំង',
    'subject.preferred': 'ចង់បាន',
    'subject.name': 'ឈ្មោះមុខវិជ្ជា',
    'subject.code': 'លេខកូដមុខវិជ្ជា',
    'subject.hoursPerWeek': 'ម៉ោងក្នុងមួយសប្តាហ៍',
    'subject.noSubjects': 'គ្មានមុខវិជ្ជា',
    
    // Notifications
    'notification.markAllRead': 'សម្គាល់ទាំងអស់ថាបានអាន',
    'notification.noNew': 'គ្មានការជូនដំណឹងថ្មីទេ',
    'notification.viewAll': 'មើលទាំងអស់',
    'notification.new': 'ការជូនដំណឹងថ្មី',
    'notification.unread': 'មិនទាន់អាន',
    'notification.settings': 'ការកំណត់ការជូនដំណឹង',
    
    // Auth
    'auth.email': 'អ៊ីមែល',
    'auth.password': 'ពាក្យសម្ងាត់',
    'auth.signIn': 'ចូល',
    'auth.signUp': 'ចុះឈ្មោះ',
    'auth.signOut': 'ចាកចេញ',
    'auth.forgotPassword': 'ភ្លេចពាក្យសម្ងាត់?',
    'auth.resetPassword': 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    'auth.dontHaveAccount': 'មិនទាន់មានគណនីមែនទេ?',
    'auth.alreadyHaveAccount': 'មានគណនីរួចហើយ?',
    'auth.firstName': 'នាមខ្លួន',
    'auth.lastName': 'នាមត្រកូល',
    'auth.institution': 'គ្រឹះស្ថាន',
    
    // Errors
    'error.required': 'ផ្នែកនេះត្រូវការបំពេញ',
    'error.invalidEmail': 'អាសយដ្ឋានអ៊ីមែលមិនត្រឹមត្រូវ',
    'error.passwordTooShort': 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ',
    'error.loadingFailed': 'បរាជ័យក្នុងការផ្ទុកទិន្នន័យ',
    'error.saveFailed': 'បរាជ័យក្នុងការរក្សាទុកការផ្លាស់ប្តូរ',
    'error.deleteFailed': 'បរាជ័យក្នុងការលុប',
    'error.networkError': 'កំហុសបណ្តាញ - សូមពិនិត្យការតភ្ជាប់របស់អ្នក',
    'error.unauthorized': 'គ្មានការអនុញ្ញាតឲ្យចូលប្រើ',
    'error.notFound': 'រកមិនឃើញ',
    'error.serverError': 'កំហុសម៉ាស៊ីនមេ - សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ',
    'error.offline': 'អ្នកនៅក្រៅបណ្តាញ - កំពុងមើលការធ្វើបច្ចុប្បន្នភាពចុងក្រោយ',
    
    // Success messages
    'success.saved': 'រក្សាទុកការផ្លាស់ប្តូរបានជោគជ័យ',
    'success.deleted': 'លុបបានជោគជ័យ',
    'success.updated': 'ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ',
    'success.created': 'បង្កើតបានជោគជ័យ',
    'success.uploaded': 'ផ្ទុកឡើងបានជោគជ័យ',
    
    // Home Page
    'home.hero.title': 'កាលវិភាគសិក្សាដោយ AI',
    'home.hero.subtitle': 'ការបង្កើតកាលវិភាគឆ្លាតវៃ ជាមួយនឹងការគាំទ្រភាសាទាំងពីរ សម្រាប់សាលារៀន និងសាកលវិទ្យាល័យកម្ពុជា',
    'home.hero.description': 'រកឃើញជម្លោះដោយស្វ័យប្រវត្តិ និងសន្សំពេលវេលារាប់ម៉ោងក្នុងការរៀបចំកាលវិភាគ',
    'home.hero.builtForCambodia': 'បង្កើតឡើងសម្រាប់កម្ពុជា',
    'home.hero.watchVideo': 'មើលវីដេអូ',
    'home.stats.schoolsReady': 'សាលារៀនរួចរាល់',
    'home.stats.conflictDetection': 'ការរកឃើញជម្លោះ',
    'home.stats.timeSaved': 'ពេលវេលាដែលសន្សំបាន',
    'home.stats.support': 'ការគាំទ្រ',
    'home.features.title': 'ហេតុអ្វីត្រូវជ្រើសរើស Caso Schedule Pro?',
    'home.features.subtitle': 'បច្ចេកវិទ្យា AI កម្រិតខ្ពស់ ជួបនឹងតម្រូវការអប់រំរបស់កម្ពុជា',
    'home.features.aiOptimization': 'ការបង្កើនប្រសិទ្ធភាពដោយ AI',
    'home.features.aiOptimizationDesc': 'ក្បួនដោះស្រាយឆ្លាតវៃ រកឃើញជម្លោះដោយស្វ័យប្រវត្តិ និងផ្តល់យោបល់ដំណោះស្រាយកាលវិភាគល្អបំផុត។',
    'home.features.bilingual': 'ចំណុចប្រទាក់ពីរភាសា',
    'home.features.bilingualDesc': 'ការគាំទ្រពេញលេញភាសាខ្មែរ និងអង់គ្លេស ជាមួយនឹងការបង្ហាញពុម្ពអក្សរខ្មែរដ៏ត្រឹមត្រូវ សម្រាប់អ្នកអប់រំកម្ពុជា។',
    'home.features.security': 'សុវត្ថិភាពពហុអ្នកភ្ជៅទេស',
    'home.features.securityDesc': 'គ្រឹះស្ថាននីមួយៗមានទិន្នន័យដាច់ដោយឡែក ជាមួយនឹងការគ្រប់គ្រងការចូលប្រើដោយអ្នកគ្រប់គ្រង។',
    'home.features.conflictDetection': 'ការរកឃើញជម្លោះ',
    'home.features.conflictDetectionDesc': 'ការជូនដំណឹងតាមពេលវេលាជាក់ស្តែង ការពារជម្លោះគ្រូបង្រៀន បន្ទប់ និងធនធាន។',
    'home.features.roleBasedAccess': 'ការចូលប្រើតាមតួនាទី',
    'home.features.roleBasedAccessDesc': 'សិទ្ធិអនុញ្ញាតមានរចនាសម្ព័ន្ធ សម្រាប់អ្នកគ្រប់គ្រង អ្នកសម្របសម្រួល និងគ្រូបង្រៀន ជាមួយនឹងលំហូរការងារច្បាស់លាស់។',
    'home.features.instantOptimization': 'ការបង្កើនប្រសិទ្ធភាពភ្លាមៗ',
    'home.features.instantOptimizationDesc': 'បង្កើតកាលវិភាគពេញលេញក្នុងពេលប៉ុន្មានវិនាទី មិនមែនរាប់ម៉ោងទេ។ សន្សំបាន 80% នៃពេលវេលារៀបចំកាលវិភាគ។',
    'home.cta.title': 'រួចរាល់ក្នុងការផ្លាស់ប្តូរការរៀបចំកាលវិភាគរបស់អ្នក?',
    'home.cta.subtitle': 'ចូលរួមជាមួយសាលារៀនកម្ពុជារាប់រយ ដែលកំពុងប្រើប្រាស់ការកាលវិភាគដោយ AI',
    'home.cta.requestDemo': 'ស្នើសុំការបង្ហាញដោយឥតគិតថ្លៃ',
    'home.cta.contactSales': 'ទាក់ទងផ្នែកលក់',
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
