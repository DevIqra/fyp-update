import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Str1 } from "../components/SVG/Str1";
import {avatar} from "../Images/index";

export default function ProfileModal({
  openProfile,
  setOpenProfile,
  currentUser,
  getShipmentsCount
}) {
  const [count, setCount] = useState(0); // Default count value set to 0

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getShipmentsCount();
        setCount(allData);
      } catch (error) {
        console.error("Error fetching shipment count:", error);
      }
    };

    if (openProfile) {
      fetchData();
    }
  }, [openProfile, getShipmentsCount]); // Added dependencies to useEffect

  return openProfile ? (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={() => setOpenProfile(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg mx-auto bg-white rounded-md shadow-lg">
          <div className="flex justify-end">
            <button
              className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
              onClick={() => setOpenProfile(false)}
            >
              <Str1 />
            </button>
          </div>
          <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
            <div className="flex flex-col items-center pb-10">
              <Image
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={avatar}
                alt="bunny image"
                width={96}
                height={96}
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                Welcome Trader
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser}
              </span>
              <div className="flex mt-4 space-x-3 md:mt-6">
                <a
                  href="#"
                  className=" px-4 py-2 text-sm font-medium text-center text-black rounded-lg border-2 flex items-center"
                >
                  Balance: 345 ETH
                </a>
                <a
                  href="#"
                  className=" px-4 py-2 text-sm font-medium text-center text-black rounded-lg border-2 flex items-center"
                >
                  Total Shipments: {count}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
