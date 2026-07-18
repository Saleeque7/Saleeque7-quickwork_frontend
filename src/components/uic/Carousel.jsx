import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
      <div>
        <div className="flex justify-between items-center h-[200px] bg-teal-800 rounded-2xl p-2">
          <div className="ml-4 flex flex-col items-start text-left text-white">
            <div className="text-2xl font-bold">
              Boost your profile & <br />
              Rise to the top of the client's list
            </div>
            <div>
              <button className="mt-4 px-4 py-1.5 bg-gray-200 text-teal-900 rounded font-semibold hover:bg-gray-300 transition-colors cursor-pointer">
                Boost now
              </button>
            </div>
          </div>
          <div className="w-[300px] h-[200px] flex justify-center items-center">
            <img src={Carosalimage1} alt="Boost profile" className="max-h-[180px] object-contain" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center h-[200px] bg-green-500 rounded-2xl p-2">
          <div className="ml-4 flex flex-col items-start text-left text-white">
            <div className="text-2xl font-bold">
              Freelancers who turn on their Availability Badge <br />
              receive up to 50% more invites.
            </div>
            <div>
              <button className="mt-4 px-4 py-1.5 bg-gray-200 text-green-900 rounded font-semibold hover:bg-gray-300 transition-colors cursor-pointer">
                show me how
              </button>
            </div>
          </div>
          <div className="w-[300px] h-[200px] flex justify-center items-center">
            <img src={Carosalimage2} alt="Availability Badge" className="max-h-[180px] object-contain" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center h-[200px] bg-gradient-to-r from-purple-500 to-white rounded-2xl p-2">
          <div className="ml-4 flex flex-col items-start text-left text-white">
            <div className="text-2xl font-bold text-purple-900">
              Let's draw Your future <br />
              with QuickWork.
            </div>
            <div>
              <button className="mt-4 px-4 py-1.5 bg-gray-200 text-purple-900 rounded font-semibold hover:bg-gray-300 transition-colors cursor-pointer">
                Find Your Job
              </button>
            </div>
          </div>
          <div className="w-[300px] h-[200px] flex justify-center items-center">
            <img src={Carosalimage3} alt="Draw future" className="max-h-[180px] object-contain" />
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default Carousel;
