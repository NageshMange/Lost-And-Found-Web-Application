# Lost & Found Portal

A comprehensive web-based Lost & Found Portal for college management, built with React + Vite frontend and Express.js + MongoDB backend.

## 🚀 Features

### Core Features

- **Admin Login System**: Secure teacher authentication with JWT
- **Lost Item Management**: Add items with photos, descriptions, and locations
- **Collection Tracking**: Mark items as collected with student details
- **Student View**: Browse all lost items without login
- **Image Storage**: Local file storage with database path references
- **History Section**: View collected items archive

### Advanced Features

- **Search & Filter**: Advanced filtering by date, category, and keywords
- **Statistics Dashboard**: Monthly charts and analytics
- **Auto-Archive**: Automatic archiving of items older than 1 month
- **QR Code System**: Generate QR codes for easy item tracking
- **Category Management**: Organize items by type (electronics, clothing, etc.)
- **Responsive Design**: Modern UI with Bootstrap 5

### Unique Features

- **Real-time Notifications**: Toast notifications for all actions
- **Advanced Search**: Multi-criteria filtering with date ranges
- **Interactive Charts**: Visual analytics with Recharts
- **Mobile-First Design**: Fully responsive interface
- **Secure File Upload**: Image validation and size limits
- **Role-based Access**: Teacher and admin role management

## 🛠️ Tech Stack

### Frontend

- **React 18** with Vite
- **Bootstrap 5** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications
- **Recharts** for data visualization
- **React DatePicker** for date selection
- **JS-Cookie** for client-side cookie manipulation
- **QRcode.react** for generating QR codes

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin resource sharing
- **Dotenv** for environment variable management
- **Helmet** for securing Express apps by setting various HTTP headers
- **Express-Rate-Limit** for basic rate-limiting middleware

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lost-and-found-portal
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Run setup script**

   ```bash
   node setup.js
   ```

   This script will:

   - Create the `server/uploads` directory.
   - Generate `server/config.env` with default values if it doesn't exist.
   - Create a sample teacher account (`teacher1`/`password123`) if it doesn't exist.

4. **Setup Environment Variables**
   The `setup.js` script creates `server/config.env` if it doesn't exist.

   Edit the environment file:

   ```bash
   # Update MONGODB_URI and JWT_SECRET as needed
   ```

5. **Start MongoDB**

   ```bash
   # Make sure MongoDB is running on your system
   # Default: mongodb://localhost:27017
   ```

6. **Run the application**

   ```bash
   # Development mode (both frontend and backend)
   npm run dev

   # Or run separately:
   # Backend only
   npm run server

   # Frontend only
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Default Admin Account

The `setup.js` script automatically creates a sample teacher account if one doesn't exist:

- **Username**: teacher1
- **Password**: password123

You can also register a new teacher account through the admin login page.

## 📱 Usage

### For Students

1. Visit the homepage
2. Click "Browse Lost Items" to view available items
3. Use filters to search by category, date, or keywords
4. View item details and collection locations

### For Teachers/Admins

1. Click "Teacher Login" and sign in
2. Access the admin dashboard
3. Add new lost items with photos and details
4. Mark items as collected when students claim them
5. View statistics and manage all items

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all device sizes
- **Interactive Elements**: Hover effects and smooth transitions
- **Color-coded Status**: Visual indicators for item status
- **Intuitive Navigation**: Easy-to-use menu system
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 📊 Analytics & Reporting

- **Overview Statistics**: Total items, collection rates, monthly trends
- **Category Distribution**: Visual breakdown by item type
- **Monthly Charts**: Interactive charts showing trends
- **Collection Analytics**: Success rates and patterns
- **Recent Activity**: Latest items and updates

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt encryption
- **Input Validation**: Server-side validation
- **File Upload Security**: Image type and size validation
- **Rate Limiting**: API request limiting
- **CORS Protection**: Cross-origin request security

## 🚀 Deployment

### Production Build

```bash
# Build the frontend
npm run build

# The built files will be in client/dist/
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Update `MONGODB_URI` to production database
3. Set a strong `JWT_SECRET`
4. Configure CORS for your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the Apache License.

### Required Features ✅

- [x] Admin login system
- [x] Lost item management
- [x] Collection tracking
- [x] Student browsing interface
- [x] Image storage system
- [x] Search and filtering
- [x] Statistics dashboard
- [x] Auto-archive functionality

### Bonus Features ⭐

- [x] QR code generation
- [x] Advanced search filters
- [x] Interactive charts
- [x] Mobile-responsive design
- [x] Real-time notifications
- [x] Category management
- [x] Tag system
- [x] Modern UI/UX
