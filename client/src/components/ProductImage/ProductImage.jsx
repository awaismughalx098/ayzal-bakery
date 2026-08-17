import { useState } from "react";

import { GiKnifeFork } from "react-icons/gi";

import { imageUrl } from "../../api";

import "./ProductImage.css";

/* ============================================
   ProductImage
   --------------------------------------------
   Not every item has a photo — dips and drinks are
   added without one on purpose. Rather than render
   a broken image, fall back to a branded tile.

   Also catches images that fail to load, e.g. an
   upload lost after a server restart.
   ============================================ */

const ProductImage = ({ src, alt, className = "", loading = "lazy" }) => {

  const [failed, setFailed] = useState(false);

  const resolved = imageUrl(src);

  if (!resolved || failed) {

    return (
      <div
        className={`product-fallback ${className}`}
        role="img"
        aria-label={alt}
      >
        <GiKnifeFork />
      </div>
    );

  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  );

};

export default ProductImage;
