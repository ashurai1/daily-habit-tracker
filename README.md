# 🌟 Daily Habit Tracker

A beautiful, feature-rich web application for tracking daily habits with analytics, streaks, and celebrations. Built with vanilla HTML, CSS, and JavaScript featuring a premium glassmorphism design and smooth animations.

![Daily Habit Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🎯 Core Functionality
- **Habit Management** - Create, edit, delete, and archive habits
- **Daily Tracking** - Check off habits with beautiful animations
- **Streak Tracking** - Automatic calculation of consecutive days
- **Points System** - Customizable points per habit completion
- **Progress Circle** - Visual representation of daily completion

### 📊 Analytics & Insights
- **Interactive Charts** - Bar and line charts powered by Chart.js
- **Multiple Time Ranges** - View data for 7, 30, or 90 days
- **Completion Metrics** - Track completion rate and average scores
- **Calendar View** - Monthly overview with color-coded completion

### 🎨 Design & UX
- **Glassmorphism UI** - Modern, premium design aesthetic
- **Dark/Light Mode** - Smooth theme switching with persistence
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Micro-interactions and transitions throughout
- **Confetti Celebration** - Triggers when all habits are completed

### 💾 Data Management
- **LocalStorage** - Automatic data persistence
- **Export Data** - Download your data as JSON
- **Import Data** - Restore from backup files
- **Sample Data** - Pre-loaded demo habits for new users

### ♿ Accessibility
- **ARIA Labels** - Proper accessibility attributes
- **Keyboard Navigation** - Full keyboard support
- **Motion Preferences** - Respects prefers-reduced-motion
- **Semantic HTML** - Proper document structure

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or build tools required!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashurai1/daily-habit-tracker.git
   cd daily-habit-tracker
   ```

2. **Open in browser**
   ```bash
   # Simply open the index.html file
   open index.html
   # Or on Windows
   start index.html
   # Or on Linux
   xdg-open index.html
   ```

That's it! The app will load with sample data and is ready to use.

## 📖 Usage

### Adding a Habit
1. Click on **"Add Habit"** in the navigation
2. Enter habit name (required)
3. Select category, difficulty, and points
4. Click **"Create Habit"**

### Tracking Daily Progress
1. On the **Home** page, check off completed habits
2. Watch your progress circle update in real-time
3. See your daily score and streak increase
4. Complete all habits to trigger confetti! 🎉

### Viewing Analytics
1. Navigate to **"Analytics"**
2. Select time range (7, 30, or 90 days)
3. View bar chart for daily scores
4. View line chart for completion trends

### Calendar View
1. Go to **"Calendar"** section
2. Navigate between months using arrow buttons
3. See color-coded completion history:
   - 🟢 Green = 100% complete
   - 🟡 Yellow = 50-99% complete
   - 🔴 Red = 1-49% complete

### Managing Data
1. Navigate to **"Settings"**
2. **Export Data** - Download backup as JSON
3. **Import Data** - Restore from backup file
4. **Reset Data** - Clear all data (with confirmation)

## 🎨 Customization

### Themes
Toggle between light and dark mode using:
- Theme toggle button in the navigation bar
- Settings page toggle switch

### Categories
Built-in categories include:
- 🏃 Health
- 📚 Study
- 💼 Work
- 🌟 Personal
- 💪 Fitness
- 🧘 Mindfulness
- 📌 Other

### Difficulty Levels
- 😊 Easy
- 😐 Medium
- 😤 Hard

## 🛠️ Technical Details

### Built With
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** - Modern vanilla JS
- **Chart.js** - Data visualization
- **Google Fonts** - Inter font family

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Key Technologies
- CSS Custom Properties for theming
- LocalStorage API for data persistence
- Canvas API for confetti animation
- Chart.js for analytics
- Backdrop-filter for glassmorphism

## 📁 Project Structure

```
daily-habit-tracker/
│
├── index.html          # Main HTML file
├── style.css           # All styles and animations
├── script.js           # Application logic
└── README.md           # This file
```

## 🎯 Features Breakdown

| Feature | Description | Status |
|---------|-------------|--------|
| Add Habits | Create new habits with custom settings | ✅ |
| Edit Habits | Modify existing habits | ✅ |
| Delete Habits | Remove habits permanently | ✅ |
| Archive Habits | Soft delete for temporary removal | ✅ |
| Daily Tracking | Check/uncheck completion | ✅ |
| Streak Tracking | Consecutive days counter | ✅ |
| Points System | Customizable scoring | ✅ |
| Analytics Charts | Bar and line charts | ✅ |
| Calendar View | Monthly completion overview | ✅ |
| Dark Mode | Theme switching | ✅ |
| Data Export | JSON download | ✅ |
| Data Import | JSON upload | ✅ |
| Confetti | Celebration animation | ✅ |
| Responsive | Mobile/tablet/desktop | ✅ |
| Accessibility | ARIA labels, keyboard nav | ✅ |

## 🎬 Demo

### Screenshots

**Light Mode - Home**
> Beautiful glassmorphism design with habit cards and progress tracking

**Dark Mode - Analytics**
> Comprehensive charts showing your progress over time

**Calendar View**
> Monthly overview with color-coded completion indicators

## 💡 Tips & Tricks

1. **Consistent Tracking** - Check in daily for accurate streaks
2. **Realistic Goals** - Start with 3-5 habits, not 20
3. **Use Categories** - Organize habits by life area
4. **Set Appropriate Difficulty** - Be honest about effort required
5. **Regular Backups** - Export your data monthly
6. **Review Analytics** - Check weekly to identify patterns

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions
- Additional chart types
- More theme options
- Habit templates
- Social sharing features
- Mobile app version
- Backend integration

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Ashwani Rai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👤 Author

**Ashwani Rai**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Chart.js](https://www.chartjs.org/) - Beautiful charts
- [Google Fonts](https://fonts.google.com/) - Inter font family
- [Shields.io](https://shields.io/) - README badges
- Inspiration from various habit tracking apps

## 📮 Support

If you found this project helpful, please give it a ⭐️!

For bugs and feature requests, please [open an issue](https://github.com/yourusername/daily-habit-tracker/issues).

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Habit templates library
- [ ] Time-based habits (morning/evening)
- [ ] Notes/journal for each day
- [ ] Heatmap visualization
- [ ] Goal setting and tracking
- [ ] Social sharing features
- [ ] PWA support for offline use
- [ ] Mobile app version

---

**Made with ❤️ by Ashwani Rai**

*Start building better habits today!* 🚀
