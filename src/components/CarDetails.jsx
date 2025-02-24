import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Loader } from '../components'
import axios from 'axios'
import {
	FaFileInvoiceDollar,
	FaMoneyBill,
	FaRecycle,
	FaCheckCircle,
	FaMoneyBillWave,
	FaTachometerAlt,
	FaCalendarAlt,
	FaGasPump,
	FaCogs,
	FaPalette,
	FaCarSide,
} from 'react-icons/fa'
import { BsFuelPump } from 'react-icons/bs'

// Кастомные стрелки
const NextArrow = (props) => {
	const { onClick } = props
	return (
		<div
			className='absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer text-3xl text-white hover:text-black'
			onClick={onClick}
		>
			<FaArrowRight />
		</div>
	)
}

const PrevArrow = (props) => {
	const { onClick } = props
	return (
		<div
			className='absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer text-3xl text-white  hover:text-black'
			onClick={onClick}
		>
			<FaArrowLeft />
		</div>
	)
}

// Настройки Image Slider с кастомными стрелками
const sliderSettings = {
	dots: false,
	infinite: true,
	speed: 500,
	autoplay: true,
	autoplaySpeed: 3000,
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: true,
	adaptiveHeight: true,
	nextArrow: <NextArrow />,
	prevArrow: <PrevArrow />,
}

