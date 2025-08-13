# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for redesigning the Messmate SRM Hostel Mess Menu website. The redesign will transform the current functional application into a modern, professional, and engaging PWA with glassmorphism effects, dark mode support, creative notifications, and smooth animations while maintaining the existing React/Vite/TailwindCSS foundation.

The design leverages the current codebase structure and enhances it with modern UI patterns, improved state management, and additional features like PWA capabilities, theme switching, and notification systems.

## Architecture

### Technology Stack Enhancement

**Current Stack (Maintained):**
- React 19.1.0 with Vite 7.0.4
- TailwindCSS 3.4.1 for styling
- React Icons 4.12.0 for iconography

**New Dependencies to Add:**
- Framer Motion for animations and transitions
- React Hot Toast for notification system
- Zustand for lightweight state management
- @vite-pwa/vite for PWA capabilities
- React Swipeable for touch gestures
- Lucide React for additional modern icons

### Application Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Header.jsx
│   │   ├── BlockSelector.jsx
│   │   ├── MealCard.jsx
│   │   ├── Navigation.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── BottomNavigation.jsx
│   ├── layout/
│   │   └── Layout.jsx
│   └── notifications/
│       └── NotificationSystem.jsx
├── hooks/
│   ├── useTheme.js
│   ├── useSwipeGestures.js
│   ├── useMealNavigation.js
│   └── useNotifications.js
├── store/
│   └── useAppStore.js
├── utils/
│   ├── mealSchedule.js
│   ├── menuData.js
│   ├── dateHelpers.js
│   └── constants.js
├── styles/
│   ├── globals.css
│   └── animations.css
└── App.jsx
```

## Components and Interfaces

### 1. Theme System

**ThemeProvider Context:**
```javascript
interface ThemeContext {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  systemPreference: 'light' | 'dark';
}
```

**Implementation:**
- CSS custom properties for theme colors
- localStorage persistence
- System preference detection
- Smooth transitions between themes

### 2. Enhanced Header Component

**Features:**
- Sticky positioning with backdrop blur
- Gradient background with theme-aware colors
- SRM logo integration
- Live digital clock with modern typography
- Theme toggle switch

**Glassmorphism Styling:**
```css
.glass-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 3. Block Selector Enhancement

**Design:**
- Pill-shaped segmented control
- Smooth sliding indicator
- Icon integration for each block
- Touch-friendly sizing (minimum 44px)
- Haptic feedback simulation

**Animation:**
- Framer Motion layout animations
- Spring physics for indicator movement
- Micro-interactions on selection

### 4. Meal Card Redesign

**Glassmorphism Card:**
```css
.meal-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

**Features:**
- Food emoji integration for each menu item
- Horizontal scroll on mobile with snap points
- Hover effects with scale and glow
- Loading skeleton states
- Empty state handling

### 5. Navigation System

**Swipe Gestures:**
- React Swipeable integration
- Velocity-based navigation
- Visual feedback during swipe
- Threshold-based activation

**Button Navigation:**
- Gradient backgrounds with theme awareness
- Disabled states for boundary conditions
- Loading states during transitions
- Accessibility compliance

### 6. Notification System

**Toast Notifications:**
```javascript
interface Notification {
  id: string;
  type: 'meal-time' | 'menu-update' | 'info';
  title: string;
  message: string;
  emoji: string;
  duration: number;
  onClick?: () => void;
}
```

**Creative Messages:**
- Context-aware meal notifications
- Randomized pickup lines
- Emoji integration
- Click-to-view functionality

### 7. Bottom Navigation (Mobile)

**Structure:**
- Fixed positioning with safe area insets
- Four main sections: Home, Weekly, Favorites, Settings
- Active state indicators
- Badge support for notifications

## Data Models

### Enhanced App State

```javascript
interface AppState {
  // Theme
  theme: 'light' | 'dark';
  
  // Navigation
  selectedMess: 'sannasi' | 'mblock';
  currentMeal: {
    dayOffset: number;
    mealIndex: number;
    isLive: boolean;
  };
  
  // UI State
  compactMode: boolean;
  showWeeklyView: boolean;
  
