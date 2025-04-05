import { useState } from "react";
import logo from "../assets/logo.svg";
import { FiMenu, FiX } from "react-icons/fi"; // Ícones do menu

import './styles/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="headerContainer">
      <div className="logo">
        <a href="/"><img src={logo} alt="Logo" /></a>
      </div>

      <button className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      <nav className={menuOpen ? "navOpen" : ""}>
        <ul className="listItems">
      
          <li><a href="/financial" onClick={() => setMenuOpen(false)}>FINANCIAMENTO X ALUGUEL</a></li>
          <li><a href="/investimento" onClick={() => setMenuOpen(false)}>SIMULADOR INVESTIMENTO</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
