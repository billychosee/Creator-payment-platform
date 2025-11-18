/// <reference types="next" />
/// <reference types="next/image-types/global" />

// CSS module declarations for TypeScript
declare module '*.css' {
  const content: string;
  export default content;
}

// CSS global declarations (for side-effect imports like import './globals.css')
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Allow CSS imports in general
declare module '*.css' {
  const styles: any;
  export = styles;
}