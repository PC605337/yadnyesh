import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Accessibility, 
  Type, 
  Eye, 
  Volume2, 
  Mouse, 
  Keyboard,
  Settings,
  X
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  darkMode: boolean;
  announceChanges: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  focusVisible: true,
  darkMode: false,
  announceChanges: true
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  
  const [showPanel, setShowPanel] = useState(false);
  const [announceElement, setAnnounceElement] = useState<HTMLDivElement | null>(null);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}px`);
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }
    
    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('accessibility-focus-visible');
    } else {
      root.classList.remove('accessibility-focus-visible');
    }
    
    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;
      
      // Skip to main content (Alt + M)
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          announceToScreenReader('Skipped to main content');
        }
      }
      
      // Open accessibility panel (Alt + A)
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowPanel(prev => !prev);
        announceToScreenReader(showPanel ? 'Accessibility panel closed' : 'Accessibility panel opened');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, showPanel]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const announceToScreenReader = (message: string) => {
    if (!settings.announceChanges || !announceElement) return;
    
    announceElement.textContent = message;
    setTimeout(() => {
      if (announceElement) announceElement.textContent = '';
    }, 1000);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    announceToScreenReader('Accessibility settings reset to default');
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {/* Screen reader announcements */}
      <div
        ref={setAnnounceElement}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      {/* Accessibility toggle button */}
      <Button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg"
        aria-label="Open accessibility options"
        title="Accessibility Options (Alt + A)"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      {/* Accessibility panel */}
      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility Options
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPanel(false)}
                aria-label="Close accessibility panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-4 space-y-6">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4" />
                  Font Size: {settings.fontSize}px
                </label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                  min={12}
                  max={24}
                  step={1}
                  aria-label="Adjust font size"
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Eye className="h-4 w-4" />
                  High Contrast
                </label>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                  aria-label="Toggle high contrast mode"
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Mouse className="h-4 w-4" />
                  Reduce Motion
                </label>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                  aria-label="Toggle reduced motion"
                />
              </div>

              {/* Screen Reader Mode */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Volume2 className="h-4 w-4" />
                  Screen Reader Mode
                </label>
                <Switch
                  checked={settings.screenReaderMode}
                  onCheckedChange={(checked) => updateSettings({ screenReaderMode: checked })}
                  aria-label="Toggle screen reader mode"
                />
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Navigation
                </label>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSettings({ keyboardNavigation: checked })}
                  aria-label="Toggle keyboard navigation"
                />
              </div>

              {/* Focus Indicators */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Settings className="h-4 w-4" />
                  Enhanced Focus
                </label>
                <Switch
                  checked={settings.focusVisible}
                  onCheckedChange={(checked) => updateSettings({ focusVisible: checked })}
                  aria-label="Toggle enhanced focus indicators"
                />
              </div>

              {/* Announcements */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Volume2 className="h-4 w-4" />
                  Announce Changes
                </label>
                <Switch
                  checked={settings.announceChanges}
                  onCheckedChange={(checked) => updateSettings({ announceChanges: checked })}
                  aria-label="Toggle change announcements"
                />
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={resetSettings}
                  variant="outline" 
                  className="w-full"
                  aria-label="Reset accessibility settings to default"
                >
                  Reset to Default
                </Button>
              </div>

              {/* Keyboard shortcuts info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                <p><strong>Keyboard Shortcuts:</strong></p>
                <p>Alt + A: Toggle this panel</p>
                <p>Alt + M: Skip to main content</p>
                <p>Tab: Navigate between elements</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        onFocus={() => announceToScreenReader('Skip to main content link focused')}
      >
        Skip to main content
      </a>

      {/* Main content wrapper */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// CSS that should be added to your global styles
export const accessibilityStyles = `
  /* High contrast mode */
  .accessibility-high-contrast {
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
    --primary: 0 0% 0%;
    --primary-foreground: 0 0% 100%;
    --muted: 0 0% 90%;
    --muted-foreground: 0 0% 10%;
    --border: 0 0% 50%;
  }

  /* Reduced motion */
  .accessibility-reduced-motion *,
  .accessibility-reduced-motion *::before,
  .accessibility-reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Enhanced focus indicators */
  .accessibility-focus-visible *:focus {
    outline: 3px solid hsl(var(--primary)) !important;
    outline-offset: 2px !important;
  }

  /* Screen reader only class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .sr-only.focus:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }

  /* Font size scaling */
  html {
    font-size: var(--accessibility-font-size, 16px);
  }
`;