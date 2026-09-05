export const easeOut = [0.16, 1, 0.3, 1] as const;

export const appleSpring = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8,
} as const;

export const appleSpringSnappy = {
  type: "spring",
  stiffness: 520,
  damping: 36,
  mass: 0.7,
} as const;

export const hoverLift = { y: -3, scale: 1.015 };
export const tapPress = { scale: 0.98 };

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export const stagger = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};
