import Milion from "./Calculators/Milion";
import Inflation from "./Calculators/Inflation";
import HowMuch from "./Calculators/HowMuch";

import './styles/Simulator.css';  

export default function Simulator() {
  return (
    <div className="mainSimulatorContainer">
      <Milion />
      <Inflation />
      <HowMuch />
    </div>
  );
}
