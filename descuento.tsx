import { useState } from 'react';
import { BorraIma} from '../interface/interfaceTabla';
import './estilos.css'
import {IoRemoveCircleOutline, IoTrash} from 'react-icons/io5';
import {AiOutlinePlusCircle} from "react-icons/ai"
import { useEffect } from 'react';
import {BsCashCoin} from "react-icons/bs"

import { FaPercentage } from "react-icons/fa";
 function ImageTable() {
   const [imageData, setImageData] = useState<BorraIma[]>([]);
   const [originalData, setOriginalData] = useState<BorraIma[]>([]);
   const [formData, setFormData] = useState<BorraIma>({name:'', precio: '', id:'', porcentaje:''});
   const [searchText, setSearchText] = useState('');
   const [selectedProduct, setSelectedProduct] = useState<BorraIma | null>(null);
   const [selectedProducts, setSelectedProducts] = useState(new Set());
   const [totalSubtotal, setTotalSubtotal] = useState<number>(0);
   const [tecladoVisible, setTecladoVisible] = useState(false);
   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
   const [input, setInput] = useState<string>('');
   const [activeInput, setActiveInput] = useState('');
   const [isFieldSelected, setIsFieldSelected] = useState(false);
   const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
   const [inputs, setInputs] = useState<string>('');
   const [activeInputs, setActiveInputs] = useState('');
   const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({});
   const [totalAhorro, setTotalAhorro] = useState<number>(0);
   const [descuento, setDescuento] = useState(0);

   
   const totalDeArticulos = imageData.length;
   const iva = 0.16;
   const calcularMontoIVA = () => {
     if (imageData.length > 0) {
       const totalSubtotal = imageData.reduce((total, data) => {
         return total + (parseFloat(calcularPrecioConDescuento(data.precio, data.porcentaje)) * Number(data.id));
       }, 0);
       const montoIVA = iva * totalSubtotal;
       return montoIVA.toFixed(2); // Redondear el resultado a dos decimales
     } else {
       return '0.00';
     }
   };
   useEffect(() => {
     // Calcula el subtotal total cuando cambia el estado imageData
     const newTotalSubtotal = imageData.reduce((total, data) => {
       return total + (parseFloat(calcularPrecioConDescuento(data.precio, data.porcentaje)) * Number(data.id));
     }, 0);
     setTotalSubtotal(newTotalSubtotal);
   }, [imageData]);
   const handleIncreaseAmount = (product: BorraIma) => {
     const updatedData = imageData.map((item) => {
       if (item === product) {
         return {
           ...item,
           id: String(parseInt(item.id) + 1), // Incrementa la cantidad
         };
       }
       return item;
     });
    setImageData(updatedData);
   };

   const handleDecreaseAmount = (product: BorraIma) => {
     const updatedData = imageData.map((item) => {
       if (item === product) {
         const newAmount = parseInt(item.id) - 1;
         return{
          ...item,
           id: newAmount >= 0 ? String(newAmount) : item.id,
         };
       }
       return item;
     });
     setImageData(updatedData);
   };
   
   const addData = () => {
     if (formData.name && formData.precio && formData.id && formData.porcentaje) {
       const newData = { ...formData };
       const ahorroProducto = parseFloat(calcularPrecioConDescuentos(formData.precio, formData.porcentaje));
       setTotalAhorro((prevTotalAhorro) => prevTotalAhorro + ahorroProducto);
       setImageData([...imageData, newData]);
       setOriginalData([...originalData, newData]);
      setFormData({
         name: '',
         precio: '',
         id: '',
         porcentaje: '',
       });
       // Agregar una entrada de cantidad para el nuevo producto
       setQuantityInputs((prevInput) => ({
         ...prevInput,
         [newData.name]: '',
       }));
     }
   };

   const handleSelectProduct = (product) => {
     const updatedSelectedProducts = new Set(selectedProducts);
     if (updatedSelectedProducts.has(product)) {
       updatedSelectedProducts.delete(product); // Deseleccionar el producto
     } else {
       updatedSelectedProducts.add(product); // Seleccionar el producto
     }
     setSelectedProducts(updatedSelectedProducts);
   };
   const handleDeleteSelected = () => {
     // Elimina los productos seleccionados
     const updatedData = imageData.filter((data) => !selectedProducts.has(data));
     setImageData(updatedData);
     // Deselecciona todos los productos
     setSelectedProducts(new Set());
   };

  const deleteProduct = (product) => {
     var opcion = window.confirm("Realmente quieres eliminar el producto");
     if (opcion) {
       // Mover el producto eliminado a los datos eliminados
       const updatedData = imageData.filter((item) => item !== product);
       setImageData(updatedData);
       setSelectedProduct(null);
     }
   };

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData({
     ...formData,
     [name]: value,
   });
   setIsFieldSelected(false);
 };

  const calcularPrecioConDescuento = (precio, porcentaje) => {
  const descuento = (parseFloat(porcentaje) / 100) * parseFloat(precio);
  const precioConDescuento = parseFloat(precio) - descuento;
  return precioConDescuento.toString();
  };
  const calcularPrecioConDescuentos = (precio, porcentaje) => {
    const descuento = (parseFloat(porcentaje) / 100) * parseFloat(precio);
    const ahorro = descuento * Number(formData.id);
    return ahorro.toFixed(2);
  };
  
  const aplicarDescuento = () => {
    const descuentoDecimal = descuentoPorcentaje - descuento;

    const newData = imageData.map((item) => {
      if (selectedProducts.has(item)) {
        const precioConDescuento = calcularPrecioConDescuento(item.precio, descuentoDecimal);
        return {
          ...item,
          precio: precioConDescuento,
        };
      }
      return item;
    });

    setImageData(newData);
  };

   return (
     <div>
       <div className='container1'>
         <label htmlFor="name">Nombre:</label>
         <input
           className='input'
           type="text"
           id="name"
           name="name"
           value={formData.name}
           onChange={handleInputChange}
         />
       </div>
       <div className='container1'>
         <label htmlFor="precio">Precio:</label>
         <input
           className='input'
           type="text"
           id="precio"
           name="precio"
           value={formData.precio}
           onChange={handleInputChange}
         />
       </div>
       <div className='container1'>
         <label htmlFor="id">Cantidad:</label>
         <input
           className='input'
           type="text"
           id="id"
           name="id"
           value={formData.id}
           onChange={handleInputChange}
         />
       </div>
       <div className='container1'>
         <label htmlFor="porcentaje">Descuento:</label>
         <input
           className='input'
           type="text"
           id="porcentaje"
           name="porcentaje"
           value={formData.porcentaje}
           onChange={handleInputChange}
         />
       </div>
       <div className='container1'>
         <label htmlFor="porcentaje">Descuento General:</label>
         <input
           className='input'
           type="text"
           id="porcentaje"
           name="porcentaje"
           value={descuentoPorcentaje}
           onChange={(e) => setDescuentoPorcentaje(e.target.value)}
         />
       </div>
       <button className= "button" onClick={addData}>Agregar Datos</button>
       <div className="input-group inputg mb-3">
       </div>
       <table>
       <div className='table table-responsive' >
         <thead className=" table table-dark align-middle">
           <tr>
             <th className='th'>Nombre</th>
             <th className='th'>Precio</th>
             <th className='th'>Subtotal</th>
             <th className='th'>Cantidad</th> 
             <th className='th'><button className="btn-dark" onClick={aplicarDescuento}><FaPercentage /></button><button className="btn-dark" onClick={handleDeleteSelected}><IoTrash className='icon3'/></button></th>
             <th className='th'>Porcentaje de Ahorro</th>
             <th className='th'>c/Descuento</th>
           </tr>
         </thead>
         <tbody>
           {imageData.map((data, index) => (
             <tr className= 'align-middle' key={index} onClick={() => showProductDetails(data)}>
               <td>{data.name}</td>
               <td>{data.precio}</td>
               <td>
               ${(parseFloat(calcularPrecioConDescuento(data.precio, data.porcentaje)) * Number(data.id)).toFixed(2)}
                <div className="fixed"></div></td>
                 <td>
                    <button className='btn' onClick={()=> handleIncreaseAmount(data)}><AiOutlinePlusCircle className='icon1'/></button>
                    <input 
                    className='inputg'
                    type='text'
                    id='id'
                    value={data.id}
                    >
                     </input>
                        <button className='btn' onClick={()=> handleDecreaseAmount(data)}><IoRemoveCircleOutline className='icon1'/></button>
                    <button className="btn" onClick={() => deleteProduct(data)}><IoTrash className='icon2'/></button>
                 </td>  
               <td><input
                   type='checkbox'
                   checked={selectedProducts.has(data)}
                   onChange={() => handleSelectProduct(data)}
                 />
               </td>
               <td>%{data.porcentaje}</td>
               <td>
               ${calcularPrecioConDescuento(data.precio, data.porcentaje)}
               </td>

             </tr> 
             
           ))}
         </tbody>
         </div>
       </table>
       <table>
         <div className='table table'>
       <thead className=' table1 table-dark alig-middle'>
           <tr>
             <th className='th' >Otros costos</th>
             <th className='th'>Total Ahorrado</th>
             <th className='th'>Iva</th>
             <th className='th'>Subtotal</th>
             <th className='th'>Total <BsCashCoin className= 'color'/> </th>
             <th className='th'>Total de articulos</th>
             <th className='th'></th>
             </tr>
             </thead>
             <tbody>
          <tr>
               <td>0</td>
               <td>${totalAhorro.toFixed(2)}</td>
               <td>${calcularMontoIVA()}</td>
               <td>${totalSubtotal.toFixed(2)}</td>
               <td>${(parseFloat(calcularMontoIVA()) + parseFloat(totalSubtotal)).toFixed(2)}</td>
               <td>{totalDeArticulos}</td>
             </tr>
       </tbody>
             </div>
       </table>
     </div>
   );
 }
 export default ImageTable;