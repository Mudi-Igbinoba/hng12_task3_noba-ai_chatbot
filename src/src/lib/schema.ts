import { z } from 'zod';

export const formSchema = z.object({
  text: z.string().min(2, { message: 'Try writing a longer text' })
});

export const languagesSchema = z.object({
  language: z.string({
    required_error: 'Please select a language.'
  })
});
