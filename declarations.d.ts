// declarations.d.ts (place at project root or in src/types/)

// Tell TS to trust the Google Fonts packages (they ship JS, not full .d.ts)
declare module '@expo-google-fonts/libre-baskerville';
declare module '@expo-google-fonts/playfair-display';

// Optional: if you import static assets directly anywhere, these help TS:
declare module '*.png' {
  const uri: string;
  export default uri;
}
declare module '*.jpg' {
  const uri: string;
  export default uri;
}
declare module '*.jpeg' {
  const uri: string;
  export default uri;
}
declare module '*.gif' {
  const uri: string;
  export default uri;
}
declare module '*.mp3' {
  const asset: number; // Expo bundler returns a numeric module id
  export default asset;
}
