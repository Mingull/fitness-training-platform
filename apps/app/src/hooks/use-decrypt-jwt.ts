import { decryptJWT } from "@/lib/jwt";
import { JWTPayload } from "jose";
import { useEffect, useState } from "react";

export const useDecryptJWT = <P = JWTPayload>(jwt: string | null) => {
	const [payload, setPayload] = useState<(P & JWTPayload) | null>(null);

	useEffect(() => {
		let cancelled = false;

		if (!jwt) {
			setPayload(null);
			return;
		}

		decryptJWT<P>(jwt)
			.then((decoded) => {
				if (!cancelled) {
					setPayload(decoded);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setPayload(null);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [jwt]);

	return payload;
};
