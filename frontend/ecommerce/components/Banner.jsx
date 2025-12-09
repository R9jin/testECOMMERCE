import { useLocation } from "react-router-dom";
import banner from "../assets/banner.png";
import styles from "../styles/Banner.module.css";

const routeTitles = {
  "/": { title: "SAVORING CULINARY DELIGHTS WITH EVERY CLICK", style: "homeTitle" },
  "/home": { title: "SAVORING CULINARY DELIGHTS WITH EVERY CLICK", style: "homeTitle" },
  "/category": { title: "CATEGORIES", style: "normalTitle" },
  "/profile": { title: "USER ACCOUNT", style: "normalTitle" },
  "/wishlist": { title: "WISHLIST", style: "normalTitle" },
  "/cart": { title: "CART", style: "normalTitle" },
  "/checkout": { title: "CHECKOUT", style: "normalTitle" },
  "/order-history": { title: "ORDER HISTORY", style: "normalTitle" },
  "/admin": { title: "ADMIN PRODUCT MANAGEMENT", style: "normalTitle" },
  "/search": { title: "SEARCH RESULTS", style: "normalTitle" },
};

function Banner() {
  const location = useLocation();
  const path = location.pathname;

  let bannerTitle, styling;

  if (routeTitles[path]) {
    ({ title: bannerTitle, style: styling } = routeTitles[path]);
  } else if (path.startsWith("/product/")) {
    bannerTitle = "PRODUCT DETAILS";
    styling = "normalTitle";
  } else if (path.startsWith("/track-order/")) {
    bannerTitle = "TRACK ORDER";
    styling = "normalTitle";
  } else if (path.startsWith("/rate-order/")) {
    bannerTitle = "RATE YOUR ORDER";
    styling = "normalTitle";
  } else {
    bannerTitle = "WELCOME TO OUR SHOP";
    styling = "normalTitle";
  }

  return (
    <div className={styles.bannerContainer}>
      <img src={banner} alt="Banner" className={styles.bannerImg} />
      <h1 className={styles[styling]}>{bannerTitle}</h1>
    </div>
  );
}

export default Banner;
