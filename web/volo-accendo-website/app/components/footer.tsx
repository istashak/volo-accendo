import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center mt-5">
      <nav className="mb-2 flex space-x-4">
        <Link href="/" className="text-xl hover:underline">
          Home
        </Link>
        <span className="text-xl">|</span>
        <Link href="/about" className="text-xl hover:underline">
          About
        </Link>
        <span className="text-xl">|</span>
        <Link href="/portfolio" className="text-xl hover:underline">
          Portfolio
        </Link>
        <span className="text-xl">|</span>
        <Link href="/contact" className="text-xl hover:underline">
          Contact
        </Link>
      </nav>
      <p className="text-lg mt-4">© 2025 Volo Accendo, Inc.</p>
    </footer>
  );
}
