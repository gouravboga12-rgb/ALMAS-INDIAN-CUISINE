# Connecting Square Payment Gateway to ALMAS Indian Cuisine

This guide provides a comprehensive, step-by-step developer tutorial for integrating the **Square payment gateway** into your custom HTML static frontend and Node.js Express backend.

---

## Razorpay vs. Square: Comparison

Yes, **Square** is very similar in function to **Razorpay**, but they target different markets and ecosystems:

| Feature | Razorpay | Square |
| :--- | :--- | :--- |
| **Primary Region** | India | US, Canada, UK, Australia, Japan |
| **Payment Options** | UPI, Netbanking, Credit/Debit cards, wallets | Credit/Debit Cards, Google Pay, Apple Pay, Afterpay |
| **Hardware** | Mostly online-only (some soundboxes/POS) | Industry-leading POS hardware (Registers, Terminals, Readers) |
| **Unified System** | Focuses on online payouts & subscriptions | Synchronizes in-store retail/restaurant sales with online checkout |

Integrating Square consists of two parts:
1. **Client-Side (Web Payments SDK):** Secures the payment inputs on the checkout page and generates a secure card token (`sourceId`).
2. **Server-Side (Node.js SDK):** Receives the token on your server and makes a secure backend call to Square API to charge the customer.

---

## Step-by-Step Integration Process

### Step 1: Retrieve Credentials from Square Dashboard
1. Log in to the [Square Developer Dashboard](https://app.squareup.com/dashboard) (or [Sandbox Dashboard](https://developer.squareup.com/) for testing).
2. Click **New Application** and name it (e.g., `ALMAS-Cuisine`).
3. Open the application panel and copy the following credentials:
   - **Application ID**
   - **Access Token**
   - **Location ID** (Found under the "Locations" tab in the sidebar)

### Step 2: Install Node.js Square SDK
In your backend directory, run:
```bash
npm install square
```

Add the copied credentials to your `.env` file:
```env
SQUARE_APPLICATION_ID=your_sandbox_or_live_application_id
SQUARE_ACCESS_TOKEN=your_sandbox_or_live_access_token
SQUARE_LOCATION_ID=your_sandbox_or_live_location_id
SQUARE_ENVIRONMENT=sandbox # Change to 'production' for live payments
```

---

### Step 3: Server-Side Changes (`server.js`)
Initialize the Square client and write the server handler inside your API routes.

```javascript
import { Client, Environment } from 'square';

// Initialize Square Client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
});

// Update or create POST /api/user/orders
app.post('/api/user/orders', authenticateUser, async (req, res) => {
  const { name, email, phone, items, total, paymentToken, activeTakeoutMethod } = req.body;

  try {
    let paymentStatus = 'Pending Payment (Store Pickup)';
    let paymentDetails = 'In-Store Cash/Debit';

    // If checkout requires online payment
    if (activeTakeoutMethod === 'online' && paymentToken) {
      // Amount in cents (Square expects integers, e.g. $10.50 -> 1050 cents)
      const amountInCents = Math.round(total * 100);

      const response = await squareClient.paymentsApi.createPayment({
        sourceId: paymentToken,
        idempotencyKey: 'key-' + Date.now() + Math.random().toString(36).substring(7),
        amountMoney: {
          amount: amountInCents,
          currency: 'CAD', // Specify currency code
        },
        buyerEmailAddress: email,
        note: `ALMAS Takeout Order - ${name}`
      });

      paymentStatus = 'Paid Online';
      paymentDetails = `Square Card Auth - Ref #${response.result.payment.id.substring(0, 8)}`;
    }

    // Insert order to database (MySQL or database.json)
    const order = await createOrder({
      ...req.body,
      user_id: req.user.id,
      status: paymentStatus,
      payment: paymentDetails
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Square payment processing error:', error);
    res.status(500).json({ success: false, error: 'Payment failed or server error.' });
  }
});
```

---

### Step 4: Load Web Payments SDK in Frontend (`order.html`)
Add the official Square JS SDK inside the `<head>` of your checkout page:

```html
<!-- Sandbox Web Payments SDK -->
<script type="text/javascript" src="https://sandbox.web.squarecdn.com/v1/square.js"></script>

<!-- For production, replace with:
<script type="text/javascript" src="https://web.squarecdn.com/v1/square.js"></script>
-->
```

---

### Step 5: Replace Insecure Card Fields with Square secure container
Find the card inputs div `<div id="takeout-card-form">` and replace it with:

```html
<!-- Card inputs container -->
<div id="takeout-card-form" class="space-y-4 mb-8">
  <label class="form-label">Secure Credit Card Checkout</label>
  
  <!-- Square Web Payments SDK will mount here -->
  <div id="card-container" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.75rem;"></div>
  
  <div id="card-errors" class="text-xs text-red-500 font-semibold mt-1"></div>
</div>
```

---

### Step 6: Initialize SDK & Handle Tokenisation (`order.html` Script)
Configure the card object, attach it to your container, and generate a payment token (`nonce`) before submitting the form.

```javascript
let cardPaymentObject = null;

// Initialize Square Payments
async function initializeSquarePayments() {
  const appId = "YOUR_SQUARE_APP_ID";       // Fetch from env/api config
  const locationId = "YOUR_SQUARE_LOCATION_ID"; // Fetch from env/api config

  if (!window.Square) {
    console.error("Square SDK failed to load");
    return;
  }

  try {
    const payments = window.Square.payments(appId, locationId);
    cardPaymentObject = await payments.card();
    await cardPaymentObject.attach('#card-container');
    console.log("Square Card Form successfully initialized.");
  } catch (error) {
    console.error("Square initialization error:", error);
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeSquarePayments();
});
```

During order placement click listener (`btn-t-place`):
```javascript
document.getElementById('btn-t-place').addEventListener('click', async () => {
  // ... basic details validations ...

  let paymentToken = null;

  if (activeTakeoutMethod === 'online') {
    if (!cardPaymentObject) {
      alert("Payment form not initialized properly.");
      return;
    }
    
    // Get secure payment token
    const result = await cardPaymentObject.tokenize();
    if (result.status === 'OK') {
      paymentToken = result.token; // Secure sourceId token generated by Square API
    } else {
      let errorMessage = `Tokenization failed: ${result.errors[0].message}`;
      document.getElementById('card-errors').innerText = errorMessage;
      return;
    }
  }

  // Send payload to backend
  const orderData = {
    name, email, phone, time,
    items: getCart(),
    paymentToken: paymentToken,
    activeTakeoutMethod: activeTakeoutMethod
  };

  const response = await fetch('/api/user/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('almas_token')}`
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  if (result.success) {
    // Show invoice/success receipt
  } else {
    alert("Payment verification failed. Please try another card.");
  }
});
```
