'use client';
import {
  createContext,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from 'react';
type ScopeStyle = CSSProperties & { [key: `--${string}`]: string | number };
interface PortalTheme {
  'data-hextech-ui-theme'?: 'hextech';
  'data-color-mode'?: 'dark' | 'light';
  style?: ScopeStyle;
}
const ThemeContext = createContext<PortalTheme>({});
export interface ThemeScopeProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
  colorMode?: 'dark' | 'light';
  style?: ScopeStyle;
}
/** Repeats this scope's explicit theme and token overrides across React portals. */
export function ThemeScope({ colorMode = 'dark', style, children, ...props }: ThemeScopeProps) {
  const value = useMemo<PortalTheme>(() => {
    const tokens = Object.fromEntries(
      Object.entries(style || {}).filter(([key]) => key.startsWith('--')),
    );
    return {
      'data-hextech-ui-theme': 'hextech',
      'data-color-mode': colorMode,
      ...(Object.keys(tokens).length && { style: tokens }),
    };
  }, [colorMode, style]);
  return (
    <ThemeContext.Provider value={value}>
      <div {...props} {...value} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export function usePortalTheme(): PortalTheme {
  return useContext(ThemeContext);
}
