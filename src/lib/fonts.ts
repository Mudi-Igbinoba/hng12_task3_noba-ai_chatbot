import { Geist, Geist_Mono, Modak, Montserrat } from 'next/font/google';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const modak = Modak({
  weight: '400',
  variable: '--font-modak',
  subsets: ['latin']
});

export const monty = Montserrat({
  weight: ['100', '200', '300', '500', '600', '700', '800', '900'],
  variable: '--font-monty',
  subsets: ['latin']
});
