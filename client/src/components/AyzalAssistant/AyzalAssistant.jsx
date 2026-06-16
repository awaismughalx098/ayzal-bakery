import "./AyzalAssistant.css";
import { useState } from "react";

import {
  FaPaperPlane,
  FaDownload,
  FaTimes,
  FaCrown,
  FaMagic
} from "react-icons/fa";

const AyzalAssistant = ({ setOpenAI }) => {
  const [message, setMessage] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const speak = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.92;
    speech.pitch = 1.7;

    window.speechSynthesis.speak(speech);
  };

  const generateCake = async () => {
    if (!message.trim()) {
      alert("Please enter customization");
      return;
    }

    try {
      speak("Generating your custom bakery design");

      const response = await fetch(
        "http://localhost:5000/api/ai/generate-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: message
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.image);
        speak("Your custom design is ready");
      } else {
        alert("Generation failed");
      }
    } catch (error) {
      console.log(error);
      alert("AI generation failed");
    }
  };

  return (
    <div className="assistant-box">
      <div className="luxury-glow"></div>

      <button
        className="luxury-close"
        onClick={() => setOpenAI(false)}
      >
        <FaTimes />
      </button>

      <div className="assistant-header">
        <div className="luxury-logo">
          <FaCrown />
        </div>

        <div>
          <h3>Ayzal Assistant</h3>
          <p>AI Cake & Dessert Designer</p>
        </div>
      </div>

      <div className="gold-line">
        <span></span>
      </div>

      <div className="assistant-content">
        <p className="welcome-text">
          Assalam o Alaikum ❤️
        </p>

        <p className="desc-text">
          Tell me your cake or dessert customization.
        </p>

        <textarea
          placeholder="Example: Pink lotus birthday cake with golden roses"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="generate-btn"
          onClick={generateCake}
        >
          <FaPaperPlane />
          Generate My Design
          <FaMagic />
        </button>

        {generatedImage && (
          <div className="generated-preview">
            <img src={generatedImage} alt="Generated Cake" />

            <a href={generatedImage} download>
              <button className="download-btn">
                <FaDownload />
                Save Luxury Design
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AyzalAssistant;