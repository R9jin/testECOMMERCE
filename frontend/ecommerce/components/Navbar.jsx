import { useState } from "react";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import search from "../assets/search.png";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsMenuOpen(false); 
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ✅ New handler to go back
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.navHeader}>
        {/* ✅ Return Arrow Button */}
        <button className={styles.backBtn} onClick={handleGoBack} aria-label="Go Back">
          &#8592;
        </button>

        <Link to="/" className={styles.siteTitle} onClick={closeMenu}>
          <strong>Food</strong>Fresh
        </Link>

        <button 
          className={styles.hamburger} 
          onClick={toggleMenu} 
          aria-label="Toggle navigation"
        >
          <span className={styles.bar} style={isMenuOpen ? {transform: 'rotate(45deg) translate(5px, 6px)'} : {}}></span>
          <span className={styles.bar} style={isMenuOpen ? {opacity: 0} : {}}></span>
          <span className={styles.bar} style={isMenuOpen ? {transform: 'rotate(-45deg) translate(5px, -6px)'} : {}}></span>
        </button>
      </div>

      <div className={`${styles.navLinksContainer} ${isMenuOpen ? styles.active : ""}`}>
        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchBar}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.searchBtn} type="submit" aria-label="Search">
            <img src={search} alt="" className={styles.searchImg} />
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