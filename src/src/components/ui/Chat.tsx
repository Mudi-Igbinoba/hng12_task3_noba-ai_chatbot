// import { useEffect, useState } from 'react';
// import SelectLanguage from './SelectLanguage';
// import { Button } from './button';
// import { Alert, AlertDescription } from './alert';
// import { CircularProgress } from './circular-progress';
// import InfoDialog from './InfoDialog';

// export default function Chat({ text }: { text: string }) {
//   const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>(
//     ''
//   );
//   const [sourceLanguage, setSourceLanguage] = useState<string>('');
//   const [targetLanguage, setTargetLanguage] = useState<string>('');
//   const [translatedText, setTranslatedText] = useState<string>('');
//   const [makeSummary, setMakeSummary] = useState<boolean>(false);

//   const [loadingState, setLoadingState] = useState({
//     languageDetector: 'checking',
//     translator: 'checking',
//     summarizer: 'checking'
//   });
//   const [progress, setProgress] = useState({
//     languageDetector: 0,
//     translator: 0,
//     summarizer: 0
//   });
//   const [confidence, setConfidence] = useState<number | undefined>();
//   const handleDownloadProgress = (
//     e: { loaded: number; total: number },
//     api: string
//   ) => {
//     const newProgress = (e.loaded / e.total) * 100;

//     setLoadingState((prevState) => ({
//       ...prevState,
//       [api]: `downloading`
//     }));

//     if (api === 'languageDetector') {
//       if (newProgress > progress.languageDetector + 2) {
//         setTimeout(() => {
//           setProgress((prevState) => ({
//             ...prevState,
//             languageDetector: newProgress
//           }));
//         }, 400);
//       }
//     } else {
//       if (newProgress > progress.summarizer + 2) {
//         setTimeout(() => {
//           setProgress((prevState) => ({
//             ...prevState,
//             summarizer: newProgress
//           }));
//         }, 400);
//       }
//     }

//     if (newProgress >= 100) {
//       setTimeout(() => {
//         setLoadingState((prevState) => ({
//           ...prevState,
//           [api]: 'enabled'
//         }));
//       }, 1000);
//     }
//   };

//   const handleProgressStyles = (e: string) => {
//     if (e === 'disabled') {
//       return 'text-red-500';
//     } else if (e === 'downloading' || e === 'unavailable') {
//       return 'text-yellow-500';
//     } else if (e === 'enabled') {
//       return 'text-green-500';
//     } else {
//       return 'text-muted-foreground';
//     }
//   };
//   useEffect(() => {
//     (async () => {
//       if (
//         typeof window !== 'undefined' &&
//         typeof window.ai === 'object' &&
//         window.ai !== null
//       ) {
//         // Language Detector
//         if ('languageDetector' in window.ai) {
//           console.log('Language Detector is available');
//           const languageDetectorCapabilities =
//             await window?.ai?.languageDetector?.capabilities();
//           const canDetect = languageDetectorCapabilities?.capabilities;
//           let detector;

//           if (canDetect === 'no') {
//             setLoadingState((prevState) => ({
//               ...prevState,
//               languageDetector: 'unavailable'
//             }));
//             return;
//           }

//           if (canDetect === 'readily') {
//             detector = await window?.ai?.languageDetector?.create();
//             setLoadingState((prevState) => ({
//               ...prevState,
//               languageDetector: 'enabled'
//             }));
//           } else {
//             detector = await window?.ai?.languageDetector?.create({
//               monitor(m) {
//                 m.addEventListener(
//                   'downloadprogress',
//                   (e: { loaded: number; total: number }) => {
//                     handleDownloadProgress(e, 'languageDetector');
//                   }
//                 );
//               }
//             });
//             await detector?.ready;
//           }

//           if (text) {
//             const results = await detector?.detect(text);
//             if (results && results.length > 0) {
//               const firstResult = results[0];
//               setSourceLanguage(firstResult?.detectedLanguage || '');
//               const languages = new Intl.DisplayNames(['en'], {
//                 type: 'language'
//               });
//               setDetectedLanguage(languages.of(sourceLanguage));
//               setConfidence(Math.floor(firstResult?.confidence * 100) || 0);
//             } else {
//               console.error('No language detected.');
//               setSourceLanguage('');
//               setConfidence(0);
//             }
//           }
//         } else {
//           setLoadingState((prevState) => ({
//             ...prevState,
//             languageDetector: 'disabled'
//           }));
//         }

//         // Translator
//         if ('translator' in window.ai) {
//           console.log('Translator is available');
//           const translatorCapabilities =
//             await window?.ai?.translator?.capabilities();
//           const canTranslate = translatorCapabilities?.capabilities;
//           let translator;

//           if (sourceLanguage && targetLanguage) {
//             if (canTranslate === 'no') {
//               setLoadingState((prevState) => ({
//                 ...prevState,
//                 translator: 'unavailable'
//               }));
//               return;
//             }

//             if (canTranslate === 'readily') {
//               translator = await window?.ai?.translator?.create({
//                 sourceLanguage,
//                 targetLanguage
//               });
//               setLoadingState((prevState) => ({
//                 ...prevState,
//                 translator: 'enabled'
//               }));
//             } else {
//               setLoadingState((prevState) => ({
//                 ...prevState,
//                 translator: 'enabled'
//               }));
//               translator = await window?.ai?.translator?.create({
//                 sourceLanguage,
//                 targetLanguage,
//                 monitor(m) {
//                   m.addEventListener(
//                     'downloadprogress',
//                     (e: { loaded: number; total: number }) => {
//                       handleDownloadProgress(e, 'translator');
//                     }
//                   );
//                 }
//               });
//               await translator?.ready;
//             }

//             const translatedText = await translator?.translate(text);
//             setTranslatedText(translatedText || '');
//           }
//         } else {
//           setLoadingState((prevState) => ({
//             ...prevState,
//             translator: 'disabled'
//           }));
//         }

//         // Summarizer
//         if ('summarizer' in window.ai) {
//           const options = {
//             sharedContext: '',
//             type: 'key-points',
//             format: 'markdown',
//             length: 'medium'
//           };

//           const summarizerCapabilities =
//             await window?.ai?.summarizer?.capabilities();
//           const canSummarize = summarizerCapabilities?.available;
//           let summarizer;

//           if (canSummarize === 'no') {
//             setLoadingState((prevState) => ({
//               ...prevState,
//               summarizer: 'unavailable'
//             }));
//             return;
//           }

//           if (canSummarize === 'readily') {
//             summarizer = await window?.ai?.summarizer?.create(options);
//             setLoadingState((prevState) => ({
//               ...prevState,
//               summarizer: 'enabled'
//             }));
//           } else {
//             summarizer = await window?.ai?.summarizer?.create(options);
//             summarizer?.addEventListener(
//               'downloadprogress',
//               (e: { loaded: number; total: number }) => {
//                 console.log(e.loaded, e.total);
//                 handleDownloadProgress(e, 'summarizer');
//               }
//             );
//             await summarizer?.ready;
//           }

//           if (makeSummary) {
//             const summary = await summarizer?.summarize(text, {
//               context: ''
//             });

//             setTranslatedText(summary || '');

//             setMakeSummary(false);
//           }
//         } else {
//           setLoadingState((prevState) => ({
//             ...prevState,
//             summarizer: 'disabled'
//           }));
//         }
//       }
//     })();
//   }, [text, sourceLanguage, targetLanguage, makeSummary]); // You might need to include `text`, `sourceLanguage`, and `targetLanguage` as dependencies

//   return (
//     <>
//       <Alert>
//         <AlertDescription>
//           <div className='space-y-4'>
//             <div className='flex items-center gap-x-5'>
//               <p>Language Detection API:</p>

