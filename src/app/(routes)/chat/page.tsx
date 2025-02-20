'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ChatContext } from '@/lib/ChatContext';
import { formSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect, useRef } from 'react';
import { Bomb, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SelectLanguage from '@/components/ui/SelectLanguage';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

export default function ChatPage() {
  dayjs.extend(localizedFormat);
  const chatContext = useContext(ChatContext);

  if (!chatContext) throw new Error('ChatContext is missing!');

  const { chatHistory, addMessage, summarizeText, loadingState } = chatContext;

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const languages = new Intl.DisplayNames(['en'], {
    type: 'language'
  });
  const convertLanguage = (code: string) => {
    return languages.of(code);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: ''
    }
  });

  const textValue = form.watch('text');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.text.trim()) return;

    await addMessage('user', values.text);

    console.log(
      'Stored Chat History:',
      JSON.parse(localStorage.getItem('chatHistory') || '[]')
    );

    form.reset();
  }

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <section className='flex flex-col gap-y-4 w-full sm:text-base text-sm'>
      <div className='grow flex flex-col gap-y-4 flex-1 overflow-y-scroll max-h-[70vh]'>
        {chatHistory.length > 0 &&
          chatHistory.map((chat, index) => (
            <div key={chat.id} className='space-y-8'>
              <div
                className={`${
                  chat.role === 'ai' && 'ml-auto'
                } space-y-5 lg:w-3/5 md:w-4/5 bg-secondary p-6 rounded-2xl`}
              >
                <p className='leading-relaxed'>{chat.content}</p>

                <div className='flex justify-between md:flex-row flex-col gap-y-4'>
                  <div className='text-muted-foreground mt-auto italic text-xs space-y-2'>
                    <p>
                      Detected Language: {convertLanguage(chat.sourceLanguage)}{' '}
                      ({chat.confidence}% confident)
                    </p>

                    <p>{dayjs(chat.timestamp).format('LLL')}</p>
                  </div>

                  {index === chatHistory.length - 1 && (
                    <div className='space-y-3'>
                      <SelectLanguage
                        messageId={chat.id}
                        content={chat.content}
                        sourceLang={chat.sourceLanguage}
                        confidence={chat.confidence}
                        scroll={scrollToBottom}
                      />
                      {chat.content.length >= 150 &&
                        convertLanguage(chat.sourceLanguage) === 'English' && (
                          <Button
                            className='w-full'
                            onClick={() => {
                              summarizeText(
                                chat.id,
                                chat.content,
                                chat.sourceLanguage,
                                chat.confidence
                              );
                              if (loadingState.summarizer !== chat.id) {
                                scrollToBottom();
                              }
                            }}
                            disabled={
                              loadingState.summarizer === chat.id ||
                              loadingState.translator !== null
                            }
                          >
                            {loadingState.summarizer === chat.id
                              ? 'Summarizing...'
                              : 'Summarize'}
                          </Button>
                        )}
                    </div>
                  )}
                </div>
              </div>
              {chat.aiResponses?.map((ai) => {
                const {
                  role,
                  content,
                  confidence,
                  timestamp,
                  detectedLanguage
                } = ai;

                return (
                  <div
                    key={ai.id}
                    className={`${
                      role === 'ai' && 'ml-auto'
                    } space-y-5 lg:w-3/5 md:w-4/5  bg-primary/20 p-6 rounded-2xl`}
                  >
                    <p className='leading-relaxed'>{formatMessage(content)}</p>

                    <div className='text-muted-foreground mt-auto italic text-xs space-y-2'>
                      <p>
                        Detected Language: {convertLanguage(detectedLanguage)} (
                        {confidence}% confident)
                      </p>

                      <p>{dayjs(timestamp).format('LLL')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {chatHistory.length === 0 && (
          <div className='self-center my-auto space-y-5 text-center xl:w-1/2 lg:w-3/5 md:w-4/5 w-[90%]'>
            <Bomb size={100} className='mx-auto animate-pulse' />
            <p className='sm:text-2xl text-xl font-medium '>
              Here seems kinda empty, don&apos;t you think? This place is
              probably gonna self destruct without your{' '}
              <span className='italic text-primary underline'>input</span>
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className='flex flex-col w-full h-auto min-h-[100px]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='p-0 mt-auto h-auto flex flex-col grow flex-1 gap-2 w-full rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] focus-within:ring focus-within:ring-primary/50 focus-within:outline-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
          >
            <FormField
              control={form.control}
              name='text'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel hidden>Input</FormLabel>
                  <FormControl>
                    <Textarea
                      className='w-full min-h-[50px] h-auto p-4 resize-y border-0 ring-0 outline-none bg-transparent  placeholder:text-muted-foreground text-base focus:ring-0 focus:outline-none focus-within:outline-0'
                      placeholder='Write your text here...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={
                loadingState.summarizer !== null ||
                loadingState.translator !== null ||
                !textValue
              }
              type='submit'
              size='icon'
              className='ml-auto my-2 mr-2 self-end'
            >
              <Send />
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
