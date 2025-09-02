import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'km'>('en');
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', nameKm: 'ដើម' },
    { name: 'Features', href: '/features', nameKm: 'លក្ខណៈពិសេស' },
    { name: 'User Roles', href: '/user-roles', nameKm: 'តួនាទីអ្នកប្រើប្រាស់' },
    { name: 'How It Works', href: '/how-it-works', nameKm: 'របៀបប្រើប្រាស់' },
    { name: 'AI Advantage', href: '/ai-advantage', nameKm: 'អត្ថប្រយោជន៍ AI' },
    { name: 'About', href: '/about', nameKm: 'អំពី' },
    { name: 'Contact', href: '/contact', nameKm: 'ទំនាក់ទំនង' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CS</span>
            </div>
            <span className="font-bold text-xl text-primary">
              {language === 'en' ? 'Caso Schedule Pro' : 'កាសូ កាលវិភាគ ប្រូ'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors hover:text-primary ${
                  isActive(item.href) 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                {language === 'en' ? item.name : item.nameKm}
              </Link>
            ))}
          </div>

          {/* Language Switcher & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{language === 'en' ? 'EN' : 'ខ្មែរ'}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('km')}>
                  🇰🇭 ខ្មែរ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="hero" size="sm">
              {language === 'en' ? 'Request Demo' : 'ស្នើសុំការបង្ហាញ'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('km')}>
                  🇰🇭 ខ្មែរ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {language === 'en' ? item.name : item.nameKm}
                </Link>
              ))}
              <div className="pt-4">
                <Button variant="hero" className="w-full">
                  {language === 'en' ? 'Request Demo' : 'ស្នើសុំការបង្ហាញ'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;