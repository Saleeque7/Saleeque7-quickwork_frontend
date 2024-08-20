import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
  FormErrorMessage,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useState } from "react";

export const PasswordField = forwardRef(
  ({ value, onChange, passwordError, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef(null);
    const mergeRef = useMergeRefs(inputRef, ref);
    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    return (
      <FormControl isInvalid={passwordError}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup>
          <InputRightElement>
            <IconButton
              variant="text"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
          <Input
            id="password"
            ref={mergeRef}
            name="password"
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            required
            {...props}
            value={value}
            onChange={onChange}
            borderColor={passwordError ? "red.500" : undefined}
            focusBorderColor={passwordError ? "red.500" : undefined}
          />
        </InputGroup>
          {passwordError && (
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          )}
      </FormControl>
    );
  }
);

PasswordField.displayName = "PasswordField";
