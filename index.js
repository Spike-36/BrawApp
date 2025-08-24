// index.js
import { registerRootComponent } from 'expo';
import App from './App';

// This registers "main" for native (what AppDelegate expects)
// and works with Metro / Expo as well.
registerRootComponent(App);
