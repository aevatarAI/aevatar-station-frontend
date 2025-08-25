const bottomLinks = [
  { href: "https://aevatar.ai/docs", label: "Docs" },
  { href: "https://github.com/AISmartProject", label: "Github" },
];

export default function NavigationBottom() {
  return (
    <>
      {bottomLinks.map(({ href, label }) => (
        <a
          key={href}
          className="text-gray-light text-sm font-semibold font-outfit capitalize block mt-[24px]"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ))}
    </>
  );
}
