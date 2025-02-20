import { languagesSchema } from '@/lib/schema';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command';
import { useContext } from 'react';
import { ChatContext } from '@/lib/ChatContext';
const languages = [
  { label: 'English', value: 'en' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Spanish', value: 'es' },
  { label: 'Russian', value: 'ru' },
  { label: 'Turkish', value: 'tr' },
  { label: 'French', value: 'fr' }
];

export default function SelectLanguage({
  messageId,
  content,
  sourceLang,
  confidence,
  scroll
}: {
  messageId: string;
  content: string;
  sourceLang: string;
  confidence: number;
  scroll: () => void;
}) {
  const chatContext = useContext(ChatContext);

  if (!chatContext) throw new Error('ChatContext is missing!');

  const { translateMessage, loadingState } = chatContext;
  const form = useForm<z.infer<typeof languagesSchema>>({
    resolver: zodResolver(languagesSchema)
  });

  const langInput = form.watch('language');

  function onSubmit(data: z.infer<typeof languagesSchema>) {
    translateMessage(messageId, content, sourceLang, data.language, confidence);
  }

  return (
    <div className='ml-auto '>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex lg:flex-row flex-col gap-2.5 lg:items-center'
        >
          <FormField
            control={form.control}
            name='language'
            disabled={loadingState.translator === messageId}
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel hidden>Language</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        aria-label='select language'
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'lg:w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? languages
                              .filter((lan) => lan.value !== sourceLang)
                              .find(
                                (language) => language.value === field.value
                              )?.label
                          : 'Select language...'}
                        <ChevronsUpDown className='opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput
                        placeholder='Search language...'
                        className='h-9'
                      />
                      <CommandList>
                        <CommandEmpty>Language not found.</CommandEmpty>
                        <CommandGroup>
                          {languages
                            .filter((lan) => lan.value !== sourceLang)
                            .map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue('language', language.value);
                                }}
                              >
                                {language.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    language.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <Button
            aria-label='translate'
            disabled={
              loadingState.translator === messageId ||
              loadingState.summarizer !== null ||
              !langInput
            }
            type='submit'
            onClick={() => {
              if (loadingState.translator !== messageId) {
                scroll();
              }
            }}
          >
            {loadingState.translator === messageId
              ? 'Translating...'
              : 'Translate'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
