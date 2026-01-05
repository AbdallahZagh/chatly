import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stagger animation for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-3xl font-bold bg-[var(--bg-surface)]/35 shadow-[0_0_7px_var(--accent-primary)] backdrop-blur-xs px-5 py-2.5 rounded-full text-[var(--accent-primary)]">
        Chatly
</div>

          <div className="flex items-center gap-4 bg-[var(--bg-surface)]/35 shadow-[0_0_7px_var(--accent-primary)] backdrop-blur-xs px-5 py-2.5 rounded-2xl">
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-accent)] border border-[var(--accent-primary)] transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun/> : <Moon/>}
              </motion.button>
            )}

            {/* Login Button */}
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-main)] font-semibold hover:opacity-90 transition"
              >
                Login
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <motion.section
  initial="hidden"
  whileInView="visible"
  variants={sectionVariants}
  viewport={{ once: true, amount: 0.3 }}
  className="relative min-h-screen pt-24 px-6 flex items-center bg-linear-90 from-[var(--bg-main)] via-[var(--accent-primary)]/10 via-50% to-[var(--bg-main)]"
>
     <div
        className="absolute inset-0 bg-[var(--bg-main)] blur-3xl opacity-5"
      />
  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    {/* LEFT — TEXT CONTENT */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center lg:text-left z-10"
    >
      <motion.h1
        variants={sectionVariants}
        className="text-6xl lg:text-7xl font-bold mb-6 
                   bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]
                   bg-clip-text text-transparent"
      >
        Welcome to Chatly
      </motion.h1>

      <motion.p
        variants={sectionVariants}
        className="text-xl lg:text-2xl font-light text-[var(--text-secondary)]
                   mb-10 max-w-xl mx-auto lg:mx-0"
      >
        Experience fast, beautiful, and seamless real-time messaging designed
        for modern conversations.
      </motion.p>

      <motion.div
        variants={sectionVariants}
        className="flex gap-4 justify-center lg:justify-start flex-wrap"
      >
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-[var(--accent-primary)]
                       text-[var(--bg-main)] font-bold text-lg
                       hover:shadow-xl transition"
          >
            Get Started Now
          </motion.button>
        </Link>

        <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold text-lg hover:bg-[var(--bg-surface)] transition"
              >
                Watch Demo
              </motion.button>
      </motion.div>
    </motion.div>

    {/* RIGHT — PRODUCT PREVIEW */}
    <motion.div
      variants={sectionVariants}
      className="relative flex justify-center lg:justify-end"
    >
      {/* Glow */}
      <div
        className="absolute inset-0  bg-radial from-[var(--accent-primary)] to-transparent blur-3xl opacity-40"
      />

      {/* Mock App Window */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="w-full max-w-md rounded-2xl
                   bg-[var(--bg-surface)]
                   z-10
                   lg:mr-14
                   border border-[var(--border-muted)]
                   shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-muted)]">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Chat Preview */}
        <div className="p-5 space-y-4">
          <div className="h-4 w-1/3 rounded bg-[var(--bg-muted)]" />
          <div className="h-10 w-4/5 rounded-lg bg-[var(--accent-primary)]/20" />
          <div className="h-10 w-3/5 rounded-lg bg-[var(--bg-muted)]" />
          <div className="h-10 w-2/3 rounded-lg bg-[var(--accent-secondary)]/20" />
        </div>
      </motion.div>
    </motion.div>

  </div>
