import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="site-footer">
      <p>
        &copy; {new Date().getFullYear()} Gabira Giving Portal. All rights reserved. |{" "}
        <Link to="/contact">Contact Us</Link>
        <span className="clock-chip">{clock}</span>
      </p>
    </footer>
  );
}
