import { createApp } from './app';

const PORT = Number(process.env['PORT']) || 3000;

async function start(): Promise<void> {
  const app = await createApp({ port: PORT });
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${String(PORT)}`);
  });
}

void start();
