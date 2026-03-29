# Raj Indra Group - Complete Portal

A fully functional employee management portal with workforce, taxation, and financial services modules. Features admin dashboard, employee panels, lead management, financial tracking, and automatic email notifications.

## 🌟 Features

### For Employees
- ✅ **Profile Management** - Create/Edit profile, Generate ID cards
- ✅ **Lead Management** - Add leads, update status, track opportunities
- ✅ **Financial Dashboard** - Track income, pending/completed leads
- ✅ **Invoice Management** - Send invoices, track payments
- ✅ **Responsive Design** - Mobile, tablet, and desktop friendly

### For Admins
- ✅ **Employee Management** - View all employees, manage details, generate ID cards
- ✅ **Lead Assignment** - View all leads, assign to employees, track status
- ✅ **Financial Dashboard** - View revenue, payouts, net profit (Revenue - 20% commission)
- ✅ **User Approvals** - Approve/Reject new registrations with automatic email
- ✅ **Email Automation** - Automatic emails on all major actions

### General Features
- ✅ **Animated Login** - Beautiful login with password eye toggle
- ✅ **New Associate Registration** - Self-registration with admin approval
- ✅ **Google Sheets Integration** - All data saved to Google Sheets
- ✅ **Email Notifications** - Auto emails for leads, invoices, approvals
- ✅ **Responsive UI** - Works on all devices
- ✅ **Security** - Temporary admin credentials (change after first login)

## 📋 Default Credentials

```
Username: admin
Password: admin123
```
**Change these immediately after first login!**

## 🚀 Quick Start

### 1. Setup Google Sheets & Apps Script

#### Step 1a: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet: "Raj Indra Group Portal"
3. Copy the spreadsheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

#### Step 1b: Create Google Apps Script
1. Open your Google Sheet
2. Click `Tools` → `Script editor`
3. Delete the default code and paste the content from `AppsScript.gs`
4. Save the project (name: "Raj Indra Group Backend")

