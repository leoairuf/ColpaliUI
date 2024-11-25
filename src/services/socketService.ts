import { Message, PDFPreview } from '../types';

const SOCKET_CONFIG = {
  PDF_UPLOAD: { host: '127.0.0.1', port: 49203 },
  QUERY: { host: '127.0.0.1', port: 49200 },
  CHUNKS: { host: '127.0.0.1', port: 49301 },
  ANSWER: { host: '127.0.0.1', port: 49202 },
};

export async function uploadPDFs(files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach(file => formData.append('data_pdf', file));

  try {
    const response = await fetch(`http://${SOCKET_CONFIG.PDF_UPLOAD.host}:${SOCKET_CONFIG.PDF_UPLOAD.port}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('PDF upload failed');
    }
  } catch (error) {
    console.error('Error uploading PDFs:', error);
    throw error;
  }
}

export async function sendQuery(query: string): Promise<{ 
  images: PDFPreview[],
  answer: string 
}> {
  try {
    // Send query
    const queryResponse = await fetch(`http://${SOCKET_CONFIG.QUERY.host}:${SOCKET_CONFIG.QUERY.port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queries: { "0": query } }),
    });

    if (!queryResponse.ok) {
      throw new Error('Query failed');
    }

    // Get images stream
    const imageStream = await fetch(`http://${SOCKET_CONFIG.CHUNKS.host}:${SOCKET_CONFIG.CHUNKS.port}`);
    const images = await imageStream.json();

    // Get answer stream
    const answerStream = new EventSource(`http://${SOCKET_CONFIG.ANSWER.host}:${SOCKET_CONFIG.ANSWER.port}`);
    
    return new Promise((resolve, reject) => {
      let answer = '';
      
      answerStream.onmessage = (event) => {
        answer += event.data;
      };

      answerStream.onerror = () => {
        answerStream.close();
        resolve({ images: images.images["0"], answer });
      };
    });
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
}