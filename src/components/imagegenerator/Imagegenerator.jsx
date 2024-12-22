import React, { useRef, useState } from 'react';
import './imagegenerator.css';
import default_image from '../Assets/user.png';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/"); // Default image URL state
  const [loading, setLoading] = useState(false); // Loading state
  const inputRef = useRef(null); // Ref for input

  // Function to fetch the image
  const fetchImage = async () => {
    const description = inputRef.current.value.trim(); // Get and trim input value
    if (!description) {
      alert("Please enter a valid description!");
      return;
    }

    const url = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";
    const options = {
      method: "POST",
      headers: {
        Authorization: 'Bearer ${process.env.REACT_APP_API_KEY}',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: description }),
    };

    try {
      setLoading(true); // Start loading
      setImageUrl(default_image); // Reset image to default while loading

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to generate image, please try again.");
      }

      const resultBlob = await response.blob();
      const resultImageUrl = URL.createObjectURL(resultBlob);

      setImageUrl(resultImageUrl); // Set the generated image URL
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false); // Stop loading after API call finishes
    }
  };

  return (
    <div className="container">
      <div className="heading">
        AI Image <span>Generator</span>
      </div>
      <div className="img">
        <img
          src={imageUrl === "/" ? default_image : imageUrl}
          alt="Generated preview"
        />
      </div>
      <div className="loading">
        {loading && (
          <>
            <div className="loadingbar-full"></div>
            <div className="loading-text">Loading...</div>
          </>
        )}
      </div>
      <div className="input">
        <input
          name="input"
          type="text"
          placeholder="Enter your prompt here..."
          ref={inputRef}
        />
        <button onClick={fetchImage} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {imageUrl !== "/" && (
        <div className="download">
          <a href={imageUrl} download="generated_image.png">
            <button>Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
