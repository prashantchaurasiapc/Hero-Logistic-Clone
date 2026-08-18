import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Adjust the import if needed

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState('#FFD400');
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      const res = await api.get('/white-label-configs');
      if (res.success && res.data && res.data.length > 0) {
        // Assuming the first config is the global/tenant config
        const config = res.data[0];
        
        if (config.logoLightUrl) {
          const baseUrl = api.defaults.baseURL.replace('/api/v1', '');
          let finalUrl = config.logoLightUrl;
          if (finalUrl.startsWith('/uploads')) {
            finalUrl = baseUrl + finalUrl;
          }
          setLogoUrl(finalUrl);
        }
      }
      
      const themeRes = await api.get('/themes');
      if (themeRes.success && themeRes.data && themeRes.data.length > 0) {
        const globalTheme = themeRes.data.find(t => t.name === 'Workspace_Theme') || themeRes.data[0];
        if (globalTheme && globalTheme.accentColor) {
          setThemeColor(globalTheme.accentColor);
        }
      }
    } catch (error) {
      console.error('Failed to fetch global branding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateThemeContext = (newColor, newLogoUrl) => {
    if (newColor) setThemeColor(newColor);
    if (newLogoUrl) {
      const baseUrl = api.defaults.baseURL.replace('/api/v1', '');
      let finalUrl = newLogoUrl;
      if (finalUrl.startsWith('/uploads')) {
        finalUrl = baseUrl + finalUrl;
      }
      setLogoUrl(finalUrl);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  useEffect(() => {
    // Apply CSS variables dynamically
    document.documentElement.style.setProperty('--primary-color', themeColor);
    document.documentElement.style.setProperty('--primary-color-hover', themeColor);
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, logoUrl, updateThemeContext, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { themeColor: '#FFD400', logoUrl: null, updateThemeContext: () => {}, isLoading: false };
  }
  return context;
};
