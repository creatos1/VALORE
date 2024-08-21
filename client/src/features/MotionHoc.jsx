import { motion } from "framer-motion";

export const MotionHoc = (Element, location = "") => {
  return function HOC() {

    const exitAnimation = location !== "perfilSection" ? {
      y: -700,
      transition: { duration: 0.5, type: "spring", ease: "easeInOut" },
    } : {};

    return (
      <motion.main
        initial={{ y: 500 }}
        animate={{
          y: 0,
          transition: { duration: 0.5, type: "spring" },
        }}
        exit={exitAnimation}
      >
        <Element />
      </motion.main>
    );
  };
};
