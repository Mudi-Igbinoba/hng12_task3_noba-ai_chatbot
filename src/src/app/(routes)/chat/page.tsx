'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ChatContext } from '@/lib/ChatContext';
import { formSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SelectLanguage from '@/components/ui/SelectLanguage';

export default function ChatPage() {
  const chatContext = useContext(ChatContext);

  if (!chatContext) throw new Error('ChatContext is missing!');

  const { chatHistory, addMessage, summarizeText, loadingState } = chatContext;

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.text.trim()) return;

    await addMessage('user', values.text);

    // Check local storage after adding a message
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
    <section className='flex flex-col w-full'>
      <div className='grow flex flex-col gap-y-4'>
        {chatHistory.map((chat, index) => (
          <div key={chat.id}>
            <div
              key={chat.id}
              className={`${
                chat.role === 'ai' && 'ml-auto text-right'
              } space-y-3 w-4/5`}
            >
              <p>{chat.content}</p>

              <div className='flex items-center justify-between'>
                <p className='text-muted-foreground italic text-xs'>
                  Detected Language: {convertLanguage(chat.sourceLanguage)} (
                  {chat.confidence}% confident)
                </p>
                {index === chatHistory.length - 1 && (
                  <div className=' space-y-4'>
                    {/* Summarization Button */}
                    {chat.content.length >= 150 &&
                      convertLanguage(chat.sourceLanguage) === 'English' && (
                        <Button
                          onClick={() =>
                            summarizeText(
                              chat.id,
                              chat.content,
                              chat.sourceLanguage,
                              chat.confidence
                            )
                          }
                          disabled={loadingState.summarizer === chat.id}
                        >
                          {loadingState.summarizer === chat.id
                            ? 'Summarizing...'
                            : 'Summarize'}
                        </Button>
                      )}

                    <SelectLanguage
                      messageId={chat.id}
                      content={chat.content}
                      sourceLang={chat.sourceLanguage}
                      confidence={chat.confidence}
                    />
                  </div>
                )}
              </div>
            </div>
            {chat.aiResponses?.map((ai) => {
              const {
                role,
                content,
                confidence,
                // sourceLanguage,
                // timestamp,

                detectedLanguage
              } = ai;

              return (
                <div
                  key={ai.id}
                  className={`${
                    role === 'ai' && 'ml-auto text-right'
                  } space-y-3 w-4/5`}
                >
                  <p>{formatMessage(content)}</p>

                  <div>
                    <p className='text-muted-foreground  italic text-xs'>
                      Detected Language: {convertLanguage(detectedLanguage)} (
                      {confidence}% confident)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-h-[25vh] min-h-[15vh] flex gap-x-2'
        >
          <FormField
            control={form.control}
            name='text'
            render={({ field }) => (
              <FormItem className='grow flex mt-auto  flex-col gap-y-1.5'>
                {/* <FormLabel>Username</FormLabel> */}
                <FormControl>
                  <Textarea
                    className='grow'
                    placeholder='Write your text here'
                    {...field}
                  />
                </FormControl>

                {/* <FormMessage className='' /> */}
              </FormItem>
            )}
          />
          <Button
            disabled={
              loadingState.summarizer !== null ||
              loadingState.translator !== null
            }
            type='submit'
            size='icon'
            className='mt-auto'
          >
            <Send />
          </Button>
        </form>
      </Form>
    </section>
  );
}
