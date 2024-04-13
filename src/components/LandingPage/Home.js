import React from "react";
import BannerBackground from "./Assets/banner.png";
import BannerImage from "./Assets/mainImage.png";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (auth.currentUser) {
      navigate("/chat-page");
    } else {
      navigate("sign-in");
    }
  };

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} className="background" alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">All Your Questions Answered</h1>
          <p className="primary-text">
            Discover the future of interaction with our Virtual TA—your
            always-available, intelligent teacher that delivers instant answers
            and dynamic conversations to elevate your online learning
            experience!
          </p>
          <button className="secondary-button" onClick={() => handleNavigate()}>
            Try Now
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
