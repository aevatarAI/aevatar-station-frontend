import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function DarkMode() {
	const [darkMode, setDarkMode] = useState(true);
	const handleClick = () => {
		document.documentElement.classList.toggle("dark");
		setDarkMode(!darkMode);
	};

	return (
		<Button onClick={() => handleClick()}>
			{darkMode ? <Sun /> : <Moon />}
		</Button>
	);
}
