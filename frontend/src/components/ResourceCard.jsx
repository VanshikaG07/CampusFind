import "./ResourceCard.css";

function ResourceCard({
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
        <img
          src={image}
          alt={title}
          className="resource-image"
        />
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
              📍 {location}
            </p>
          </div>

          <button className="resource-button">
            View
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResourceCard;