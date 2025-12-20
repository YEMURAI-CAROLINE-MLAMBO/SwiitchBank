import { createWorker } from 'tesseract.js';

export const extractTextFromFile = async (file) => {
  const worker = await createWorker();
  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(file.path);
    return text;
  } catch (error) {
    console.error('Error during OCR processing:', error);
    return ''; // Return empty string on error
  } finally {
    await worker.terminate();
  }
};
