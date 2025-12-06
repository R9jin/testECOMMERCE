import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useState } from "react";
import search from "../assets/search.png";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className={styles.navBar}>
      <Link to="/" className={styles.siteTitle}>
        <strong>Food</strong>Fresh
      </Link>

      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          className={styles.searchBar}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.searchBtn} type="submit">
          <img src={search} alt="Search" className={styles.searchImg} />
        </button>
      </form>

      <ul className={styles.navList}>
        <CustomLink to="/home">Home</CustomLink>
        <CustomLink to="/category">Category</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
        <CustomLink to="/wishlist">Wishlist</CustomLink>
        <CustomLink to="/cart">Cart</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
      <Link to={to} className={styles.navLink} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
