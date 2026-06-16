import "./Hero.css";
import { useState } from "react";
import { createPortal } from "react-dom";
import AyzalAssistant from "../AyzalAssistant/AyzalAssistant";

const Hero = () => {
  const [openAI, setOpenAI] = useState(false);

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <p className="hero-tag">AYZAL AI STUDIO</p>

          <h1>
            Design Your <br />
            Dream Cake <br />
            With AI
          </h1>

          <p>
            Talk with Ayzal Assistant using voice or text and generate custom
            bakery designs instantly.
          </p>

          <button
            className="hero-ai-btn"
            onClick={() => setOpenAI(true)}
          >
            Open AI Assistant
          </button>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1200&auto=format&fit=crop"
            alt="Bakery"
          />
        </div>
      </section>

      {openAI &&
        createPortal(
          <div className="ai-popup-overlay">
            <AyzalAssistant setOpenAI={setOpenAI} />
          </div>,
          document.body
        )}
    </>
  );
};

export default Hero;