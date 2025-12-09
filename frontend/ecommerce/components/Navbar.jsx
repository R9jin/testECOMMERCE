import { useState } from "react";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import search from "../assets/search.png";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 1. State for menu
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsMenuOpen(false); // Close menu on search
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.navHeader}>
        <Link to="/" className={styles.siteTitle} onClick={closeMenu}>
          <strong>Food</strong>Fresh
        </Link>

        {/* 2. Hamburger Button (Visible only on mobile via CSS) */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* 3. Group Search and Menu together for easier collapsing */}
      <div className={`${styles.navLinksContainer} ${isMenuOpen ? styles.active : ""}`}>
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
          <CustomLink to="/home" onClick={closeMenu}>Home</CustomLink>
          <CustomLink to="/category" onClick={closeMenu}>Category</CustomLink>
          <CustomLink to="/profile" onClick={closeMenu}>Profile</CustomLink>
          <CustomLink to="/wishlist" onClick={closeMenu}>Wishlist</CustomLink>
          <CustomLink to="/cart" onClick={closeMenu}>Cart</CustomLink>
        </ul>
      </div>
    </nav>
  );
}

function CustomLink({ to, children, onClick, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
      <Link to={to} className={styles.navLink} onClick={onClick} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;