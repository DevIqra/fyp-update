import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'
import images from '../Images/index'

export default ({
	openProfile,
	setOpenProfile,
	currentUser,
	getShipmentsCount,
	provider,
  }) => {
	const [count, setCount] = useState(null); // Initialize count as null
	const [balance, setBalance] = useState('');
  
	useEffect(() => {
	  // Only call getShipmentsCount if it's provided and is a function
	  if (typeof getShipmentsCount === 'function') {
		const fetchData = async () => {
		  try {
			const allData = await getShipmentsCount(); // Call getShipmentsCount to fetch data
			setCount(allData);
		  } catch (error) {
			console.error('Error fetching shipment count:', error);
		  }
		};
  
		fetchData(); // Call fetchData when the component mounts
	  }
	}, [getShipmentsCount]); // Include getShipmentsCount in dependency array
  
	useEffect(() => {
	  // Check if provider and currentUser are defined before accessing them
	  if (provider && currentUser) {
		const fetchBalance = async () => {
		  try {
			const balanceWei = await provider.getBalance(currentUser);
			const balanceEth = ethers.utils.formatEther(balanceWei);
			setBalance(balanceEth);
		  } catch (error) {
			console.error('Error fetching balance:', error);
		  }
		};
  
		fetchBalance(); // Call fetchBalance when provider or currentUser changes
	  }
	}, [provider, currentUser]); 

	return openProfile ? (
		<div className='fixed inset-0 z-10 overflow-y-auto'>
			<div
				className='fixed inset-0 w-full h-full bg-black opacity-40'
				onClick={() => setOpenProfile(false)}
			></div>
			<div className='flex justify-end'>
				<button
					className='p-2 text-gray-400 rounded-md hover:bg-gray-100'
					onClick={() => setOpenProfile(false)}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-5 h-5 mx-auto'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.
												 414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.
												 293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
			</div>

			<div className='max-w-sm mx-auto py-3 space-y-3 text-center'>
				<div className='flex flex-col items-center pb-10'>
					<Image
						className='w-24 mb-3 rounded-full shadow-lg'
						src={images.avatar}
						alt='Bonnie image'
					/>
					<h5 className='mb-1 text-xl font-medium    text-red-600  dark:text-white'>
						Welcome
					</h5>

					<span className='text-sm  text-red-600  dark:text-gray-400'>
						{currentUser}
					</span>

					<div className='flex mt-4 space-x-3 md:mt-6'>
						<a
							href='#'
							className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-red-600 bg-black rounded-lg border-2'
						>
							Balance: {balance} ETH
						</a>
						<a
							href='#'
							className='inline-flex items-center px-4 py-2 text-sm font-medium text-center  text-red-600  bg-black  rounded-lg border-2'
						>
							Total Shipment: {count}
						</a>
					</div>
				</div>
			</div>
		</div>
	) : (
		''
	)
}
