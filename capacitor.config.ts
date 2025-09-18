import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4e9225406733482a98ecb6d8fe6ffbbe',
  appName: 'yash-ventures',
  webDir: 'dist',
  server: {
    url: 'https://4e922540-6733-482a-98ec-b6d8fe6ffbbe.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;