export class MockWebSocketService {
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(private url: string) {}

  connect() {
    console.log('Mock WebSocket connected');
  }

  on(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  send(type: string, data: any) {
    // Simulate assistant response
    if (type === 'query') {
      setTimeout(() => {
        const handler = this.messageHandlers.get('message');
        if (handler) {
          handler({
            content: `This is a mock response to: "${data.text}"\n\n\`\`\`python\nprint("Hello World!")\n\`\`\``,
          });
        }

        // Simulate document retrieval
        const docsHandler = this.messageHandlers.get('documents');
        if (docsHandler) {
          docsHandler([
            {
              id: '1',
              pageNumber: 1,
              imageUrl: 'https://images.unsplash.com/photo-1706880095428-cf2f7901c5a3?w=500&auto=format',
              score: 0.95,
              pdfUrl: 'https://example.com/doc1.pdf'
            },
            {
              id: '2',
              pageNumber: 2,
              imageUrl: 'https://images.unsplash.com/photo-1706880095428-cf2f7901c5a3?w=500&auto=format',
              score: 0.85,
              pdfUrl: 'https://example.com/doc1.pdf'
            }
          ]);
        }
      }, 1000);
    }

    // Simulate file upload
    if (type === 'upload') {
      setTimeout(() => {
        const handler = this.messageHandlers.get('upload_complete');
        if (handler) {
          handler({});
        }
      }, 1500);
    }
  }

  uploadFiles(files: File[]) {
    this.send('upload', { files: files.map(f => f.name) });
  }
}