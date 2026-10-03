import { test, expect } from '@playwright/test';

test('End-to-end checkout flow', async ({ page, request }) => {
  // 1. Merchant signs up
  const email = `test_merchant_${Date.now()}@example.com`;
  
  await page.goto('/signup');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', 'Password123!');
  await page.fill('input[name="business_name"]', 'Test Business');
  await page.click('button[type="submit"]');

  // Verify redirected to dashboard
  await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 30000 });
  await expect(page.locator('text=Analytics')).toBeVisible({ timeout: 10000 });

  // 2. Merchant creates a new product
  await page.goto('/dashboard/products');
  await page.click('button:has-text("New product")');
  await page.fill('input[name="name"]', 'Pro Plan');
  await page.fill('input[name="price"]', '500'); // ₹500
  await page.click('button:has-text("Create product")');

  // Wait for product to appear
  await expect(page.locator('text=Pro Plan')).toBeVisible();

  // We need an API key to create a checkout session
  await page.goto('/dashboard/developers');
  await page.click('button:has-text("Create key")');
  
  // The API key is shown in an alert dialog
  const apiKey = await page.locator('code').first().textContent();
  expect(apiKey).toContain('sk_test_');

  await page.click(`button:has-text("I've saved it")`);

  // Get the product ID from the API
  const productsResponse = await request.get('/api/v1/products', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const productsData = await productsResponse.json();
  const productId = productsData.data[0].id;

  // 3. Create a checkout session via API
  const sessionResponse = await request.post('/api/v1/checkout_sessions', {
    headers: { Authorization: `Bearer ${apiKey}` },
    data: {
      product_id: productId,
      customer_ref: 'cust_123',
      success_url: 'http://localhost:3000/success-page',
      cancel_url: 'http://localhost:3000/cancel-page'
    }
  });
  const sessionData = await sessionResponse.json();
  if (!sessionData.url) {
    throw new Error('Failed to create checkout session: ' + JSON.stringify(sessionData));
  }
  const checkoutUrl = sessionData.url;

  // 4. Simulate consumer visiting the checkout page
  await page.goto(checkoutUrl);
  
  // Intercept the create payment request to get the order ID
  let orderId = '';
  page.on('response', async response => {
    if (response.url().includes('/pay') && response.request().method() === 'POST') {
      try {
        const data = await response.json();
        if (data && data.order_id) {
          orderId = data.order_id;
        }
      } catch (e) {
        // ignore
      }
    }
  });

  // Verify product details
  await expect(page.locator('text=Pro Plan')).toBeVisible();
  await expect(page.locator('text=₹500.00')).toBeVisible();

  // 5. Complete payment using Razorpay test mode
  // Note: Since this is Razorpay test mode, when we click "Pay Now", 
  // it might open the Razorpay popup. We'll simulate clicking it, 
  // and in an actual e2e test we might mock Razorpay or just ensure the popup opens.
  // Actually, we can intercept the Razorpay script or rely on mock implementation if we configured one.
  // Let's just click Pay Now and wait for the request to go out.
  
  // In a real environment, Playwright can interact with the Razorpay frame.
  // We will intercept the Razorpay checkout script and just call the success handler.
  await page.route('https://checkout.razorpay.com/v1/checkout.js', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.Razorpay = function(options) {
          this.options = options;
          this.on = function(event, callback) {};
          this.open = function() {
            // Immediately simulate success callback
            setTimeout(() => {
              this.options.handler({ razorpay_payment_id: 'pay_test123', razorpay_order_id: this.options.order_id, razorpay_signature: 'test_sig' });
            }, 500);
          };
        };
      `
    });
  });

  await page.route('**/api/v1/public/checkout_sessions/*/verify', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success_url: 'http://localhost:3000/success-page' })
    });
  });

  const html = await page.content();
  console.log('PAGE HTML BEFORE PAY:', html);
  await page.click('button:has-text("Pay Now")');

  // Wait for the order ID to be intercepted
  await expect.poll(() => orderId).toBeTruthy();

  // Send the mock Razorpay webhook to the backend to complete the sale
  const crypto = require('crypto');
  const webhookPayload = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: `pay_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          order_id: orderId,
          status: 'captured',
          amount: 50000,
          currency: 'INR',
          method: 'card'
        }
      }
    }
  };
  const payloadString = JSON.stringify(webhookPayload);
  const secret = '0ffc94b3e7d609fdcd8d241e2b1e8c6e5d30f967b6205e6b0f2e15a8f207cc32';
  const signature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');

  const response = await request.post('http://localhost:8080/api/v1/gateway-webhooks/razorpay/test', {
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': signature
    },
    data: payloadString
  });

  console.log('WEBHOOK RESPONSE STATUS:', response.status());
  console.log('WEBHOOK RESPONSE BODY:', await response.text());

  // It should redirect to successUrl
  await expect(page).toHaveURL(/success-page/, { timeout: 15000 });

  // 6. Verify sale appears in merchant dashboard
  await page.goto('/dashboard/sales');
  await expect(page.locator('text=Pro Plan')).toBeVisible();
  await expect(page.locator('text=cust_123')).toBeVisible();
});
