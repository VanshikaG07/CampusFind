import "./ResourceCard.css";

function ResourceCard({
  id,
  title,
  price,
  type,
  condition,
  location,
  image
}) {
  return (
    <div className="resource-card">

      <div className="resource-image-container">
        {image ? (
          <img
            src={image}
            alt={title}
            className="resource-image"
          />
        ) : (
          <div className="resource-image-placeholder">
            No image
          </div>
        )}
      </div>

      <div className="resource-content">

        <span className="resource-type">
          {type}
        </span>

        <h3>{title}</h3>

        <p className="resource-condition">
          {condition}
        </p>

        <div className="resource-footer">

          <div>
            <p className="resource-price">
              ₹{price}
            </p>

            <p className="resource-location">
              📍 {location || "Location unavailable"}
            </p>
          </div>

          <a
            href={`/resources/${id}`}
            className="resource-button"
          >
            View
          </a>

        </div>

      </div>

    </div>
  );
}

export default ResourceCard;