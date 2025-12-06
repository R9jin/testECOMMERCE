import React from "react";
import styles from "../styles/Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>© Copyright {currentYear} FoodFresh. Design by Group 10</p>
    </footer>
  );
}

export default Footer;
