import "./Home.css";
import ResourceCard from "../components/ResourceCard";

const resources = [
  {
    title: "Data Structures Book",
    price: 300,
    type: "For Sale",
    condition: "Good condition",
    location: "CSE Department",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
  },
  {
    title: "Scientific Calculator",
    price: 30,
    type: "For Rent",
    condition: "Like new",
    location: "Hostel 2",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620"
  },
  {
    title: "Cycle",
    price: 80,
    type: "For Rent",
    condition: "Good condition",
    location: "Hostel 1",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39"
  }
];

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="welcome-text">Welcome to CampusFind 👋</p>

          <h1>
            Find what you need,
            <span> right on campus.</span>
          </h1>

          <p className="hero-description">
            Buy, sell, rent, or request resources from students around you.
          </p>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search books, cycles, gadgets..."
            />
            <button>Search</button>
          </div>

          <div className="quick-actions">
            <button>Buy</button>
            <button>Rent</button>
            <button>Post a Demand</button>
          </div>
        </div>
      </section>


      {/* Urgent Requests */}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="section-label urgent-label">URGENT</p>
            <h2>Students need these now</h2>
          </div>

          <a href="/urgent">View all →</a>
        </div>

        <div className="urgent-grid">

          <div className="urgent-card">
            <div>
              <span className="urgent-badge">Urgent</span>
              <h3>Practical Notebook</h3>
              <p>Needed within 3 hours</p>
            </div>

            <button>Can Help</button>
          </div>

          <div className="urgent-card">
            <div>
              <span className="urgent-badge">Urgent</span>
              <h3>Scientific Calculator</h3>
              <p>Needed by tomorrow</p>
            </div>

            <button>Can Help</button>
          </div>

          <div className="urgent-card">
            <div>
              <span className="urgent-badge">Urgent</span>
              <h3>File Cover</h3>
              <p>Needed today</p>
            </div>

            <button>Can Help</button>
          </div>

        </div>
      </section>


      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Popular Categories</h2>
          </div>
        </div>

        <div className="category-grid">

          <div className="category-card">
            <span>📚</span>
            <p>Books</p>
          </div>

          <div className="category-card">
            <span>🚲</span>
            <p>Cycles</p>
          </div>

          <div className="category-card">
            <span>💻</span>
            <p>Electronics</p>
          </div>

          <div className="category-card">
            <span>📐</span>
            <p>Stationery</p>
          </div>

          <div className="category-card">
            <span>🏏</span>
            <p>Sports</p>
          </div>

          <div className="category-card">
            <span>🛏️</span>
            <p>Hostel Items</p>
          </div>

        </div>
      </section>


      {/* Recently Listed */}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="section-label">MARKETPLACE</p>
            <h2>Recently Listed</h2>
          </div>

          <a href="/browse">Browse all →</a>
        </div>

        <div className="resource-grid">
            {resources.map((resource) => (
                <ResourceCard
                    key={resource.title}
                    {...resource}
                />
            ))}
        </div>
      </section>

    </div>
  );
}

export default Home;