# Portfolio Setup Guide

This is a professional portfolio built from scratch using React, Vite, Tailwind CSS, and MagicUI components.

## 🎨 Current Site Inspiration

This portfolio was designed based on the clean, minimal aesthetic of [alemanb.dev](https://alemanb.dev/), featuring:
- Clean typography with high contrast
- Minimal, professional design
- Responsive layout with mobile-first approach
- Smooth animations and transitions
- Professional color scheme

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

## 📝 Customizing Your Portfolio

### 1. Update Your Information

Edit `/src/data/portfolio.ts` to add your personal information:

```typescript
export const portfolioData = {
  profile: {
    name: "Your Name",
    title: "Your Title",
    location: "Your Location",
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    image: "/profile.jpg", // Add your image to public folder
  },

  about: {
    description: "Your bio and description...",
    highlights: [
      "Your expertise areas",
      "Your specializations"
    ]
  },

  projects: [
    {
      title: "Project Name",
      description: "Project description...",
      technologies: ["Tech1", "Tech2"],
      link: "https://github.com/yourusername/project",
      image: "/project-image.jpg"
    }
  ],

  experience: [
    {
      role: "Your Role",
      company: "Company Name",
      period: "2022 - Present",
      description: "What you did...",
      achievements: [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ],

  skills: {
    languages: ["JavaScript", "TypeScript", "Python"],
    frameworks: ["React", "Node.js"],
    tools: ["Git", "Docker"],
    concepts: ["System Design", "Testing"]
  }
}
```

### 2. Add Images

Place your images in the `/public` folder:
- `profile.jpg` - Your profile picture
- `project1.jpg`, `project2.jpg`, etc. - Project screenshots

### 3. Customize Colors

Edit `/src/index.css` to change the color scheme. The current theme uses clean, professional colors inspired by your original site.

### 4. Customize Animations

The portfolio uses MagicUI components for animations:
- **DotPattern**: Animated background dots in the hero section
- **Ripple**: Ripple animation effects in projects and contact sections

You can adjust animation properties in each component file.

## 🎯 Features

### Built-in Components

1. **Hero Section** (`/src/components/sections/Hero.tsx`)
   - Profile image with gradient glow
   - Animated dot pattern background
   - Social links (GitHub, LinkedIn, Email)

2. **About Section** (`/src/components/sections/About.tsx`)
   - Professional bio
   - Highlight cards for expertise areas

3. **Projects Section** (`/src/components/sections/Projects.tsx`)
   - Grid layout for projects
   - Hover effects with ripple animations
   - Technology tags
   - External links to projects

4. **Experience Section** (`/src/components/sections/Experience.tsx`)
   - Timeline layout
   - Achievement lists
   - Clean, professional presentation

5. **Skills Section** (`/src/components/sections/Skills.tsx`)
   - Categorized skills display
   - Hover effects on skill tags

6. **Contact Section** (`/src/components/sections/Contact.tsx`)
   - Call-to-action
   - Social links
   - Footer with copyright

## 🎨 MagicUI Components Used

- **DotPattern**: Animated background pattern
- **Ripple**: Ripple animation effects

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the dist folder to Netlify
```

### Deploy to GitHub Pages
Add to `vite.config.ts`:
```typescript
base: '/your-repo-name/',
```

Then:
```bash
npm run build
# Deploy the dist folder
```

## 🔧 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **MagicUI** - Animated components
- **Lucide React** - Icons
- **Motion** - Animations

## 📦 Project Structure

```
src/
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   └── ui/
│       ├── dot-pattern.tsx
│       └── ripple.tsx
├── data/
│   └── portfolio.ts
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
```

## 💡 Tips

1. **Images**: Use optimized images (WebP format) for faster loading
2. **SEO**: Add meta tags in `index.html` for better SEO
3. **Analytics**: Add Google Analytics or similar for tracking
4. **Performance**: Use lazy loading for images if you have many projects

## 🤝 Support

For issues or questions about MagicUI components, visit:
- [MagicUI Documentation](https://magicui.design)
- [MagicUI GitHub](https://github.com/magicuidesign/magicui)

## 📄 License

This portfolio template is open source and available for personal and commercial use.

---

Built with ❤️ using React, Tailwind CSS, and MagicUI
