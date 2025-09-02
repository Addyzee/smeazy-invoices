import InvoicePage from "./InvoicesPage";
import { useInvoiceStore } from "../store";
import PopUp from "./PopUp";

const InvoiceHome = () => {
  const popUpType = useInvoiceStore((state) => state.popUpType);

  return (
    <div className="h-full w-full overflow-y-scroll flex flex-col items-center justify-center">
      <InvoicePage />

      {popUpType && (
        <PopUp />
      )}
    </div>
  );
};

export default InvoiceHome;
