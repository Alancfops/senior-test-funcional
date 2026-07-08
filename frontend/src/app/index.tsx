import { Redirect, Href } from 'expo-router';
import { useEffect, useState } from 'react';

import { getAccessToken } from '@/lib/auth/storage';

export default function Index() {
  const [href, setHref] = useState<Href | null>(null);

  useEffect(() => {
    getAccessToken().then((token) => {
      setHref(token ? '/(main)' : '/(auth)/login');
    });
  }, []);

  if (!href) {
    return null;
  }

  return <Redirect href={href} />;
}
