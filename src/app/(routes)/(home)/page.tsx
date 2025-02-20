'use client';

import { Button } from '@/components/ui/button';
import { modak } from '@/lib/fonts';
import { isChrome } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function Home() {
  const [showAlert, setShowAlert] = useState(true);

  if (showAlert) {
    return (
      <>
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent className='border-destructive'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-destructive font-bold flex gap-x-2 underline underline-offset-4'>
                <AlertCircle className='inline' />
                <span>Important Notice: Chrome Browser Required</span>
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogDescription className='space-y-4 '>
              <span className='block'>
                NOBA AI is powered by advanced Chrome AI APIs, enabling seamless
                language detection, translation, and summarization.
              </span>

              <span className='block'>
                If you&apos;re not using Google Chrome, some features may not
                work as expected.
              </span>

              <span className='block'>
                To experience the full power of NOBA AI, please switch to Google
                Chrome and ensure that experimental AI features are enabled in
                your browser settings.
              </span>

              <span className='block font-bold'>
                For the best experience, open NOBA AI in Chrome!{' '}
              </span>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <section className='flex md:flex-row flex-col gap-10 items-center justify-start md:pr-12 md:pb-0 pb-8 '>
          <div className='md:w-1/2 w-full -z-10'>
            <Skeleton className='block w-full md:h-screen h-[60vh] object-cover' />
          </div>

          <div className='md:w-1/2 space-y-5'>
            <Skeleton className='h-4 w-3/5'></Skeleton>
            <Skeleton className='h-10 w-1/2'></Skeleton>

            <Skeleton className='rounded-full h-5 w-1/4'></Skeleton>
          </div>
        </section>
      </>
    );
  }
  return (
    <section className='flex md:flex-row flex-col gap-10 items-center justify-start md:pr-12 md:pb-0 pb-8 '>
      <div className='md:w-1/2 w-full -z-10'>
        <Image
          className='block w-full md:h-screen h-[60vh] object-cover'
          src='/spiral.jpg'
          alt=''
          width={2268}
          height={4032}
          priority
        />
      </div>

      <div className='md:w-1/2 space-y-4 md:px-0 sm:px-6 px-3 md:text-left text-center'>
        <h1 className={`${modak.className} sm:text-2xl text-xl`}>
          Unlock the Power of <span className='text-primary '>AI</span> for
          Smarter, Faster Communication
        </h1>
        <p>
          Welcome to NOBA AI, the intelligent text processing assistant that
          helps you summarize, translate, and understand languages with ease.
        </p>
        <Link href='/chat' prefetch={false}>
          <Button
            size='lg'
            className='rounded-full font-bold hover:bg-primary/80'
          >
            Get Started
          </Button>
        </Link>

        <p className='text-destructive mt-4'>
          Note: NOBA AI is currently only available on Google Chrome.
        </p>
      </div>
    </section>
  );
}
