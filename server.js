import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.js';
import {
  initializeDatabase,
  getMenu,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  getSettings,
  updateSettings,
  getServices,
  addService,
  updateService,
  deleteService,
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
  getInquiries,
  addInquiry,
  updateInquiryStatus,
  deleteInquiry,
  findUserByEmail,
  findUserByGoogleId,
  createUser,
  getUserById,
  updateUser
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'almas_indian_cuisine_super_secret_key_2026';

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve public uploads static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Image upload storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Admin Authentication Middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Access denied. Token missing.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}

// User Authentication Middleware
function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Access denied. Token missing.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

  try {
    const userSecret = process.env.JWT_USER_SECRET || 'almas_user_auth_secret_token_2026_xyz';
    const verified = jwt.verify(token, userSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'almasindiancuisine@gmail.com' && password === 'De$$$ert@209') {
    // Generate Token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token });
  }

  return res.status(400).json({ success: false, error: 'Invalid email or password.' });
});

// ─── USER AUTHENTICATION ENDPOINTS ───────────────────────────────────────────

// POST /api/user/auth/register - Email/Password Registration (with OTP Email Verification)
app.post('/api/user/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  try {
    const existing = await findUserByEmail(email);
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    let user;
    if (existing) {
      if (existing.is_verified) {
        return res.status(400).json({ success: false, error: 'Email address is already registered.' });
      }
      // Reuse existing unverified account
      user = await updateUser(existing.id, { name, password_hash, provider: 'email' });
    } else {
      // Create new unverified account
      user = await createUser({
        name,
        email,
        password_hash,
        provider: 'email',
        is_verified: 0
      });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await updateUser(user.id, { otp_code: otp, otp_expires: expires });
    await sendVerificationEmail(user.email, user.name, otp);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
      message: 'Verification code sent to your email.'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
});

// POST /api/user/auth/verify-signup - Verify OTP for registration activation
app.post('/api/user/auth/verify-signup', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and verification code are required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || user.otp_code !== otp || Date.now() > user.otp_expires) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification code.' });
    }

    await updateUser(user.id, { is_verified: 1, otp_code: null, otp_expires: null });

    const userSecret = process.env.JWT_USER_SECRET || 'almas_user_auth_secret_token_2026_xyz';
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, userSecret, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ success: false, error: 'Server error during email verification.' });
  }
});

// POST /api/user/auth/resend-signup-otp - Resend code
app.post('/api/user/auth/resend-signup-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    await updateUser(user.id, { otp_code: otp, otp_expires: expires });
    await sendVerificationEmail(user.email, user.name, otp);

    res.json({ success: true, message: 'Verification code resent.' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, error: 'Server error resending code.' });
  }
});

// POST /api/user/auth/login - Email/Password Login
app.post('/api/user/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    if (user.provider === 'google' && !user.password_hash) {
      return res.status(400).json({ success: false, error: 'This email is linked to a Google Account. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000;

      await updateUser(user.id, { otp_code: otp, otp_expires: expires });
      await sendVerificationEmail(user.email, user.name, otp);

      return res.status(400).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        error: 'Your email address is not verified. A new verification code has been sent.'
      });
    }

    const userSecret = process.env.JWT_USER_SECRET || 'almas_user_auth_secret_token_2026_xyz';
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, userSecret, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

// POST /api/user/auth/google - Google Sign-In verification & sync
app.post('/api/user/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ success: false, error: 'Google credential token is missing.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Google account does not provide an email address.' });
    }

    let user = await findUserByGoogleId(googleId);
    if (!user) {
      user = await findUserByEmail(email);
      if (user) {
        user = await updateUser(user.id, { google_id: googleId, avatar: avatar || user.avatar, provider: 'google', is_verified: 1 });
      } else {
        user = await createUser({
          name: name || email.split('@')[0],
          email,
          google_id: googleId,
          avatar,
          provider: 'google',
          is_verified: 1
        });
      }
    } else {
      if (user.avatar !== avatar || user.name !== name || !user.is_verified) {
        user = await updateUser(user.id, { name: name || user.name, avatar: avatar || user.avatar, is_verified: 1 });
      }
    }

    const userSecret = process.env.JWT_USER_SECRET || 'almas_user_auth_secret_token_2026_xyz';
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, userSecret, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (err) {
    console.error('Google Auth verification error:', err);
    res.status(400).json({ success: false, error: 'Google sign-in verification failed.' });
  }
});

// POST /api/user/auth/forgot-password - Trigger password reset email
app.post('/api/user/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  try {
    const user = await findUserByEmail(email);
    // Return success for security obfuscation even if user doesn't exist
    if (!user) {
      return res.json({ success: true, message: 'If the email is registered, a reset code has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    await updateUser(user.id, { otp_code: otp, otp_expires: expires });
    await sendPasswordResetEmail(user.email, user.name, otp);

    res.json({ success: true, message: 'If the email is registered, a reset code has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, error: 'Server error during password reset request.' });
  }
});

// POST /api/user/auth/reset-password - Verify reset code and save new password
app.post('/api/user/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, error: 'Email, code, and new password are required.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || user.otp_code !== otp || Date.now() > user.otp_expires) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification code.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await updateUser(user.id, {
      password_hash,
      is_verified: 1, // Resetting automatically verifies the email
      otp_code: null,
      otp_expires: null
    });

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'Server error resetting password.' });
  }
});

// GET /api/user/profile - Get currently logged-in user details
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, error: 'Server error fetching profile.' });
  }
});


// GET /api/auth/config - Retrieve public authentication config
app.get('/api/auth/config', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
});

