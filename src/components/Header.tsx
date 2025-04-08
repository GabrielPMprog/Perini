import { useState } from "react";
import logo from "../assets/logo.svg";
import { FiMenu, FiX } from "react-icons/fi";
import './styles/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="headerContainer">
      <div className="logo">
        <a href="/Perini/">
          <img src={logo} alt="Logo" />
        </a>
      </div>

      <button className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      <nav className={menuOpen ? "navOpen" : ""}>
        <ul className="listItems">
          <li><a href="/Perini/financial" onClick={() => setMenuOpen(false)}>FINANCIAMENTO X ALUGUEL</a></li>
          <li><a href="/Perini/investimento" onClick={() => setMenuOpen(false)}>PLANILHA MILHÃO</a></li>
          <li><a href="/Perini/gráfico" onClick={() => setMenuOpen(false)}>GRÁFICO INFLAÇÃO</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
