import "./styles/Home.css";

import Profile from "../assets/profile.svg";

function Home() {
  return (
    <div className="homeContainer">
      <div className="homeTextContainer">
        <h1>Gabriel Paiva de Medeiros</h1>
        <p>
          Site produzido por um fã com inutito de disponibilizar as planilhas do
          curso viver de renda no dispositivos celulares.
        </p>
      </div>
      <img src={Profile} alt="profile" className="profileImage" />
    </div>
  );
}

export default Home;
