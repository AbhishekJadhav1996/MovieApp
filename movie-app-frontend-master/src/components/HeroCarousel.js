import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import hero images
import ironman from "../assets/heros/Iron-Man.jpg";
import batman from "../assets/heros/batman.jpg";
import superman from "../assets/heros/superman.jpg";
import captainamerica from "../assets/heros/captain-america.jpg";
import wonderwoman from "../assets/heros/wonder-woman.jpg";

const HeroCarousel = ({ currentHero }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    speed: 2000,
    cssEase: "ease-in-out",
  };

  const heroes = [
    { img: ironman, name: "Iron Man" },
    { img: batman, name: "Batman" },
    { img: superman, name: "Superman" },
    { img: captainamerica, name: "Captain America" },
    { img: wonderwoman, name: "Wonder Woman" },
  ];

  // Jump to hero when a matching movie is added
  useEffect(() => {
    if (!currentHero) return;
    const heroIndex = heroes.findIndex(
      (h) => h.name.toLowerCase() === currentHero.toLowerCase()
    );
    if (heroIndex >= 0 && sliderRef.current) {
      sliderRef.current.slickGoTo(heroIndex);
    }
  }, [currentHero]);

  return (
    <Slider ref={sliderRef} {...settings} className="hero-carousel">
      {heroes.map((hero, i) => (
        <div key={i} className="carousel-slide">
          <img src={hero.img} alt={hero.name} className="carousel-img" />
          <div className="carousel-overlay"></div>
        
        </div>
      ))}
    </Slider>
  );
};

export default HeroCarousel;