</motion.section>


      {/* ===== ABOUT SECTION ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true, amount: 0.3 }}
        className="min-h-screen flex items-center justify-center px-6 py-20 bg-radial from-[var(--accent-primary)]/10 from-10% to-[var(--bg-surface)]"
      >
        <div
        className="absolute inset-0 bg-[var(--bg-main)] blur-3xl opacity-15"
      />
        <div className="max-w-6xl mx-auto w-full z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h2 variants={sectionVariants} className="text-5xl font-bold mb-6">
                Why Choose Chatly?
              </motion.h2>

              <motion.p
                variants={sectionVariants}
                className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed"
              >
                Chatly combines elegant design with powerful functionality to deliver
                the best messaging experience. Built with modern technologies and a
                focus on user experience, Chatly keeps your conversations flowing
                naturally.
              </motion.p>

              <motion.ul variants={sectionVariants} className="space-y-4 text-lg">
                {['End-to-end encrypted', 'Lightning fast responses', 'Beautiful interface', 'Cross-platform support'].map(
                  (feature, i) => (
                    <motion.li
                      key={i}
                      variants={sectionVariants}
                      className="flex items-center gap-3"
                    >
                      <span className="text-2xl text-[var(--accent-primary)]">✓</span>
                      {feature}
                    </motion.li>
                  )
                )}
              </motion.ul>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl bg-[var(--bg-accent)] border border-[var(--border-main)] flex items-center justify-center overflow-hidden"
            >
              <div className="text-center">
                <p className="text-6xl">💬</p>
                <p className="text-[var(--text-secondary)] mt-4">Your conversations matter</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== SERVICES SECTION ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true, amount: 0.3 }}
        className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-radial from-[var(--accent-primary)]/5 from-10% to-[var(--bg-main)]"
      >
        <div
        className="absolute inset-0 bg-[var(--bg-surface)] blur-3xl opacity-15"
      />
        <div className="max-w-6xl mx-auto w-full z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={sectionVariants} className="text-5xl font-bold mb-4">
              Features That Matter
            </motion.h2>
            <motion.p variants={sectionVariants} className="text-xl text-[var(--text-secondary)]">
              Comprehensive features to enhance your messaging
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '🔐', title: 'Secure', desc: 'End-to-end encryption' },
              { icon: '⚡', title: 'Fast', desc: 'Sub-second responses' },
              { icon: '🎨', title: 'Beautiful', desc: 'Modern dark & light UI' },
              { icon: '📱', title: 'Mobile', desc: 'Works on all devices' },
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={sectionVariants}
                whileHover={{ translateY: -20 }}
                className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-center hover:shadow-[0_0_12px_var(--accent-primary)] transition"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-[var(--text-secondary)]">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ===== CONTACT SECTION ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true, amount: 0.3 }}
        className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-radial from-[var(--accent-primary)]/10 from-10% to-[var(--bg-surface)]"
      >
        <div
        className="absolute inset-0 bg-[var(--bg-main)] blur-3xl opacity-15"
      />
        <div className="max-w-2xl z-10 mx-auto w-full text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={sectionVariants} className="text-5xl font-bold mb-6">
              Get In Touch
            </motion.h2>

            <motion.p
              variants={sectionVariants}
              className="text-xl text-[var(--text-secondary)] mb-12"
            >
              Have questions? We'd love to hear from you. Send us a message and we'll
              respond as soon as possible.
            </motion.p>

            <motion.form
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div variants={sectionVariants}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-3 rounded-lg bg-[var(--bg-accent)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                />
              </motion.div>

              <motion.div variants={sectionVariants}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-6 py-3 rounded-lg bg-[var(--bg-accent)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                />
              </motion.div>

              <motion.div variants={sectionVariants}>
                <textarea
                  placeholder="Your message..."
                  rows="5"
                  className="w-full px-6 py-3 rounded-lg bg-[var(--bg-accent)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                />
              </motion.div>

              <motion.button
                variants={sectionVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-8 py-4 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-main)] font-bold text-lg hover:shadow-lg transition"
              >
                Send Message
              </motion.button>
            </motion.form>

            {/* <motion.div variants={sectionVariants} className="mt-12 text-[var(--text-secondary)]">
              <p>Or reach us directly at: support@chatly.com</p>
            </motion.div> */}
          </motion.div>
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <footer className="relative bg-[var(--bg-surface)] border-t border-[var(--border-main)] py-8 text-center text-[var(--text-secondary)]">
        <div
        className="absolute inset-0 bg-linear-60 from-[var(--bg-main)] via-[var(--accent-primary)]/15 via-25% to-[var(--bg-main)]"
      />
        <p className='z-10 relative'>&copy; 2026 Chatly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
