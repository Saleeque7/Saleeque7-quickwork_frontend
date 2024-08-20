import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Text, Flex, IconButton, Box } from "@chakra-ui/react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Flex justifyContent="center" alignItems="center" mt={4} p={4} bg="white"  borderRadius="md">
      {/* <IconButton
        icon={<FaChevronLeft />}
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous Page"
        variant="outline"
        colorScheme="teal"
        mr={2}
      /> */}
      {pages.map(page => (
        <Box
          key={page}
          mx={1}
          px={3}
          py={1}
          borderRadius="md"
          cursor="pointer"
          bg={currentPage === page ? "teal.500" : "gray.200"}
          color={currentPage === page ? "white" : "black"}
          _hover={{ bg: currentPage === page ? "teal.600" : "gray.300" }}
          onClick={() => onPageChange(page)}
          transition="background-color 0.3s"
        >
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            {page}
          </Text>
        </Box>
      ))}
      {/* <IconButton
        icon={<FaChevronRight />}
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next Page"
        variant="outline"
        colorScheme="teal"
        ml={2}
      /> */}
    </Flex>
  );
};
