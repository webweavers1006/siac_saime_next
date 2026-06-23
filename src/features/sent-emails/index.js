// Barrel exports for sent-emails feature.
// SECURITY: Only export config, constants, and pure utilities.
// NEVER export server-only functions (prisma, getSession, sendEmail) through this barrel.

export { SENT_EMAIL_CONFIG } from './config/sent-email.constants';
