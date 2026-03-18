export default function Navbar() {
  return (
    <nav className="w-full z-50 backdrop-blur-md text-white mt-2">

      <div className="w-full mx-auto flex justify-between items-center px-10 pt-4">

        <div className="flex items-center">
          <img
            src="/trade-circle-logo.png"
            alt="Trade Circle Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        <a
          href="#contact-form"
          className="bg-(--brand-gold) hover:bg-(--brand-orange) px-4 py-2 md:px-6 md:py-3 cursor-pointer rounded-lg font-semibold text-black transition text-sm md:text-base"
        >
          Start Now
        </a>


      </div>

    </nav>
  );
}