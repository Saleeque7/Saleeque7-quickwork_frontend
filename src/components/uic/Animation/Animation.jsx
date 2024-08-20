import { motion } from "framer-motion";

export const Transition = ({ children }) => {
  return (
    <motion.div
      initial={{
        width: 0,
      }}
      animate={{
        width: "100%",
        transition: {
          duration: 0.3, 
        },
      }}
      exit={{
        width: "100%",
        x: window.innerWidth,
        transition: {
          duration: 0.1, 
        },
      }}
    >
      {children}
    </motion.div>
  );
};
