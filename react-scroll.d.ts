declare module 'react-scroll' {
  import * as React from 'react';

  // Define the Link component with specific props
  export interface LinkProps {
      to: string;
      smooth?: boolean;
      duration?: number;
      offset?: number;
      spy?: boolean;
      exact?: boolean;
      hashSpy?: boolean;
      activeClass?: string;
      className?: string;
      style?: React.CSSProperties;
      onClick?: React.MouseEventHandler<HTMLAnchorElement>;
      children?: React.ReactNode; // Include children prop here
  }

  export const Link: React.FC<LinkProps>;

  // Define animateScroll with specific methods
  export const animateScroll: {
      scrollToTop: () => void;
      scrollToBottom: () => void;
      scrollMore: (px: number) => void;
      scrollTo: (to: number | string, options?: { smooth?: boolean; duration?: number }) => void;
  };
}
