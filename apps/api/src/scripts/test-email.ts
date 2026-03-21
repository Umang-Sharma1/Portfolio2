/**
 * Quick test script to verify Web3Forms email integration
 * Run with: npx ts-node src/scripts/test-email.ts
 */
import { config } from '../config';
import { sendContactNotification, isEmailEnabled } from '../utils/email';

async function main() {
  console.log('📧 Email Test Script (Web3Forms)');
  console.log('================================');
  console.log(`Web3Forms Key: ${config.email.web3formsAccessKey ? '✅ SET' : '❌ NOT SET'}`);
  console.log(`Email Enabled: ${isEmailEnabled() ? '✅ YES' : '❌ NO'}`);
  console.log('');

  if (!isEmailEnabled()) {
    console.error('❌ Email is not enabled. Check WEB3FORMS_ACCESS_KEY in your .env file.');
    process.exit(1);
  }

  console.log('Sending test email via Web3Forms...');

  // Direct test for full visibility
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.email.web3formsAccessKey,
        subject: '[Portfolio Contact] Test Email',
        from_name: 'Voyager.OS Portfolio',
        name: 'Test User',
        email: 'test@example.com',
        message:
          'This is a test email from your Voyager.OS portfolio to verify Web3Forms integration.',
      }),
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      console.log('Response body:', JSON.stringify(data, null, 2));
      if (data.success) {
        console.log('✅ Test email sent successfully! Check your inbox.');
      } else {
        console.error('❌ Failed:', data.message);
        process.exit(1);
      }
    } catch {
      console.log('Raw response (not JSON):', text.substring(0, 500));
      process.exit(1);
    }
  } catch (err: any) {
    console.error('❌ Fetch error:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
