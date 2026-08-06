import { Redirect, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { getAccessToken } from '@/lib/auth/storage';
import { tokens } from '@/theme/tokens';

/**
 * Rota inicial: decide login × app autenticado.
 * A splash longa fica no `_layout`; aqui só evita flash branco enquanto resolve o token.
 */
export default function Index() {
  const [href, setHref] = useState<Href | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getAccessToken().then((token) => {
      if (cancelled) {
        return;
      }
      setHref((token ? '/(main)' : '/(auth)/login') as Href);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!href) {
    return <View style={{ flex: 1, backgroundColor: tokens.colors.splashGradientEnd }} />;
  }

  return <Redirect href={href} />;
}
