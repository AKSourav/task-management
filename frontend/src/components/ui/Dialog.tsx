interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  export const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div
            className="fixed inset-0 bg-black/30 transition-opacity"
            onClick={onClose}
          ></div>
          <div className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-4">{children}</div>
  );
  
  export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mb-4">{children}</div>
  );
  
  export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-medium leading-6 text-gray-900">{children}</h3>
  );