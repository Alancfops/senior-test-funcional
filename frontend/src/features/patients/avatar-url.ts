import { env } from '@/lib/config/env';

export function resolvePatientAvatarUrl(avatarUrl: string | null | undefined) {
  if (!avatarUrl) {
    return null;
  }

  if (avatarUrl.startsWith('http') || avatarUrl.startsWith('data:')) {
    return avatarUrl;
  }

  return `${env.apiUrl}${avatarUrl}`;
}
