import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Flex, Image, Text, Button } from "@chakra-ui/react";
import Carosalimage1 from "../../assets/rkt.png";
import Carosalimage2 from "../../assets/image2.png";
import Carosalimage3 from "../../assets/newWave.webp";

const Carousel = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Slider {...settings}>
      <Box>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          h="200px"
          bg="teal.700"
          borderRadius="2xl"
          p={2}
        >
          <Box ml={4}>
            <Box textAlign="start" color="white" fontSize="2xl">
              Boost your profile & <br />
              Rise to the top of the client's list
            </Box>
            <Box textAlign="start" color="white" fontSize="16px">
              <Button mt={4} bg={"gray.200"}>
                Boost now
              </Button>
            </Box>
          </Box>
          <Box boxSize={"300px"} display="flex" justifyContent="center" alignItems="center">
            <Image src={Carosalimage1} />
          </Box>
        </Flex>
      </Box>
      <Box>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          h="200px"
          bg="green.400"
          borderRadius="2xl"
          p={2}
        >
          <Box ml={4}>
            <Box textAlign="start" color="white" fontSize="2xl">
              Freelancers who turn on their Availability Badge <br />
              receive up to 50% more invites.
            </Box>
            <Box textAlign="start" color="white" fontSize="16px">
              <Button mt={4} bg={"gray.200"}>
                show me how
              </Button>
            </Box>
          </Box>
          <Box boxSize={"300px"} display="flex" justifyContent="center" alignItems="center" > 
            <Image src={Carosalimage2}  />
          </Box>
        </Flex>
      </Box>
      <Box>
        <Flex
          justifyContent="space-between"
          alignItems="center"    
          h="200px"
          bgGradient="linear(to-r, purple.400, white)"
          borderRadius="2xl"
          p={2}
        >
          <Box ml={4}>
            <Box textAlign="start" color="white" fontSize="2xl">
              Let's draw Your future <br />
              with QuickWork.
            </Box>
            <Box textAlign="start" color="white" fontSize="16px">
              <Button mt={4} bg={"gray.200"}>
                Find Your Job
              </Button>
            </Box>
          </Box>
          <Box boxSize={"300px"} display="flex" justifyContent="center" alignItems="center">
            <Image src={Carosalimage3} />
          </Box>
        </Flex>
      </Box>
    </Slider>
  );
};

export default Carousel;