// GET /api/menu - Retrieve entire menu (products and categories)
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await getMenu();
    res.json(menu);
  } catch (err) {
    console.error("GET /api/menu error:", err);
    res.status(500).json({ error: 'Database error fetching menu.' });
  }
});

// POST /api/menu/products - Add product (Admin only)
app.post('/api/menu/products', authenticateAdmin, async (req, res) => {
  try {
    const newProduct = req.body;
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      return res.status(400).json({ error: 'Product must have id, name, and price.' });
    }
    
    const menu = await getMenu();
    if (menu.products.some(p => p.id === newProduct.id)) {
      return res.status(400).json({ error: 'Product ID already exists.' });
    }

    await addProduct(newProduct);
    res.json({ success: true, product: newProduct });
  } catch (err) {
    console.error("POST /api/menu/products error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/menu/products/:id - Update product (Admin only)
app.put('/api/menu/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updated = await updateProduct(id, updatedData);
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error("PUT /api/menu/products error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/menu/products/:id - Delete product (Admin only)
app.delete('/api/menu/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/menu/products error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu/categories - Add category (Admin only)
app.post('/api/menu/categories', authenticateAdmin, async (req, res) => {
  try {
    const newCategory = req.body;
    if (!newCategory.id || !newCategory.name) {
      return res.status(400).json({ error: 'Category must have id and name.' });
    }

    const menu = await getMenu();
    if (menu.categories.some(c => c.id === newCategory.id)) {
      return res.status(400).json({ error: 'Category ID already exists.' });
    }

    await addCategory(newCategory);
    res.json({ success: true, category: newCategory });
  } catch (err) {
    console.error("POST /api/menu/categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/menu/categories/:id - Update category (Admin only)
app.put('/api/menu/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updated = await updateCategory(id, updatedData);
    res.json({ success: true, category: updated });
  } catch (err) {
    console.error("PUT /api/menu/categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/menu/categories/:id - Delete category (Admin only)
app.delete('/api/menu/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/menu/categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings - Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    console.error("GET /api/settings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings - Update settings (Admin only)
app.put('/api/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await updateSettings(req.body);
    res.json({ success: true, settings });
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/services - Get catering services
app.get('/api/services', async (req, res) => {
  try {
    const services = await getServices();
    res.json(services);
  } catch (err) {
    console.error("GET /api/services error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/services - Add service (Admin only)
app.post('/api/services', authenticateAdmin, async (req, res) => {
  try {
    const newService = req.body;
    if (!newService.id || !newService.title) {
      return res.status(400).json({ error: 'Service must have id and title.' });
    }
    await addService(newService);
    res.json({ success: true, service: newService });
  } catch (err) {
    console.error("POST /api/services error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/services/:id - Update service (Admin only)
app.put('/api/services/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateService(id, req.body);
    res.json({ success: true, service: updated });
  } catch (err) {
    console.error("PUT /api/services error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/services/:id - Delete service (Admin only)
app.delete('/api/services/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteService(id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/services error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/packages - Get packages
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await getPackages();
    res.json(packages);
  } catch (err) {
    console.error("GET /api/packages error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/packages - Add package (Admin only)
app.post('/api/packages', authenticateAdmin, async (req, res) => {
  try {
    const newPackage = req.body;
    if (!newPackage.id || !newPackage.name || !newPackage.price) {
      return res.status(400).json({ error: 'Package must have id, name, and price.' });
    }
    await addPackage(newPackage);
    res.json({ success: true, package: newPackage });
  } catch (err) {
    console.error("POST /api/packages error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/packages/:id - Update package (Admin only)
app.put('/api/packages/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updatePackage(id, req.body);
    res.json({ success: true, package: updated });
  } catch (err) {
    console.error("PUT /api/packages error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/packages/:id - Delete package (Admin only)
app.delete('/api/packages/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await deletePackage(id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/packages error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inquiries - Submit public inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = req.body;
    if (!inquiry.name || !inquiry.phone || !inquiry.email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }
    const newInquiry = await addInquiry(inquiry);
    res.json({ success: true, inquiry: newInquiry });
  } catch (err) {
    console.error("POST /api/inquiries error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries - Get all inquiries (Admin only)
app.get('/api/inquiries', authenticateAdmin, async (req, res) => {
  try {
    const list = await getInquiries();
    res.json(list);
  } catch (err) {
    console.error("GET /api/inquiries error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inquiries/:id - Update status (Admin only)
app.put('/api/inquiries/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateInquiryStatus(id, status || 'read');
    res.json({ success: true });
  } catch (err) {
    console.error("PUT /api/inquiries error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/inquiries/:id - Delete inquiry (Admin only)
app.delete('/api/inquiries/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteInquiry(id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/inquiries error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload - Upload Image (Admin only)
app.post('/api/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  // Return the web-accessible path
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

// Clean URLs Router for Multi-Page Build Assets
app.use((req, res, next) => {
  const pathname = req.path;
  
  // Skip API, uploads and static assets with extensions
  if (pathname.startsWith('/api') || pathname.startsWith('/uploads') || pathname.startsWith('/public') || path.extname(pathname)) {
    return next();
  }

  const cleanRoutes = ['menu', 'account', 'products', 'order', 'product-detail', 'about', 'services', 'contact', 'admin'];
  const baseName = pathname.replace(/^\/|\/$/g, ''); // strip leading/trailing slashes

  if (cleanRoutes.includes(baseName)) {
    const filePath = path.join(__dirname, 'dist', `${baseName}.html`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  next();
});

// Serve frontend dist assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other non-file requests to index.html
app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).end();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server & Run Seeding
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDatabase();
});
