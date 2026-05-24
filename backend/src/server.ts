import app from './app';
import { env } from './configs/environment';
import { initializeFirebase } from './configs/firebase';
import { logger } from './utils/logger';

function start(): void {
  initializeFirebase();
  logger.info('Firebase initialized successfully');

  app.listen(env.port, () => {
    logger.info(`ioPet backend running on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
