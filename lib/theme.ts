import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',  // Color principal (botones, pestañas activas)
    background: '#f5f5f5', // Fondo de la app
    surface: '#ffffff',   // Fondo de tarjetas, inputs, etc.
    tertiary: '#333333',      // Color de texto
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',   // Morado claro para modo oscuro
    background: '#121212', // Fondo oscuro
    surface: '#1E1E1E',   // Superficies oscuras (tarjetas, etc.)
    tertiary: '#E0E0E0',      // Texto claro
  },
};