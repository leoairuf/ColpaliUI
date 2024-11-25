export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(private url: string) {}

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data);
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 1000);
    };
  }

  on(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  send(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  uploadFiles(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    
    this.send('upload', formData);
  }
}