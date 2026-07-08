import { useEffect, useState } from 'react';

import { getSessionUser, SessionUser } from '@/lib/auth/storage';

export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    getSessionUser().then(setUser);
  }, []);

  return user;
}
