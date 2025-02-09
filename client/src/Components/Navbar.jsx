import React, { useState } from "react";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  return (
    <nav>
      <div className="logo">KING's</div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to="/" spy={true} smooth={true} duration={500}>
            HOME
          </Link>
          <Link to="contact" spy={true} smooth={true} duration={500}>
            CONTACT
          </Link>
          <Link to="about" spy={true} smooth={true} duration={500}>
            ABOUT
          </Link>
          <Link to="features" spy={true} smooth={true} duration={500}>
            FEATURES
          </Link>
        </div>
      </div>
      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
