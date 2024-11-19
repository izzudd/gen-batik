import WebSocket from 'ws';

export default defineEventHandler(async () => {
  const { comfyUrl } = useRuntimeConfig();
  const TIMEOUT = 5000; // 5 second timeout
  
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(`ws://${comfyUrl}/ws?clientId=${'0'.repeat(32)}`);
      
      const timer = setTimeout(() => {
        ws.close();
        reject(createError({ 
          status: 503, 
          message: 'Connection timeout' 
        }));
      }, TIMEOUT);

      ws.on('error', () => {
        clearTimeout(timer);
        reject(createError({ 
          status: 503, 
          message: 'Failed to connect to server' 
        }));
      });

      ws.on('open', () => {
        clearTimeout(timer);
        ws.close();
        resolve({ status: 'ok' });
      });
    } catch (error) {
      reject(createError({ 
        status: 503, 
        message: 'Failed to initialize connection' 
      }));
    }
  });
});