import { useState } from "react";
import logo from "../assets/logo.svg";
import { FiMenu, FiX } from "react-icons/fi";
import './styles/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  const navItems = [
    { href: "/Perini/financial", label: "FINANCIAMENTO X ALUGUEL" },
    { href: "/Perini/investimento", label: "PLANILHA MILHÃO" },
    { href: "/Perini/grafico", label: "GRÁFICO INFLAÇÃO" },
    { href: "/Perini/orcamento", label: "SUGESTÃO DE ORÇAMENTO" },
    { href: "/Perini/formadepagamento", label: "À VISTA OU A PRAZO?" },
  ];

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
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setMenuOpen(false)}
                className={currentPath === href ? "activeLink" : ""}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
export default Header
