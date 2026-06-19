import { useEffect, useState } from "react";

export function useIsMounted() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// Set isMounted to true when the component mounts
		setIsMounted(true);

		// Cleanup function to set isMounted to false when the component unmounts
		return () => {
			setIsMounted(false);
		};
	}, []);

	// Return the current value of isMounted
	return isMounted;
}
