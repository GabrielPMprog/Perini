import Milion from "./Calculators/Milion";
import Inflation from "./Calculators/Inflation";
import HowMuch from "./Calculators/HowMuch";

import './styles/Simulator.css';  

export default function Simulator() {
  return (
    <div className="simuladorContainer">
      <Milion />
      <Inflation />
      <HowMuch />
    </div>
  );
}
