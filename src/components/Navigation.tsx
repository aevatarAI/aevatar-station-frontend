import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

const links = [
  { href: "/auth/atomic", label: "Atomic-Aevatar" },
  { href: "/auth/aevatar", label: "Aevatar" },
  { href: "/auth/dashboard", label: "Dashboard" },
];

export default function Navigation() {
  // const { urlPathname } = pageContext;
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const [animationProps, setAnimationProps] = useState({
    top: 0,
    height: 0,
  });

  const updateActiveLink = useCallback(() => {
    if (activeLinkRef.current) {
      const { height } = activeLinkRef.current.getBoundingClientRect();
      const top = activeLinkRef.current.offsetTop;
      setAnimationProps({ top, height });
    }
  }, []);

  useEffect(() => {
    // Initial update
    updateActiveLink();

    // Create debounced function with Lodash
    const debouncedUpdate = debounce(updateActiveLink, 100, {
      leading: true,
      trailing: true,
    });

    return () => {
      debouncedUpdate.cancel();
    };
  }, [updateActiveLink]);

  return (
    <div className="px-[20px] relative">
      <motion.div
        className="absolute left-[20px] right-[26px] bg-white/40 border-white border-r-8 pointer-events-none"
        aria-hidden="true"
        animate={animationProps}
        transition={{ type: "spring", duration: 0.5 }}
      />
      {/* {links.map(({ href, label }) => (
				<a
					ref={urlPathname.startsWith(href) ? activeLinkRef : null}
					className="block mb-[37px] py-[5px] px-[21px] font-syne text-[14px] font-semibold break-words capitalize"
					key={href}
					href={href}
				>
					{label}
				</a>
			))} */}
    </div>
  );
}
