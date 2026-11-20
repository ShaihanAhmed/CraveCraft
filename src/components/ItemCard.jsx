import { Link } from "react-router-dom";
export default function ItemCard({ item, onAdd }) {
  return (
    <article className="food-card">
      <Link
        to={`/items/${item.id}`}
        className="food-image-link"
        aria-label={`View ${item.name} details`}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23e9e8df'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%2368736a' font-size='24'%3EFood image unavailable%3C/text%3E%3C/svg%3E";
          }}
        />
      </Link>
      <div className="food-card-body">
        <div className="card-meta">
          <span>{item.category}</span>
          <span>{item.prepTime}</span>
        </div>
        <h2>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </h2>
        <p>{item.description}</p>
        <div className="card-bottom">
          <strong>Rs. {item.price.toLocaleString()}</strong>
          <button
            className="small-button"
            type="button"
            disabled={!item.available || item.stock < 1}
            aria-label={`Add ${item.name} to cart`}
            onClick={() => onAdd(item)}
          >
            Add +
          </button>
        </div>
        <small className={item.available ? "available" : "unavailable"}>
          {item.available ? `${item.stock} available` : "Unavailable"}
        </small>
      </div>
    </article>
  );
}
