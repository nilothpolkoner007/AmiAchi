import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { MainStack } from './components/MainStack';
import { Application } from '@nativescript/core';

// Initialize Supabase before app starts
import './services/supabase';

// Controls react-nativescript log verbosity.
Object.defineProperty(global, '__DEV__', { value: false });

// Handle uncaught errors
Application.on(Application.uncaughtErrorEvent, (args) => {
  if (global.__DEV__) {
    console.error(args.error);
  }
});

ReactNativeScript.start(React.createElement(MainStack, {}, null));