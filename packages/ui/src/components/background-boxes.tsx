"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@fitness/ui/lib/utils";

type Props = React.ComponentProps<"div"> & {
	/**
	 * overall opacity of the effect; "medium" is more visible, "subtle" is lighter
	 * (default: "subtle")
	 */
	intensity?: "subtle" | "medium";
	/**
	 * box size for grid cells; can be a single number (square) or width/height tuple
	 * (default: 64)
	 */
	cell?:
		| number
		| {
				width: number;
				height: number;
		  };
	/**
	 * circle highlight radius
	 * (default: 220)
	 *
	 */
	radius?: number;
};

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

function normalizeCell(cell: Props["cell"]) {
	if (typeof cell === "number") return { width: cell, height: cell };
	return cell ?? { width: 64, height: 64 };
}

export function BackgroundBoxes({ className, intensity = "subtle", cell = 64, radius = 220, ...props }: Props) {
	const reducedMotion = useReducedMotion();
	const { width: cellWidth, height: cellHeight } = normalizeCell(cell);

	const baseOpacity = intensity === "medium" ? 0.32 : 0.22;
	const colorOpacity = intensity === "medium" ? 0.58 : 0.44;

	const vw = React.useRef(1);
	const vh = React.useRef(1);

	const mx = useMotionValue(0.5);
	const my = useMotionValue(0.5);

	const sx = useSpring(mx, { stiffness: 140, damping: 26 });
	const sy = useSpring(my, { stiffness: 140, damping: 26 });

	React.useEffect(() => {
		const update = () => {
			vw.current = window.innerWidth || 1;
			vh.current = window.innerHeight || 1;
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	React.useEffect(() => {
		if (reducedMotion) return;

		const onMove = (e: PointerEvent) => {
			const w = vw.current;
			const h = vh.current;

			mx.set(clamp(e.clientX / w, 0, 1));
			my.set(clamp(e.clientY / h, 0, 1));
		};

		window.addEventListener("pointermove", onMove, { passive: true });
		return () => window.removeEventListener("pointermove", onMove);
	}, [mx, my, reducedMotion]);

	const driftX = useTransform(sx, (v) => (v - 0.5) * 16);
	const driftY = useTransform(sy, (v) => (v - 0.5) * 9);

	const mask = useTransform([sx, sy, driftX, driftY], ([x, y, dx, dy]) => {
		const offX = reducedMotion ? 0 : (dx as number);
		const offY = reducedMotion ? 0 : (dy as number);

		const px = `${(x as number) * 100 + (offX / vw.current) * 100}%`;
		const py = `${(y as number) * 100 + (offY / vh.current) * 100}%`;

		return `radial-gradient(${radius}px ${radius}px at ${px} ${py}, black 0%, black 45%, transparent 72%)`;
	});

	return (
		<div className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)} {...props}>
			<motion.div
				aria-hidden
				className="absolute h-full w-full p-4"
				style={{
					x: reducedMotion ? 0 : driftX,
					y: reducedMotion ? 0 : driftY,
				}}
			>
				<div
					className="absolute inset-0"
					style={{
						opacity: baseOpacity,
						backgroundImage:
							"linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
						backgroundSize: `${cellWidth}px ${cellHeight}px`,
					}}
				/>

				<motion.div
					className="absolute inset-0"
					style={{
						opacity: colorOpacity,
						backgroundImage:
							"linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)",
						backgroundSize: `${cellWidth}px ${cellHeight}px`,
						WebkitMaskImage: mask,
						maskImage: mask,
					}}
				/>
			</motion.div>
		</div>
	);
}