const CarDetails = () => {
	const { carId } = useParams()
	const [car, setCar] = useState(null)
	const [loading, setLoading] = useState(true)
	const [payments, setPayments] = useState([])
	const [paymentsLoading, setPaymentsLoading] = useState(false)

	const imageUrl = (path) => `https://ci.encar.com${path}`

	const calculateAge = (year, month) => {
		const currentDate = new Date()
		const carDate = new Date(year, month - 1, 1) // Указываем 1-е число месяца

		// Вычисляем возраст в месяцах
		const ageInMonths =
			(currentDate.getFullYear() - carDate.getFullYear()) * 12 +
			(currentDate.getMonth() - carDate.getMonth())

		if (ageInMonths < 36) {
			return '0-3'
		} else if (ageInMonths < 60) {
			return '3-5'
		} else if (ageInMonths < 84) {
			return '5-7'
		} else {
			return '7-0'
		}
	}

	useEffect(() => {
		const fetchCarDetails = async () => {
			try {
				const response = await fetch(
					`https://api.encar.com/v1/readside/vehicle/${carId}`,
				)
				if (response.ok) {
					const data = await response.json()
					setCar(data)
				} else {
					console.error('Ошибка при получении данных:', response.status)
				}
			} catch (error) {
				console.error('Ошибка запроса:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchCarDetails()
	}, [carId])

	useEffect(() => {
		const fetchPayments = async () => {
			if (car) {
				setPaymentsLoading(true)

				const yearMonth = car?.category.yearMonth
				const year = yearMonth.substring(0, 4)
				const month = yearMonth.substring(4)
				const age = calculateAge(year, month)

				const engineVolume = car?.spec.displacement
				const price = car?.advertisement.price

				const engine =
					car?.spec?.fuelName === '가솔린'
						? '1'
						: car?.spec?.fuelName === '디젤'
						? '2'
						: car?.spec?.fuelName === '잡종'
						? '3'
						: '4'

				try {
					const response = await axios.post(
						'https://corsproxy.io/?key=28174bc7&url=https://calcus.ru/calculate/Customs',
						new URLSearchParams({
							owner: 1,
							age,
							engine,
							power: 1,
							power_unit: 1,
							value: engineVolume,
							price: price * 10000,
							curr: 'KRW',
						}).toString(),
						{
							withCredentials: false,
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						},
					)

					if (response.status === 200) {
						setPayments(response.data)
					}
				} catch (e) {
					console.error(e)
				} finally {
					setPaymentsLoading(false)
				}
			}
		}

		fetchPayments()
	}, [car])

	if (loading) return <Loader />
	if (!car) return <p>Данные не найдены.</p>

	const formattedYearMonth =
		car?.category.yearMonth.substring(4) +
		'/' +
		car?.category.yearMonth.substring(0, 4)

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4 text-center'>
				{car.category.modelName} ({car.category.gradeName})
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='w-full'>
					<Slider {...sliderSettings}>
						{car.photos
							?.sort((a, b) => (a.path > b.path ? 1 : -1))
							.map((photo) => (
								<div key={photo.code} className='px-2'>
									<img
										src={imageUrl(photo.path)}
										alt={car.category.modelName}
										className='w-full h-auto object-contain rounded-lg border-2 border-gray-200 shadow-lg'
									/>
								</div>
							))}
					</Slider>
				</div>

				<div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
					<h2 className='text-2xl font-bold text-gray-800 mb-4'>
						Характеристики автомобиля
					</h2>
					<ul className='space-y-3'>
						<li className='flex items-center'>
							<FaMoneyBillWave className='text-green-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Цена:</span>
							<span className='ml-auto text-gray-900 font-bold'>
								₩ {(car?.advertisement.price * 10000).toLocaleString()}
							</span>
						</li>
						<li className='flex items-center'>
							<FaCalendarAlt className='text-yellow-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>
								Дата регистрации:
							</span>
							<span className='ml-auto text-gray-900'>
								{formattedYearMonth}
							</span>
						</li>
						<li className='flex items-center'>
							<FaTachometerAlt className='text-blue-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Пробег:</span>
							<span className='ml-auto text-gray-900'>
								{car?.spec.mileage.toLocaleString()} км
							</span>
						</li>
						<li className='flex items-center'>
							<BsFuelPump className='text-blue-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Объём:</span>
							<span className='ml-auto text-gray-900'>
								{car?.spec.displacement.toLocaleString()} cc
							</span>
						</li>
						<li className='flex items-center'>
							<FaGasPump className='text-red-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Тип топлива:</span>
							<span className='ml-auto text-gray-900'>
								{car?.spec.fuelName}
							</span>
						</li>
						<li className='flex items-center'>
							<FaCogs className='text-purple-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Трансмиссия:</span>
							<span className='ml-auto text-gray-900'>
								{car?.spec.transmissionName}
							</span>
						</li>
						<li className='flex items-center'>
							<FaPalette className='text-pink-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Цвет:</span>
							<span className='ml-auto text-gray-900'>
								{car?.spec.colorName}
							</span>
						</li>
						<li className='flex items-center'>
							<FaCarSide className='text-indigo-500 text-2xl mr-3' />
							<span className='font-semibold text-gray-700'>Тип кузова:</span>
							<span className='ml-auto text-gray-900'>
								{car?.spec.bodyName}
							</span>
						</li>
					</ul>
				</div>
			</div>

			<div className='mt-10'>
				{paymentsLoading ? (
					<div className='flex justify-center items-center my-4'>
						<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
						<p className='ml-2 text-gray-600'>
							Рассчитываем таможенные платежи...
						</p>
					</div>
				) : (
					<div className='bg-white shadow-md rounded-lg p-4 mt-4'>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>
							Таможенные платежи во Владивостоке
						</h2>
						<ul className='space-y-3'>
							<li className='flex items-center justify-between border-b pb-2'>
								<div className='flex items-center'>
									<FaFileInvoiceDollar className='text-blue-500 text-xl mr-2' />
									<span className='text-gray-700 font-medium'>
										Таможенный сбор:
									</span>
								</div>
								<span className='text-gray-900 font-semibold'>
									{payments?.sbor?.toLocaleString()} ₽
								</span>
							</li>
							<li className='flex items-center justify-between border-b pb-2'>
								<div className='flex items-center'>
									<FaMoneyBill className='text-green-500 text-xl mr-2' />
									<span className='text-gray-700 font-medium'>
										Таможенная пошлина:
									</span>
								</div>
								<span className='text-gray-900 font-semibold'>
									{payments?.tax?.toLocaleString()} ₽
								</span>
							</li>
							<li className='flex items-center justify-between border-b pb-2'>
								<div className='flex items-center'>
									<FaRecycle className='text-yellow-500 text-xl mr-2' />
									<span className='text-gray-700 font-medium'>
										Утилизационный сбор:
									</span>
								</div>
								<span className='text-gray-900 font-semibold'>
									{payments?.util?.toLocaleString()} ₽
								</span>
							</li>
							<li className='flex items-center justify-between mt-4'>
								<div className='flex items-center'>
									<FaCheckCircle className='text-green-600 text-xl mr-2' />
									<span className='text-gray-800 font-bold'>
										Итого <br />
										(Стоимость авто + платежи):
									</span>
								</div>
								<span className='text-gray-900 font-bold text-lg'>
									{payments?.total2?.toLocaleString()} ₽
								</span>
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}

export default CarDetails
