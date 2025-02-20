import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './dialog';

export default function InfoDialog({
  state,
  api,
  link
}: {
  state: string;
  api: string;
  link: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary'>Click here for more info</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='capitalize'>
            {state} {api} API
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {state === 'unavailable' ? (
            <p>
              The current browser supports the {api} API, but it can&apos;t be
              used at the moment. For example, because there isn&apos;t enough
              free disk space available to download the model.
              <br />
              <br />
              For more info, visit{' '}
              <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                className='underline font-medium text-primary'
              >
                this
              </a>{' '}
              section of Google&apos;s {api} API documentation
            </p>
          ) : (
            <>
              <p>
                To enable the {api} API, you must update Chrome to the latest
                version. Then, follow these steps:
              </p>
              <ol>
                <li>
                  Go to{' '}
                  <a
                    href='chrome://flags/#language-detection-api.'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline font-medium text-primary'
                  >
                    chrome://flags/#language-detection-api.
                  </a>
                </li>

                <li>Select Enabled.</li>

                <li>Click Relaunch or restart Chrome.</li>
              </ol>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
