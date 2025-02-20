'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from './navigation-menu';
import { ModeToggle } from './mode-toggle';
import { modak } from '@/lib/fonts';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className='py-8 md:px-12 sm:px-6 px-3 shadow shadow-primary/50 text-lg'>
      <NavigationMenu>
        <NavigationMenuList className='justify-between text-center'>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/' legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  modak.className
                } sm:text-5xl text-4xl leading-relaxed hover:bg-transparent focus:bg-transparent active:bg-transparent text-primary/60 dark:text-primary hover:text-primary/60 `}
              >
                NOBA AI
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            
              <Link href='/chat' legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    `${navigationMenuTriggerStyle()} hover:bg-primary/80 dark:hover:bg-primary hover:text-white font-bold`,
                    {
                      'border-b-2 border-b-primary': pathname === '/chat'
                    }
                  )}
                >
                  Chat
                </NavigationMenuLink>
              </Link>
         
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
