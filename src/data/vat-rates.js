export const vatRates = [
  // EU Member States (27)
  { country: 'Austria', code: 'AT', rate: 20, taxName: 'VAT' },
  { country: 'Belgium', code: 'BE', rate: 21, taxName: 'VAT' },
  { country: 'Bulgaria', code: 'BG', rate: 20, taxName: 'VAT' },
  { country: 'Croatia', code: 'HR', rate: 25, taxName: 'VAT' },
  { country: 'Cyprus', code: 'CY', rate: 19, taxName: 'VAT' },
  { country: 'Czech Republic', code: 'CZ', rate: 21, taxName: 'VAT' },
  { country: 'Denmark', code: 'DK', rate: 25, taxName: 'VAT' },
  { country: 'Estonia', code: 'EE', rate: 24, taxName: 'VAT' },
  { country: 'Finland', code: 'FI', rate: 25.5, taxName: 'VAT' },
  { country: 'France', code: 'FR', rate: 20, taxName: 'VAT' },
  { country: 'Germany', code: 'DE', rate: 19, taxName: 'VAT' },
  { country: 'Greece', code: 'GR', rate: 24, taxName: 'VAT' },
  { country: 'Hungary', code: 'HU', rate: 27, taxName: 'VAT' },
  { country: 'Ireland', code: 'IE', rate: 23, taxName: 'VAT' },
  { country: 'Italy', code: 'IT', rate: 22, taxName: 'VAT' },
  { country: 'Latvia', code: 'LV', rate: 21, taxName: 'VAT' },
  { country: 'Lithuania', code: 'LT', rate: 21, taxName: 'VAT' },
  { country: 'Luxembourg', code: 'LU', rate: 17, taxName: 'VAT' },
  { country: 'Malta', code: 'MT', rate: 18, taxName: 'VAT' },
  { country: 'Netherlands', code: 'NL', rate: 21, taxName: 'VAT' },
  { country: 'Poland', code: 'PL', rate: 23, taxName: 'VAT' },
  { country: 'Portugal', code: 'PT', rate: 23, taxName: 'VAT' },
  { country: 'Romania', code: 'RO', rate: 19, taxName: 'VAT' },
  { country: 'Slovakia', code: 'SK', rate: 23, taxName: 'VAT' },
  { country: 'Slovenia', code: 'SI', rate: 22, taxName: 'VAT' },
  { country: 'Spain', code: 'ES', rate: 21, taxName: 'VAT' },
  { country: 'Sweden', code: 'SE', rate: 25, taxName: 'VAT' },

  // Non-EU Europe
  { country: 'United Kingdom', code: 'GB', rate: 20, taxName: 'VAT' },
  { country: 'Switzerland', code: 'CH', rate: 8.1, taxName: 'VAT' },
  { country: 'Norway', code: 'NO', rate: 25, taxName: 'VAT' },
  { country: 'Iceland', code: 'IS', rate: 24, taxName: 'VAT' },
  { country: 'Turkey', code: 'TR', rate: 20, taxName: 'VAT' },

  // Asia-Pacific
  { country: 'Australia', code: 'AU', rate: 10, taxName: 'GST' },
  { country: 'New Zealand', code: 'NZ', rate: 15, taxName: 'GST' },
  { country: 'Japan', code: 'JP', rate: 10, taxName: 'Consumption Tax' },
  { country: 'South Korea', code: 'KR', rate: 10, taxName: 'VAT' },
  { country: 'India', code: 'IN', rate: 18, taxName: 'GST' },
  { country: 'Singapore', code: 'SG', rate: 9, taxName: 'GST' },
  { country: 'Taiwan', code: 'TW', rate: 5, taxName: 'VAT' },
  { country: 'Thailand', code: 'TH', rate: 7, taxName: 'VAT' },
  { country: 'Vietnam', code: 'VN', rate: 10, taxName: 'VAT' },
  { country: 'Philippines', code: 'PH', rate: 12, taxName: 'VAT' },
  { country: 'Malaysia', code: 'MY', rate: 8, taxName: 'Sales Tax' },
  { country: 'Indonesia', code: 'ID', rate: 11, taxName: 'VAT' },
  { country: 'China', code: 'CN', rate: 13, taxName: 'VAT' },

  // Middle East & Africa
  { country: 'UAE', code: 'AE', rate: 5, taxName: 'VAT' },
  { country: 'Saudi Arabia', code: 'SA', rate: 15, taxName: 'VAT' },
  { country: 'Bahrain', code: 'BH', rate: 10, taxName: 'VAT' },
  { country: 'Israel', code: 'IL', rate: 17, taxName: 'VAT' },
  { country: 'South Africa', code: 'ZA', rate: 15.5, taxName: 'VAT' },
  { country: 'Nigeria', code: 'NG', rate: 7.5, taxName: 'VAT' },
  { country: 'Kenya', code: 'KE', rate: 16, taxName: 'VAT' },
  { country: 'Egypt', code: 'EG', rate: 14, taxName: 'VAT' },
  { country: 'Morocco', code: 'MA', rate: 20, taxName: 'VAT' },

  // Americas
  { country: 'United States', code: 'US', rate: 0, taxName: 'Sales Tax' },
  { country: 'Canada', code: 'CA', rate: 5, taxName: 'GST' },
  { country: 'Mexico', code: 'MX', rate: 16, taxName: 'VAT' },
  { country: 'Brazil', code: 'BR', rate: 17, taxName: 'VAT' },
  { country: 'Argentina', code: 'AR', rate: 21, taxName: 'VAT' },
  { country: 'Chile', code: 'CL', rate: 19, taxName: 'VAT' },
  { country: 'Colombia', code: 'CO', rate: 19, taxName: 'VAT' },
  { country: 'Peru', code: 'PE', rate: 18, taxName: 'VAT' },
  { country: 'Uruguay', code: 'UY', rate: 22, taxName: 'VAT' },
];

export function findVatRate(countryCode) {
  return vatRates.find(v => v.code === countryCode) || null;
}

export function countryFlag(code) {
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65),
  );
}
