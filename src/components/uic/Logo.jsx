import { Image, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Logo({ userInfo }) {
  return (
    <Flex alignItems={"flex-start"} direction={"column"} pb={5}>
      {userInfo?.job_role === "freelancer" ? (
        <Link to={'/user/home'}>
          <Image src="/images/logo.png" fit="contain" mb="-20px" />
        </Link>
      ) : userInfo?.job_role === "client" ? (
        <Link to={'/user/client'}>
          <Image src="/images/logo.png" fit="contain" mb="-20px" />
        </Link>
      ) : (
        <Image src="/images/logo.png" fit="contain" mb="-20px" />
      )}
    </Flex>
  );
}
