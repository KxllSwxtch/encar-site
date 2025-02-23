const Loader = () => {
	return (
		<div className='fixed inset-0 flex justify-center items-center z-50 pointer-events-none'>
			<div className='w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
		</div>
	)
}

export default Loader
