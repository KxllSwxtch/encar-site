const Navbar = () => {
	return (
		<nav className='bg-gray-800 p-4 text-white flex flex-row items-center justify-between'>
			<img
				className='block h-20 rounded-sm'
				src='https://res.cloudinary.com/pomegranitedesign/image/upload/v1740532018/KGA%20Korea/logo.png'
				alt=''
			/>
			<h1 className='text-md font-black ml-5'>
				KGA Korea | Уведомления о новых автомобилях
			</h1>
		</nav>
	)
}

export default Navbar
