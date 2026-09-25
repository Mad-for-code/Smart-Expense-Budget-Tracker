const registerWebModuleFn = function(m) {
  if (typeof m === 'function') {
    try {
      return new m();
    } catch (e) {
      try {
        return m();
      } catch (err) {
        return m;
      }
    }
  }
  return m;
};

if (typeof window !== 'undefined') {
  window.registerWebModule = window.registerWebModule || registerWebModuleFn;
}
if (typeof globalThis !== 'undefined') {
  globalThis.registerWebModule = globalThis.registerWebModule || registerWebModuleFn;
}

import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  if (rootTag) {
    AppRegistry.runApplication('main', {
      initialProps: {},
      rootTag,
    });
  }
}
