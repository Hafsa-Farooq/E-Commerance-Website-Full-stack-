export default function AnnouncementBar() {
  return (
    <div className="relative bg-black h-[34px] lg:h-[38px] flex items-center justify-center px-8 sm:px-10 lg:px-[100px]">
      <p className="font-satoshi text-[10px] sm:text-[12px] lg:text-[14px] text-white text-center leading-none truncate">
        Sign up and get 20% off to your first order.{" "}
        <a href="#" className="underline font-medium whitespace-nowrap">
          Sign Up Now
        </a>
      </p>
      <button
        aria-label="Close announcement"
        className="absolute right-2 sm:right-3 lg:right-[100px] text-white"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="lg:w-3 lg:h-3"
        >
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}