import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Globe } from 'lucide-react';

type Language = 'en' | 'km';

interface LanguageToggleProps {
  onLanguageChange?: (language: Language) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'badge' | 'switch';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  onLanguageChange, 
  size = 'md',
  variant = 'button'
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'km' : 'en';
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
    
    // Store preference in localStorage
    localStorage.setItem('preferred-language', newLanguage);
    
    // Apply to document for CSS targeting
    document.documentElement.setAttribute('data-language', newLanguage);
  };

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'km')) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.setAttribute('data-language', savedLanguage);
      onLanguageChange?.(savedLanguage);
    }
  }, [onLanguageChange]);

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      default: return 'default';
    }
  };

  if (variant === 'badge') {
    return (
      <Badge 
        variant="outline" 
        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={toggleLanguage}
      >
        <Globe className="h-3 w-3 mr-1" />
        {currentLanguage === 'en' ? 'English' : 'ខ្មែរ'}
      </Badge>
    );
  }

  if (variant === 'switch') {
    return (
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${currentLanguage === 'en' ? 'font-medium' : 'text-muted-foreground'}`}>
          En
        </span>
        <button
          onClick={toggleLanguage}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          role="switch"
          aria-checked={currentLanguage === 'km'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              currentLanguage === 'km' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${currentLanguage === 'km' ? 'font-medium' : 'text-muted-foreground'}`}>
          ខ្មែរ
        </span>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      size={getButtonSize()}
      onClick={toggleLanguage}
      className="transition-all hover:scale-105"
    >
      <Languages className="h-4 w-4 mr-2" />
      {currentLanguage === 'en' ? (
        <>
          <span>English</span>
          <span className="ml-2 text-xs text-muted-foreground">→ ខ្មែរ</span>
        </>
      ) : (
        <>
          <span>ខ្មែរ</span>
          <span className="ml-2 text-xs text-muted-foreground">→ En</span>
        </>
      )}
    </Button>
  );
};

export default LanguageToggle;