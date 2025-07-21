# Moringa Lost & Found Frontend

A modern, responsive web application for managing lost and found items at Moringa School.

## 🚀 Quick Start

### Prerequisites
- A modern web browser
- Python 3.x (for local development server)
- Node.js (optional, for advanced development)

### Installation & Setup

1. **Clone or download the frontend files**
2. **Start the development server:**
   ```bash
   # Using Python (recommended)
   python3 -m http.server 3000
   
   # Or using Node.js
   npm run start
   ```
3. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── index.html              # Main HTML file
├── css/                    # Stylesheets
│   ├── base.css           # Base styles & variables
│   ├── navbar.css         # Navigation styles
│   ├── hero.css           # Hero section styles
│   ├── stats.css          # Statistics section styles
│   ├── search.css         # Search functionality styles
│   ├── items.css          # Item cards & grid styles
│   ├── modal.css          # Modal dialog styles
│   └── footer.css         # Footer styles
├── js/                     # JavaScript modules
│   ├── data.js            # Sample data & utilities
│   ├── ui.js              # UI interactions & rendering
│   └── main.js            # Application entry point
├── components/            # HTML components (for reference)
│   ├── navbar.html
│   ├── hero.html
│   ├── stats.html
│   ├── search.html
│   ├── items-grid.html
│   ├── report-modal.html
│   └── footer.html
└── package.json           # Project configuration
```

## 🎨 Features

### ✅ Core Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, professional interface
- **Search & Filter** - Real-time search by name, description, location, category, status, and date
- **Report Items** - Complete form for reporting lost/found items
- **Item Display** - Grid layout with detailed item cards
- **Interactive Elements** - Smooth animations and transitions

### 🔍 Search Functionality
- Search by item name, description, or location
- Filter by category (electronics, documents, clothing, etc.)
- Filter by status (lost/found)
- Filter by date
- Real-time search results

### 📱 Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid layouts
- Touch-friendly interface

## 🛠 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript ES6+** - Modular JavaScript with ES6 modules
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter)

## 🎯 Usage

### For Users
1. **Browse Items** - Scroll through the grid of lost/found items
2. **Search Items** - Use the search bar and filters to find specific items
3. **Report Items** - Click "Report Lost Item" to submit a new lost/found item
4. **Contact** - Use the contact information provided for each item

### For Developers
1. **Modular Structure** - Each component is in separate files for easy maintenance
2. **CSS Variables** - Easy theming and customization
3. **ES6 Modules** - Modern JavaScript with import/export
4. **Responsive Design** - Mobile-first approach

## 🎨 Customization

### Colors
Edit `css/base.css` to change the color scheme:
```css
:root {
    --primary-color: #4F46E5;
    --secondary-color: #10B981;
    --accent-color: #F59E0B;
    /* ... other variables */
}
```

### Adding New Categories
Edit the category options in `index.html`:
```html
<option value="new-category">New Category</option>
```

### Sample Data
Modify sample items in `js/data.js`:
```javascript
export const sampleItems = [
    // Add your sample items here
];
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🔧 Development

### Adding New Features
1. Create new CSS file in `css/` directory
2. Create new JavaScript module in `js/` directory
3. Import and use in `main.js`
4. Update `index.html` as needed

### Testing
- Test on different screen sizes
- Test search functionality
- Test form submission
- Test mobile navigation

## 🚀 Deployment

### Static Hosting
This is a static site that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Any static file server

### Build Process
No build process required - just serve the files as-is.

## 📞 Support

For issues or questions:
- Email: lostfound@moringaschool.com
- Check the GitHub repository issues

## 📄 License

MIT License - Feel free to use and modify as needed.
