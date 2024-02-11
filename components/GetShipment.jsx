
import React , {useState} from 'react'
import { Str1 } from '.'

const GetShipment = ({getModel , setGetModel , getShipment}) => {
  const [index , setIndex]=useState(0)
  const [singleShipmentData , setSingleShipmentData] = useState()
  
  const getshipmentData = async () =>{
    const getData = await getShipment(index)
    setSingleShipmentData(getData)
    console.log(getData)
  }
  console.log(singleShipmentData);
  
    const convTime = (time) =>{
    const newTime = new Date (time)
    const dateTime = new Intl.DateTimeFormat("en US" , {
      year : "numeric",
      month : "2-digit",
      dateStyle : "full",
      day : "2-digit"
    }).format(newTime)
    return dateTime
  };

  return getModel ? (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='fixed inset-0 w-full h-full bg-black opacity-40' onClick={()=> setGetModel(false)}>
      </div>
      <div className='flex items-center min-h-screen px-4 py-8'>
        <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
          <div className='flex justify-end'>
            <button className='p-2 text-gray-400 rounded-md hover:bg-slate-300' onClick={()=> setGetModel(false)}/>
            <Str1/>

          </div>

          <div className='max-w-sm mx-auto py-3 space-y-3 text-center'>
            <h4 className='text-lg font-medium text-gray-700'>Product Tracking Details</h4>
            <form onSubmit={(e)=>e.preventDefault()}>  
            <div className="relative mt-3">           
                <input 
                type="number" placeholder="Id" className=" w-full pl-5 pr-3 text-gray-50 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                onChange={(e) => setIndex(e.target.value)}
                />
                <button onClick={()=> getshipmentData()} className='block w-full mt-3 py-4 px-4 font-medium text-center text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg ring-2'>Get Details</button>
                </div>  
            </form>
            {
              singleShipmentData == undefined ? (
                ""
              ) : (
                <div className='text-left'>
                  <p> Sender : {singleShipmentData.sender.slice(0 , 25)} ...</p>
                  <p> Receiver : {singleShipmentData.receiver.slice(0 , 25)} ...</p>
                  <p> PickupTime : {convTime.singleShipmentData.pickupTime} </p>
                  <p> delivery Time  : {singleShipmentData.deliveryTime} </p>
                  <p> Distance : {singleShipmentData.distance} </p>
                  <p> Price : {singleShipmentData.price} </p>
                  <p> Status : {singleShipmentData.status} </p>
                  <p>Paid : {""} {singleShipmentData.isPaid ? "Complete" : "Not Complete"}</p>
                </div>

              )
            }

          </div>
        </div>

      </div>

    </div>

  ):(
""
  )
}

export default GetShipment