//               <p
//                 className={`${handleProgressStyles(
//                   loadingState.languageDetector
//                 )} flex items-center gap-x-2.5 italic`}
//               >
//                 <span className='capitalize'>
//                   {loadingState.languageDetector}
//                 </span>{' '}
//                 {loadingState.languageDetector === 'disabled' ? (
//                   <InfoDialog
//                     state='disabled'
//                     api='language detector'
//                     link='https://developer.chrome.com/docs/ai/language-detection#add_support_to_localhost'
//                   />
//                 ) : loadingState.languageDetector === 'unavailable' ? (
//                   <InfoDialog
//                     state='unavailable'
//                     api='language detector'
//                     link='https://developer.chrome.com/docs/ai/language-detection#model_download'
//                   />
//                 ) : loadingState.languageDetector.includes('download') ? (
//                   <CircularProgress value={progress.languageDetector} />
//                 ) : (
//                   ''
//                 )}
//               </p>
//             </div>

//             <div className='flex gap-x-5'>
//               <p>Translator API</p>

//               <p
//                 className={`${handleProgressStyles(
//                   loadingState.translator
//                 )} flex items-center gap-x-2.5 italic`}
//               >
//                 <span className='capitalize'>{loadingState.translator}</span>{' '}
//                 {loadingState.translator === 'disabled' ? (
//                   <InfoDialog
//                     state='disabled'
//                     api='translator'
//                     link='https://developer.chrome.com/docs/ai/translator-api#add_support_to_localhost'
//                   />
//                 ) : loadingState.translator === 'unavailable' ? (
//                   <InfoDialog
//                     state='unavailable'
//                     api='translator'
//                     link='https://developer.chrome.com/docs/ai/translator-api#language-support'
//                   />
//                 ) : loadingState.translator.includes('download') ? (
//                   <CircularProgress value={progress.translator} />
//                 ) : (
//                   ''
//                 )}
//               </p>
//             </div>

//             <div className='flex gap-x-5'>
//               <p>Summarize</p>

//               <p
//                 className={`${handleProgressStyles(
//                   loadingState.summarizer
//                 )} flex items-center gap-x-2.5 italic`}
//               >
//                 <span className='capitalize'>{loadingState.summarizer}</span>{' '}
//                 {loadingState.summarizer === 'disabled' ? (
//                   <InfoDialog
//                     state='disabled'
//                     api='summmarizer'
//                     link='https://developer.chrome.com/docs/ai/translator-api#add_support_to_localhost'
//                   />
//                 ) : loadingState.summarizer === 'unavailable' ? (
//                   <InfoDialog
//                     state='unavailable'
//                     api='summarizer'
//                     link='https://developer.chrome.com/docs/ai/translator-api#language-support'
//                   />
//                 ) : loadingState.summarizer.includes('download') ? (
//                   <CircularProgress value={progress.summarizer} />
//                 ) : (
//                   ''
//                 )}
//               </p>
//             </div>
//           </div>
//         </AlertDescription>
//       </Alert>
//       <div className='grow  flex flex-col gap-y-4'>
//         <div className='space-y-3'>
//           <p>{text}</p>
//           {text && (
//             <p className='text-muted-foreground  italic text-xs'>
//               Detected Language: {detectedLanguage} ({confidence}% confident)
//             </p>
//           )}
//           {text && (
//             <div className='flex gap-x-5'>
//               {text.length >= 150 && detectedLanguage === 'English' && (
//                 <Button onClick={() => setMakeSummary(true)}>Summarize</Button>
//               )}

//               <SelectLanguage
//                 sourceLang={sourceLanguage}
//                 setTargetLang={setTargetLanguage}
//               />
//             </div>
//           )}
//         </div>

//         <div className='ml-auto space-y-3'>
//           <p>{translatedText}</p>
//           {translatedText && (
//             <p className='text-muted-foreground  italic text-xs'>
//               Detected Language: {detectedLanguage} ({confidence}% confident)
//             </p>
//           )}
//           {translatedText && (
//             <div className='flex gap-x-5'>
//               <SelectLanguage
//                 sourceLang={sourceLanguage}
//                 setTargetLang={setTargetLanguage}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
