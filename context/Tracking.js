import React, { useState, useEffect } from "react";
import web3Modal from "web3modal";
import { ethers } from "ethers";
//  internal import
import tracking from "../context/Tracking.json";
const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = tracking.abi;
// fetching smart contarct
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, contractABI, signerOrProvider);
export const TrackingContext = React.createContext();
export const TrackingProvider = ({ children }) => {
  // state variable
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");
  const createShipment = async (items) => {
    console.log(items);
    const { receiver, pickUpTime, distance, price } = items;
    try {
      const web3modal = new web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickUpTime).getTime(),
        distance,
        ethers.utils.parseUints(price, 18),
        {
          value: ethers.utils.parseUints(price, 18),
        }
      );
      await createItem.wait();
      console.log(createItem);
    } catch (error) {
      console.log("some went wrong", error);
    }
  };
  const getAllShipment = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipments = await contract.getAllTransactions();
      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickUpTime: shipment.pickUpTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        ispaid: shipment.ispaid,
        status: shipment.status,
      }));
      return allShipments;
    } catch (error) {
      console.log("error want getting shipment");
    }
  };
  const getShipmentsCounts = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentsCounts(accounts[0]);
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("error wants getting shipments");
    }
  };
  const completeShipment = async (completeShip) => {
    console.log(completeShip);
    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3modal = new web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );
      transaction.wait();
      console.log(transaction);
    } catch (error) {
      console.log("wrong complete shipment", error);
    }
  };
  const getShipment = async (index) => {
    console.log(index * 1);
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index * 1);
      const singleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickUpTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        ispaid: shipment[6],
        status: shipment[7],
      };
      return singleShipment;
    } catch (error) {
      console.log("sorry no shipment");
    }
  };
  const startShipment = async (getProduct) => {
    const { receiver, index } = getProduct;
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3modal = new web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index * 1
      );
      shipment.wait();
      console.log(shipment);
    } catch (error) {
      console.log("sorry no shipment ", error);
    }
  };
  //check if wallet connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "no account";
      }
    } catch (error) {
      return "not connectyed";
    }
  };
  //  connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install Metamask";
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);
    } catch (error) {
      return " something went wrong";
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipment,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentsCounts,
        DappName,
        currentUser,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
