import React from "react";
import BannerBackground from "./Assets/banner.png";
import BannerImage from "./Assets/mainImage.png";

const Home = () => {
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
          <button className="secondary-button">Try Now</button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
