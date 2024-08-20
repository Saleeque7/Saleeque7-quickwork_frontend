import { keyframes } from "@chakra-ui/react";

export const shakeKeyframes = keyframes`
  0% { transform: translateY(0); }
  20% { transform: translateY(-5px); }
  40% { transform: translateY(5px); }
  60% { transform: translateY(-5px); }
  80% { transform: translateY(5px); }
  100% { transform: translateY(0); }
`;
    