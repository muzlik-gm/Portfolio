# ✨ My Personal Portfolio

Hey there! Welcome to my portfolio's codebase. This is where I showcase my journey as a developer, the projects I've built, and the things I'm passionate about.

## 🎨 What's This About?

This is my personal portfolio website built with modern web technologies. It's designed to be sleek, fast, and actually enjoyable to browse through. No boring templates here – everything is crafted with care and attention to detail.

## 🚀 Built With

- **Next.js 16** - Because React is awesome, and Next.js makes it even better
- **TypeScript** - Keeping my code clean and catching bugs before they happen
- **Tailwind CSS** - Making styling actually fun (yes, really!)
- **Framer Motion** - Adding those smooth animations that make everything feel alive
- **Lucide Icons** - Beautiful, consistent icons throughout
- **GSAP & Lenis** - For those buttery-smooth scroll effects

## 🎯 Features

- **Responsive Design** - Looks great on everything from phones to ultrawide monitors
- **Dark/Light Theme** - Easy on the eyes, no matter your preference
- **Blog Section** - Where I share my thoughts and learnings
- **Project Showcase** - All my work in one place
- **Admin Panel** - For managing content without touching code
- **Smooth Animations** - Because static websites are so 2010
- **Performance Optimized** - Fast loading times, no compromises

## 🛠️ Getting Started

Want to run this locally? Here's how:

```bash
# First, grab all the dependencies
npm install

# Then fire up the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go!

## 📁 Project Structure

```
src/
├── app/              # All the pages live here
├── components/       # Reusable UI components
├── data/            # Content and data files
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configs
└── styles/          # Global styles and themes
```

## 🔐 Admin Panel

There's a built-in admin panel for managing content:

- **URL:** `/admin/login`
- **Features:** Blog management, project updates, analytics

(Don't worry, it's password protected!)

## 🌐 Deployment

This site is deployed on Vercel (because they make it ridiculously easy):

```bash
# Deploy to production
vercel --prod
```

Or just push to the main branch and let GitHub Actions handle it!

## 🎨 Customization

Feel free to fork this and make it your own! Here's what you might want to change:

1. **Colors** - Check out `src/app/globals.css` for the color palette
2. **Content** - Update the data files in `src/data/`
3. **Images** - Drop your own images in the `public/` folder
4. **Fonts** - Swap them out in `src/app/layout.tsx`

## 📝 Environment Variables

You'll need these to run everything:

```env
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=another-secret-key
```

## 🤝 Contributing

Found a bug? Have a suggestion? Feel free to open an issue or submit a pull request. I'm always open to making this better!

## 📄 License

This project is open source and available under the MIT License. Feel free to use it as inspiration for your own portfolio!

## 💬 Let's Connect

- **Portfolio:** [Coming Soon]
- **GitHub:** [@muzlik-gm](https://github.com/muzlik-gm)
- **Email:** muzlikgamer@gmail.com

---

Built with ☕ and lots of late nights by Hamza

*P.S. - If you're reading this, you're awesome! 🎉*
