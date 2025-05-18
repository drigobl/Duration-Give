interface Country {
  code: string;
  name: string;
}

export function useCountries() {
  const countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    // Add more countries as needed
  ];

  return { countries };
}