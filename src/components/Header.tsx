import "./styles/Header.css";

function Header() {
  return (
    <div className="headerContainer">
      <div className="logo"></div>
      <nav>
        <ul className="listItems">
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/financial">FINANCIAMENTO X ALGUEL</a>
          </li>
          <li>Contato</li>
          <li>Teste</li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
