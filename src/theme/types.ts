export interface ThemeColors {
    primary: string;
    primaryDark: string;
    background: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    border: string;
    overlay: string;
    shadow: string;
  }
  
  export interface Theme {
    colors: ThemeColors;
    fonts: {
      regular: string;
      bold: string;
      light: string;
    };
    metrics: {
      padding: number;
      margin: number;
      borderRadius: number;
      shadowRadius: number;
    };
  }