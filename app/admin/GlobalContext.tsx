'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
// type PageStates = {
//   [pageName: string]: {
//     [stateKey: string]: any; // مثل: 'products', 'categories', 'formData' و ...
//   };
// };

// type AppContextType = {
//   states: PageStates;
//   setState: (page: string, key: string, value: any) => void;
//   resetState: (page: string, key?: string) => void;
//   navigate: (to: string) => void;
// };

var initialState = {};

interface PageStates {
  [pageName: string]: {
    [stateKey: string]: any;
  };
}

const GlobalContext = createContext<any>(undefined);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [states, setStates] = useState<any>(initialState);

  // بارگذاری از localStorage هنگام تغییر صفحه
  useEffect(() => {
    if (!pathname) return;
    const stored = localStorage.getItem(`pageState:${pathname}`);
    if (stored) {
      setStates(prev => ({ ...prev, [pathname]: JSON.parse(stored) }));
    } else {
      setStates(prev => ({ ...prev, [pathname]: {} }));
    }
  }, [pathname]);






  // ذخیره خودکار در localStorage
  // useEffect(() => {
  //   if (!pathname || !states[pathname]) return;
  //   localStorage.setItem(`pageState:${pathname}`, JSON.stringify(states[pathname]));
  // }, [pathname, pathname ? states[pathname] : undefined]);

  const setState = useCallback((page: string, key: string, value: any, persist = false) => {
    setStates(prev => {
      const updatedState = {
        ...(prev ? prev : {}),
        [page]: {
          ...(prev?.[page] || {}),
          [key]: value,
        },
      };
      if (persist) {
        if (!pathname || !states[pathname]) return;
        localStorage.setItem(`pageState:${pathname}`, JSON.stringify(states[pathname]));
      }
      return updatedState;
    });
  }, []);

  const resetState = useCallback((page: string, key?: string) => {
    setStates(prev => {
      if (!prev) return prev; // Add this line to check if prev is null or undefined

      if (!key) {
        // حذف کل state صفحه
        const copy = { ...prev };
        delete copy[page];
        localStorage.removeItem(`pageState:${page}`);
        return copy;
      }
      // حذف فقط یک key از state صفحه
      const pageState = prev[page] || {};
      const newPageState = { ...pageState };
      delete newPageState[key];
      localStorage.setItem(`pageState:${page}`, JSON.stringify(newPageState));
      return {
        ...prev,
        [page]: newPageState,
      };
    });
  }, []);

  const navigate = useCallback(
    (to: string) => {
      router.push(to);
    },
    [router]
  );

  return (
    <GlobalContext.Provider value={{ states, setState, resetState, navigate }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
