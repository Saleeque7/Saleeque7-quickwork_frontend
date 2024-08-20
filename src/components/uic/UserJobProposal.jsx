import { Flex, Box, Text, Button } from "@chakra-ui/react";

export default function UserJobProposal() {
  const profileImage = null;
  return (
    <Box boxShadow="md" p={4} borderRadius="md" bg="white" mb={4}>
      <Flex alignItems="center">
        {/* Left side: User photo */}
        <Box mr={4}>
          <img
            src={profileImage}
            alt="User Profile"
            style={{ width: "80px", borderRadius: "50%" }}
          />
        </Box>

        {/* Right side: User details */}
        <Box>
          {/* User name and role */}
          <Text fontWeight="bold">saleeque</Text>
          <Text>FullStack developer</Text>

          {/* Cover letter */}
          <Text mt={2}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
            harum eum possimus beatae quis eveniet nesciunt nihil optio nemo,
            quidem consequatur culpa expedita hic ducimus rem suscipit dicta
            dignissimos nam! Numquam itaque sunt id eveniet odio, eligendi eum
            quaerat reprehenderit perferendis ea cum fuga, pariatur doloribus
            natus vel, tempora accusantium? Voluptatum accusantium blanditiis
            dolorum labore consectetur adipisci velit veniam et. Incidunt,
            facere ea cumque veniam consequatur error! Dignissimos officia eos
            laudantium repellendus nihil asperiores dolores culpa nostrum
            praesentium sint delectus neque odit exercitationem, molestias
            dolorem vel iste voluptate est. Provident.
          </Text>

          {/* Skills */}
          <Text mt={2}>
            <strong>Skills:</strong> uniqueskill
          </Text>

          {/* Hourly rate */}
          <Text mt={2}>
            <strong>Hourly Rate:</strong> 100
          </Text>

          {/* Buttons: Message and Hire */}
          <Flex justifyContent={"flex-end"}>
            <Button mr={2}>Message</Button>
            <Button colorScheme="teal">Hire</Button>
          </Flex>
        </Box>
      </Flex>
      <Flex alignItems="center">
        {/* Left side: User photo */}
        <Box mr={4}>
          <img
            src={profileImage}
            alt="User Profile"
            style={{ width: "80px", borderRadius: "50%" }}
          />
        </Box>

        {/* Right side: User details */}
        <Box>
          {/* User name and role */}
          <Text fontWeight="bold">saleeque</Text>
          <Text>FullStack developer</Text>

          {/* Cover letter */}
          <Text mt={2}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
            harum eum possimus beatae quis eveniet nesciunt nihil optio nemo,
            quidem consequatur culpa expedita hic ducimus rem suscipit dicta
            dignissimos nam! Numquam itaque sunt id eveniet odio, eligendi eum
            quaerat reprehenderit perferendis ea cum fuga, pariatur doloribus
            natus vel, tempora accusantium? Voluptatum accusantium blanditiis
            dolorum labore consectetur adipisci velit veniam et. Incidunt,
            facere ea cumque veniam consequatur error! Dignissimos officia eos
            laudantium repellendus nihil asperiores dolores culpa nostrum
            praesentium sint delectus neque odit exercitationem, molestias
            dolorem vel iste voluptate est. Provident.
          </Text>

          {/* Skills */}
          <Text mt={2}>
            <strong>Skills:</strong> uniqueskill
          </Text>

          {/* Hourly rate */}
          <Text mt={2}>
            <strong>Hourly Rate:</strong> 100
          </Text>

          {/* Buttons: Message and Hire */}
          <Flex justifyContent={"flex-end"}>
            <Button mr={2}>Message</Button>
            <Button colorScheme="teal">Hire</Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
