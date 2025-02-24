import { Routes, Route } from 'react-router-dom'
import { Navbar, SearchForm, CarDetails } from './components'

function App() {
	return (
		<div>
			<Navbar />
			<Routes>
				<Route path='/' element={<SearchForm />} />
				<Route path='/car/:carId' element={<CarDetails />} />
			</Routes>
		</div>
	)
}

export default App
