import React from "react";
import Chatbot from "./Assets/input.png";
import Wating from "./Assets/waiting.png";
import Treadmil from "./Assets/treadmil.png";

const Work = () => {
  const workInfoData = [
    {
      image: Chatbot,
      title: "Input the question",
      text: "Our model covers a wide variety of topics, so don't be shy to ask it something totally out of this world!",
    },
    {
      image: Wating,
      title: "Hit Enter",
      text: "Hit Enter, sit back, and relax while your Virtual TA digests the question and formulates an answer.",
    },
    {
      image: Treadmil,
      title: "Learn",
      text: "After the model spits out an answer, learn from it so you can do the next one!",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          Stuck on a complex topic? Ask your Virtual TA!
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
