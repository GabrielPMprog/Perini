import { createContext, useState, ReactNode } from 'react';

interface ImovelContextProps {
  valorImovel: number;
  setValorImovel: (valor: number) => void;
  prazo: number;
  setPrazo: (valor: number) => void;
  pagamento: number;
  setPagamento: (valor: number) => void;
  totalPagamento: number;
  setTotalPagamento: (total: number) => void;
}

export const ImovelContext = createContext<ImovelContextProps | undefined>(undefined);

export const ImovelProvider = ({ children }: { children: ReactNode }) => {
  const [valorImovel, setValorImovel] = useState<number>(250000);
const [prazo, setPrazo] = useState<number>(420);
const [pagamento, setPagamento] = useState<number>(0);
const [totalPagamento, setTotalPagamento] = useState<number>(0);


  return (
    <ImovelContext.Provider value={{ valorImovel, setValorImovel, setPrazo, prazo, pagamento, setPagamento, totalPagamento, setTotalPagamento }}> 
      {children}
    </ImovelContext.Provider>
  );
};