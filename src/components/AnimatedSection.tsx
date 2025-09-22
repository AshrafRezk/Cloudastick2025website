
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up" 
}: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50, x: 0 };
      case "down":
        return { opacity: 0, y: -50, x: 0 };
      case "left":
        return { opacity: 0, y: 0, x: 50 };
      case "right":
        return { opacity: 0, y: 0, x: -50 };
      default:
        return { opacity: 0, y: 50, x: 0 };
    }
  };

  const variants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