  // User Preferences
  favorites: string[];
  ratings: Record<string, number>;
  notificationsEnabled: boolean;
  
  // PWA
  installPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
}
```

### Menu Data Enhancement

```javascript
interface MenuItem {
  name: string;
  emoji?: string;
  category?: 'main' | 'side' | 'beverage' | 'dessert';
  isSpecial?: boolean;
}

interface MealSchedule {
  name: string;
  start: { hour: number; min: number };
  end: { hour: number; min: number };
  items: MenuItem[];
}
```

## Error Handling

### Network Error Handling
- Offline detection and fallback
- Cached data serving
- Retry mechanisms with exponential backoff
- User-friendly error messages

### State Error Boundaries
- React Error Boundaries for component crashes
- Graceful degradation for missing data
- Fallback UI components
- Error reporting (optional)

### PWA Error Handling
- Service worker update notifications
- Cache invalidation strategies
- Background sync for user actions

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- State management testing

### Integration Testing
- User flow testing
- Theme switching functionality
- Navigation between meals/days
- Notification system integration

### E2E Testing (Optional)
- Critical user journeys
- PWA installation flow
- Offline functionality
- Cross-browser compatibility

### Performance Testing
- Lighthouse audits
- Bundle size analysis
- Animation performance profiling
- Memory leak detection

## Design System

### Color Palette

**Light Mode:**
```css
:root {
  --primary-gradient: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  --secondary-gradient: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}
```

**Dark Mode:**
```css
[data-theme="dark"] {
  --primary-gradient: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
  --secondary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.1);
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --neon-accent: #00f5ff;
}
```

### Typography
- Primary: Inter (Google Fonts)
- Fallback: Poppins
- Monospace: JetBrains Mono (for clock)

### Animation Principles
- Duration: 200-300ms for micro-interactions
- Easing: Custom cubic-bezier curves
- Reduced motion support
- 60fps performance target

### Responsive Breakpoints
```css
/* Mobile First */
sm: '640px'   /* Small tablets */
md: '768px'   /* Tablets */
lg: '1024px'  /* Small laptops */
xl: '1280px'  /* Desktops */
```

## PWA Implementation

### Service Worker Strategy
- Cache First for static assets
- Network First for menu data
- Background sync for user preferences
- Push notification support (future)

### Manifest Configuration
```json
{
  "name": "Messmate - SRM Hostel Mess Menu",
  "short_name": "Messmate",
  "description": "Modern hostel mess menu application",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Offline Strategy
- Cache menu data for 7 days
- Offline indicator in UI
- Cached data timestamp display
- Manual refresh option

## Performance Optimizations

### Code Splitting
- Route-based splitting for different views
- Component lazy loading
- Dynamic imports for heavy features

### Bundle Optimization
- Tree shaking for unused code
- Image optimization and lazy loading
- Font loading optimization
- CSS purging

### Runtime Performance
- React.memo for expensive components
- useMemo/useCallback for heavy computations
- Virtual scrolling for large lists (if needed)
- Debounced user interactions

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Focus management
- ARIA labels and descriptions

### Mobile Accessibility
- Touch target sizes (44px minimum)
- Swipe gesture alternatives
- Voice control compatibility
- Reduced motion preferences

## Security Considerations

### Data Privacy
- No personal data collection
- Local storage only
- No external API calls (currently)
- HTTPS enforcement

### Content Security Policy
- Strict CSP headers
- Inline script restrictions
- Font and image source restrictions

## Migration Strategy

### Phase 1: Foundation
- Set up new dependencies
- Implement theme system
- Create base component structure

### Phase 2: Core Features
- Redesign existing components
- Add glassmorphism effects
- Implement animations

### Phase 3: Enhanced Features
- Add notification system
- Implement PWA capabilities
- Add swipe gestures

### Phase 4: Polish
- Performance optimization
- Accessibility improvements
- Testing and bug fixes

## Future Enhancements

### Potential Features
- Push notifications for meal times
- User accounts and preferences sync
- Meal rating and feedback system
- Social features (meal sharing)
- Integration with hostel management system

### Technical Improvements
- GraphQL API integration
- Real-time menu updates
- Advanced caching strategies
- Analytics integration