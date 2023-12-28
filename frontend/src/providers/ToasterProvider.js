
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return ( 
    <Toaster 
      toastOptions={{
        position: 'top-center',
        
      }}
    /> 
  );
}
 
export default ToasterProvider;