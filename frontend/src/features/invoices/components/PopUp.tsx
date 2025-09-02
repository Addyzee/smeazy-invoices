import { useInvoiceStore } from "../store";
import { InvoiceDisplay } from "./InvoiceDisplay";
import { CreateInvoiceForm, DuplicateInvoiceForm, UpdateInvoiceForm } from "./InvoiceForm";

const PopUp = () => {
    const setPopUpType = useInvoiceStore((state) => state.setPopUpType);
    const popUpType = useInvoiceStore((state) => state.popUpType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Enhanced Glassmorphism Backdrop */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/30 via-gray-900/20 to-black/40 backdrop-blur-md"
            onClick={() => setPopUpType(null)}
          >
            {/* Animated background particles/elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>

          {/* Modal Container with enhanced styling */}
          <div className="h-full bg-white/10 backdrop-blur-sm rounded-3xl p-2 shadow-2xl border border-white/20">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 h-full overflow-y-scroll">
              {popUpType === "create" ? (
                <CreateInvoiceForm />
              ) : popUpType === "update" ? (
                <UpdateInvoiceForm/>
              ) : popUpType === "duplicate" ? (
                <DuplicateInvoiceForm/>
              ) : popUpType === "view" ? (
                <InvoiceDisplay />
              ) : null}
            </div>
          </div>
        </div>
      )}

export default PopUp