#### Step 1c: Deploy as Web App
1. Click `Deploy` → `New deployment`
2. Select type: `Web app`
3. Execute as: Your email address
4. Allow access: `Anyone`
5. Click Deploy
6. **Copy the deployment URL** (you'll need this)

### 2. Update Frontend Code

1. In `script.js`, find line 5:
```javascript
const API_URL = 'https://script.google.com/macros/d/YOUR_APPS_SCRIPT_ID/userweb';
```

2. Replace with your deployment URL:
```javascript
const API_URL = 'https://script.google.com/macros/d/abc123def456/userweb';
```

### 3. Setup Logo

1. Get the Raj Indra Group logo (you provided it)
2. Save as `logo.png` in the same folder as HTML files
3. Or update the image src in `index.html` to point to your logo URL

### 4. Deploy to GitHub

1. Create a GitHub repository: `raj-indra-group-portal`
2. Upload these files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `logo.png`
   - `README.md`
   - `AppsScript.gs` (for reference)

3. Enable GitHub Pages:
   - Go to Settings → Pages
   - Select Main branch
   - Your portal will be live at: `https://yourusername.github.io/raj-indra-group-portal`

## 📁 File Structure

```
raj-indra-group-portal/
├── index.html          # Main HTML with all pages
├── styles.css          # Complete responsive styling
├── script.js           # All frontend logic
├── logo.png            # Company logo
├── AppsScript.gs       # Google Apps Script backend
└── README.md           # This file
```

## 🔐 Security & Credentials

### Admin Login
- **Default Username**: `admin`
- **Default Password**: `admin123`
- **Action**: Change immediately after first login

### Employee Registration
1. New associates click "New Associate? Register Here"
2. Fill registration form
3. Admin reviews in "Approvals" tab
4. Admin approves → Employee gets auto email with credentials
5. Employee logs in with provided credentials

### Data Storage
- All user data saved in Google Sheets
- Encrypted emails sent via Gmail API
- No data stored on public servers

## 📊 Data Structure

### Users Sheet
| ID | Username | Password | Name | Email | Phone | Department | Role | Status | CreatedDate |
|----|----------|----------|------|-------|-------|------------|------|--------|-------------|

### Leads Sheet
| ID | Name | Email | Phone | Service | Charges | Status | AssignedTo | Date | UpdatedDate |
|----|------|-------|-------|---------|---------|--------|------------|------|------------|

### Invoices Sheet
| ID | LeadID | Amount | Description | Status | Date | SentBy | SentDate |
|----|--------|--------|-------------|--------|------|--------|----------|

### Approvals Sheet
| ID | FirstName | LastName | Email | Phone | Department | Status | AppliedDate | ApprovedDate |
|----|-----------|----------|-------|-------|------------|--------|-------------|----------------|

## 🎨 Customization

### Change Colors
In `styles.css`, update these variables:
```css
:root {
    --primary-color: #1e3a5f;      /* Dark Blue */
    --secondary-color: #c41e3a;    /* Red */
    --accent-color: #f0f0f0;       /* Light Gray */
}
```

### Change Company Details
1. Update logo path in HTML
2. Update tagline in `index.html`
3. Update email settings in `AppsScript.gs`

### Add More Departments
In `index.html`, find department select and add options:
```html
<option value="Your Department">Your Department</option>
```

## 📱 Responsive Design

✅ **Desktop** (1200px+) - Full sidebar navigation
✅ **Tablet** (768px - 1199px) - Optimized layout
✅ **Mobile** (< 768px) - Collapsible sidebar, touch-friendly

Test on:
- Chrome DevTools (F12 → Toggle device toolbar)
- iPhone Safari
- Android Chrome
- iPad Safari

## 🔧 Troubleshooting

### Issue: "Connection error" on login
**Solution**: 
- Check if Apps Script deployment URL is correct in `script.js`
- Ensure Apps Script is deployed as "Web app"
- Try clearing browser cache

### Issue: Emails not sending
**Solution**:
- Check Google Account email quotas
- Verify MailApp.sendEmail permissions in Apps Script
- Check spam folder for emails

### Issue: Data not saving
**Solution**:
- Verify Google Sheet is editable
- Check if Apps Script has access to Sheet
- Re-deploy Apps Script

### Issue: Logo not showing
**Solution**:
- Ensure `logo.png` is in correct folder
- Try using full URL instead of relative path
- Check file permissions

## 📞 Support & Maintenance

### Regular Tasks
1. **Weekly**: Check approvals, review leads
2. **Monthly**: Export data, review financial dashboard
3. **Quarterly**: Review and update employee data

### Backup
1. Download Google Sheet as Excel monthly
2. Keep GitHub commits regular
3. Store AppsScript.gs code backup

## 🚀 Advanced Features (Coming Soon)

- [ ] SMS notifications
- [ ] WhatsApp integration
- [ ] Advanced analytics
- [ ] Export to PDF reports
- [ ] Mobile app version
- [ ] Two-factor authentication

## 📝 License

This portal is custom-built for Raj Indra Group. All rights reserved.

## 👥 Team

**Built for**: Raj Indra Group
**Services**: Workforce | Taxation | Financial Services
**Portal Features**: Employee Management | Lead Tracking | Financial Dashboard

---

## 🎯 Quick Links

- **Portal URL**: [Your GitHub Pages URL]
- **Admin Email**: admin@rajindra.com
- **Support**: Your contact details

---

### Important Notes

1. **First Time Setup**: 
   - Initialize sheets by running the Apps Script once
   - Change admin credentials after first login
   - Add company logo and branding

2. **Ongoing Maintenance**:
   - Monitor data growth
   - Archive old leads monthly
   - Review user permissions quarterly

3. **Security**:
   - Never share admin credentials
   - Use strong passwords
   - Enable 2FA on Google Account

4. **Performance**:
   - Sheet can handle 5000+ rows efficiently
   - Consider archiving old data if > 10000 rows
   - Email sending has 100 emails/day limit (Google)

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
