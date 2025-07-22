import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type = "success", onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-base flex items-center gap-3 ${type === "success" ? "bg-navy" : "bg-red-600"}`}
          role="alert"
        >
          {type === "success" ? (
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 text-gold hover:text-white text-lg font-bold focus:outline-none" aria-label="Sluiten">&times;</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 