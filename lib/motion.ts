export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export const stagger = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};
