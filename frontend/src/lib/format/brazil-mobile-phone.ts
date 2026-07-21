/** Formato de exibição: (NN) 9 NNNN-NNNN — celular BR com 11 dígitos. */
export const BRAZIL_MOBILE_PHONE_DISPLAY_REGEX = /^\(\d{2}\) 9 \d{4}-\d{4}$/;

export const BRAZIL_MOBILE_PHONE_MASK_MAX_LENGTH = 16;

export function formatBrazilMobilePhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) {
    return '';
  }

  if (digits.length <= 2) {
    return digits.length === 2 ? `(${digits}) ` : `(${digits}`;
  }

  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);

  let formatted = `(${areaCode}) ${subscriber.slice(0, 1)}`;

  if (subscriber.length > 1) {
    formatted += ` ${subscriber.slice(1, 5)}`;
  }

  if (subscriber.length > 5) {
    formatted += `-${subscriber.slice(5, 9)}`;
  }

  return formatted;
}
