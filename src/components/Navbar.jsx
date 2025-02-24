import { Link } from 'react-router-dom'

const Navbar = () => {
	return (
		<nav className='bg-gray-800 p-4 text-white'>
			<h1 className='text-2xl font-bold'>
				<Link to='/'>Encar-Site</Link>
			</h1>
		</nav>
	)
}

export default Navbar
