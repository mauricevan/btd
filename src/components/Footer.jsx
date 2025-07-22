export default function Footer() {
  return (
    <footer className="bg-domred text-white py-8 mt-12 rounded-t-2xl shadow-dom font-sans">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="BTD Dordrecht" className="h-8 w-8 rounded-full border-2 border-white bg-white" />
          <span className="font-bold text-lg tracking-wide">BTD Dordrecht</span>
        </div>
        <div className="flex gap-6 items-center mt-2 md:mt-0">
          <a href="mailto:info@btd-dordrecht.nl" className="hover:underline">info@btd-dordrecht.nl</a>
          <a href="#" className="hover:underline" aria-label="LinkedIn">
            <svg className="w-6 h-6 inline text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.85-1.54 3.05 0 3.61 2.01 3.61 4.62v5.56z"/></svg>
          </a>
        </div>
        <div className="text-white font-semibold text-sm mt-2 md:mt-0">&copy; {new Date().getFullYear()} BTD Dordrecht</div>
      </div>
    </footer>
  );
} 