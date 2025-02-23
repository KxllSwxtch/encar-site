import PropTypes from 'prop-types'

const CarCard = ({ car }) => {
	const manufacturer = car?.Manufacturer
	const model = car?.Model
	const badge = car?.Badge
	const badgeDetail = car?.BadgeDetail
	const formattedYear =
		car?.Year?.toString().substring(4) +
		'/' +
		car?.Year?.toString().substring(0, 4)

	const formattedCarPrice = '₩' + (car?.Price * 10000).toLocaleString()
	const formattedCarMileage = car?.Mileage.toLocaleString()
	const formattedPhotoUrl = `https://ci.encar.com${car?.Photo}001.jpg`

	return (
		<div className='border rounded p-4 shadow hover:shadow-lg'>
			<img
				src={formattedPhotoUrl}
				alt={car.Name}
				className='w-full h-48 object-contain'
			/>
			<h2 className='text-lg font-bold mt-2'>
				{manufacturer} {model} {badge} {badgeDetail}
			</h2>
			<p>Дата регистрации: {formattedYear}</p>
			<p>Цена: {formattedCarPrice}</p>
			<p>Пробег: {formattedCarMileage} км</p>
		</div>
	)
}

CarCard.propTypes = {
	car: PropTypes.shape({
		Model: PropTypes.string.isRequired,
		Badge: PropTypes.string.isRequired,
		BadgeDetail: PropTypes.string.isRequired,
		Manufacturer: PropTypes.string.isRequired,
		Photo: PropTypes.string.isRequired,
		Name: PropTypes.string.isRequired,
		Year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		Price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		Mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
	}).isRequired,
}

export default CarCard
