import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { initDataUnsafe } from '@twa-dev/sdk'
import CarCard from './CarCard'
import Loader from './Loader'
import { fetchCars } from '../api/cars'

const colorOptions = {
	검정색: 'Чёрный',
	검정투톤: 'Чёрный двухцветный',
	쥐색: 'Серый',
	은색: 'Серебристый',
	은회색: 'Светло-серый',
	은색투톤: 'Серебристый двухцветный',
	흰색: 'Белый',
	진주색: 'Перламутровый',
	흰색투톤: 'Белый двухцветный',
	진주투톤: 'Перламутровый двухцветный',
	은하색1: 'Металлик',
	명은색: 'Светло-металлик',
	갈대색: 'Бежевый',
	연금색: 'Светло-золотистый',
	갈색: 'Коричневый',
	갈색투톤: 'Коричневый двухцветный',
	금색: 'Золотистый',
	금색투톤: 'Золотистый двухцветный',
	청색: 'Синий',
	하늘색: 'Голубой',
	담녹색: 'Оливковый',
	녹색: 'Зелёный',
	연두색: 'Светло-зелёный',
	청옥색: 'Бирюзовый',
	빨간색: 'Красный',
	주황색: 'Оранжевый',
	자주색: 'Бордовый',
	보라색: 'Фиолетовый',
	분홍색: 'Розовый',
	노란색: 'Жёлтый',
}

const transmissionOptions = {
	오토: 'Автомат',
	수동: 'Механика',
	세미오토: 'Полуавтомат',
	CVT: 'Вариатор',
	기타: 'Другое',
}

const fuelTypeOptions = {
	가솔린: 'Бензин',
	디젤: 'Дизель',
	'LPG(일반인 구입)': 'LPG (для частных лиц)',
	'가솔린+전기': 'Бензин + Электро',
	'디젤+전기': 'Дизель + Электро',
	'가솔린+LPG': 'Бензин + LPG',
	'가솔린+CNG': 'Бензин + CNG',
	전기: 'Электро',
	기타: 'Другое',
}

const SearchForm = () => {
	const [userId, setUserId] = useState(null)

	const [currentPage, setCurrentPage] = useState(1) // Текущая страница
	const [totalPages, setTotalPages] = useState(1) // Общее количество страниц

	const [carNumber, setCarNumber] = useState('')

	const [color, setColor] = useState('')

	const [transmission, setTransmission] = useState('')
	const [fuelType, setFuelType] = useState('')

	const [priceFrom, setPriceFrom] = useState(100)
	const [priceTo, setPriceTo] = useState(10000)

	const [mileageFrom, setMileageFrom] = useState(10000)
	const [mileageTo, setMileageTo] = useState(200000)

	const [yearFrom, setYearFrom] = useState(1980)
	const [yearTo, setYearTo] = useState(new Date().getFullYear())
	const [monthFrom, setMonthFrom] = useState('00')
	const [monthTo, setMonthTo] = useState('99')

	const [loading, setLoading] = useState(false)

	const [cars, setCars] = useState([])
	const [carType, setCarType] = useState('Y')

	const [brand, setBrand] = useState('')
	const [brands, setBrands] = useState([])

	const [models, setModels] = useState([]) // Список моделей
	const [model, setModel] = useState('') // Выбранная модель

	const [generations, setGenerations] = useState([]) // Список поколений
	const [generation, setGeneration] = useState('') // Выбранное поколение

	const [fuelDrivetrains, setFuelDrivetrains] = useState([]) // Список объёмов и типов топлива
	const [fuelDrivetrain, setFuelDrivetrain] = useState('') // Выбранный объём и тип топлива

	const [trims, setTrims] = useState([]) // Список комплектаций
	const [trim, setTrim] = useState('') // Выбранная комплектация// Получение списка марок при изменении carType

	const getCars = async (searchParams) => {
		setLoading(true)

		try {
			const response = await fetchCars(searchParams)

			if (response.cars) {
				setCars(response.cars) // Сохраняем список автомобилей в состояние
				setTotalPages(response.total_pages)
			} else {
				console.error(
					'Ошибка при получении списка автомобилей:',
					response.status,
				)
			}
		} catch (error) {
			console.error('Ошибка запроса:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (initDataUnsafe?.user) {
			setUserId(initDataUnsafe.user.id)
		}
	}, [])

	useEffect(() => {
		getCars({
			car_type: carType,
			brand,
			model_group: model,
			model: generation,
			fuel_drivetrain: fuelDrivetrain,
			trim,
			year_from: yearFrom,
			year_to: yearTo,
			month_from: monthFrom,
			month_to: monthTo,
			mileage_from: mileageFrom,
			mileage_to: mileageTo,
			price_from: priceFrom,
			price_to: priceTo,
			fuel_type: fuelType,
			transmission,
			color,
			car_number: carNumber,
			page: currentPage,
			limit: 20,
		})
	}, [
		carType,
		brand,
		model,
		generation,
		fuelDrivetrain,
		trim,
		yearFrom,
		yearTo,
		monthFrom,
		monthTo,
		mileageFrom,
		mileageTo,
		priceFrom,
		priceTo,
		fuelType,
		transmission,
		color,
		carNumber,
		currentPage,
	])

	useEffect(() => {
		const fetchBrands = async () => {
			const url =
				carType === 'Y'
					? 'http://localhost:8000/api/brands/korean'
					: 'http://localhost:8000/api/brands/foreign'

			try {
				const response = await fetch(url)
				if (response.ok) {
					const data = await response.json()
					setBrands(data.brands)
					setBrand('') // Сбросить выбранную марку при смене типа авто
				} else {
					console.error('Ошибка при получении марок:', response.status)
				}
			} catch (error) {
				console.error('Ошибка запроса:', error)
			}
		}

		fetchBrands()
	}, [carType]) // Запрос выполняется при изменении carType

	useEffect(() => {
		const fetchModels = async () => {
			if (brand) {
				const url = `http://localhost:8000/api/models/${brand}?car_type=${carType}`

				try {
					const response = await fetch(url)
					if (response.ok) {
						const data = await response.json()
						setModels(data.models)
						setModel('') // Сбросить выбранную модель при смене марки
					} else {
						console.error('Ошибка при получении моделей:', response.status)
					}
				} catch (error) {
					console.error('Ошибка запроса:', error)
				}
			}
		}

		fetchModels()
	}, [brand, carType]) // Выполняется при изменении brand или carType

	useEffect(() => {
		const fetchGenerations = async () => {
			if (model) {
				const url = `http://localhost:8000/api/models/${brand}/${model}?car_type=${carType}`

				try {
					const response = await fetch(url)
					if (response.ok) {
						const data = await response.json()
						setGenerations(data.models)
						setGeneration('') // Сбросить выбранное поколение при смене модели
					} else {
						console.error('Ошибка при получении поколений:', response.status)
					}
				} catch (error) {
					console.error('Ошибка запроса:', error)
				}
			}
		}

		fetchGenerations()
	}, [model, brand, carType]) // Выполняется при изменении model, brand или carType

	useEffect(() => {
		const fetchFuelDrivetrains = async () => {
			if (generation) {
				const url = `http://localhost:8000/api/fuel_drivetrains/${brand}/${model}/${generation}?car_type=${carType}`

				try {
					const response = await fetch(url)
					if (response.ok) {
						const data = await response.json()
						setFuelDrivetrains(data.fuel_drivetrains)
						setFuelDrivetrain('') // Сбросить выбранный тип топлива при смене поколения
					} else {
						console.error(
							'Ошибка при получении типов топлива:',
							response.status,
						)
					}
				} catch (error) {
					console.error('Ошибка запроса:', error)
				}
			}
		}

		fetchFuelDrivetrains()
	}, [generation, model, brand, carType]) // Выполняется при изменении generation, model, brand или carType

	useEffect(() => {
		const fetchTrims = async () => {
			if (fuelDrivetrain) {
				const url = `http://localhost:8000/api/trims/${brand}/${model}/${generation}/${fuelDrivetrain}?car_type=${carType}`

				try {
					const response = await fetch(url)
					if (response.ok) {
						const data = await response.json()
						setTrims(data.trims)
						setTrim('') // Сбросить выбранную комплектацию при смене fuelDrivetrain
					} else {
						console.error('Ошибка при получении комплектаций:', response.status)
					}
				} catch (error) {
					console.error('Ошибка запроса:', error)
				}
			}
		}

		fetchTrims()
	}, [fuelDrivetrain, generation, model, brand, carType]) // Выполняется при изменении fuelDrivetrain, generation, model, brand или carType

	const handleCarTypeChange = (e) => {
		setCarType(e.target.value)
		setBrands([])
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		window.scrollTo({ behavior: 'smooth', top: 0, left: 0 })

		const searchParams = {
			car_type: carType,
			brand,
			model_group: model,
			model: generation,
			fuel_drivetrain: fuelDrivetrain,
			trim,
			year_from: yearFrom,
			year_to: yearTo,
			month_from: monthFrom,
			month_to: monthTo,
			mileage_from: mileageFrom,
			mileage_to: mileageTo,
			price_from: priceFrom,
			price_to: priceTo,
			fuel_type: fuelType,
			transmission: transmission,
			color,
			car_number: carNumber,
			page: currentPage,
			limit: 20,
		}

		try {
			const response = await fetch('http://localhost:8000/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(searchParams),
			})

			if (response.ok) {
				console.log('Запрос успешно отправлен!')
			} else {
				console.error('Ошибка при отправке запроса:', response.status)
			}
		} catch (error) {
			console.error('Ошибка запроса:', error)
		}
	}

	// Список лет от минимального года до текущего
	const years = Array.from(
		{ length: new Date().getFullYear() - 1980 + 1 },
		(_, i) => 1980 + i,
	)

	// Фильтрация по годам
	const filteredYearsFrom = years.filter((year) => year <= yearTo)
	const filteredYearsTo = years.filter((year) => year >= yearFrom)

	// Список месяцев
	const months = [
		{ value: '00', label: 'Все месяцы' },
		{ value: '01', label: 'Январь' },
		{ value: '02', label: 'Февраль' },
		{ value: '03', label: 'Март' },
		{ value: '04', label: 'Апрель' },
		{ value: '05', label: 'Май' },
		{ value: '06', label: 'Июнь' },
		{ value: '07', label: 'Июль' },
		{ value: '08', label: 'Август' },
		{ value: '09', label: 'Сентябрь' },
		{ value: '10', label: 'Октябрь' },
		{ value: '11', label: 'Ноябрь' },
		{ value: '12', label: 'Декабрь' },
		{ value: '99', label: 'Все месяцы' },
	]

	// Фильтрация по месяцам
	const filteredMonthsFrom =
		yearFrom === yearTo
			? months.filter((month) => parseInt(month.value) <= parseInt(monthTo))
			: months

	const filteredMonthsTo =
		yearFrom === yearTo
			? months.filter((month) => parseInt(month.value) >= parseInt(monthFrom))
			: months

	return (
		<div className='mb-10'>
			<div className='m-auto'>
				<form onSubmit={handleSubmit} className='flex flex-col gap-4 p-4'>
					<div>
						<label className='block text-gray-700'>Тип авто:</label>
						<select
							value={carType}
							onChange={handleCarTypeChange}
							className='border rounded p-2 w-full'
						>
							<option value='N'>Иностранные</option>
							<option value='Y'>Корейские</option>
						</select>
					</div>

					<div>
						<ul className='border rounded p-2 w-full max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
							{brands?.map((item) => (
								<li
									key={item.value}
									className={`border-b last:border-none ${
										brand && brand !== item.value ? 'hidden' : ''
									}`}
								>
									<div
										onClick={() =>
											setBrand(brand === item.value ? '' : item.value)
										}
										className={`cursor-pointer flex justify-between items-center p-2 ${
											brand === item.value ? 'text-red-600 font-bold' : ''
										}`}
									>
										{item.eng_name}
										<span className='text-gray-600'>
											{brand === item.value ? '-' : '+'}
										</span>
									</div>

									{/* Вложенный список моделей */}
									{brand === item.value && (
										<ul className='pl-4 border-l ml-2'>
											{/* Если модель выбрана, показываем только её */}
											{model
												? models
														.filter((modelItem) => modelItem.value === model)
														.map((modelItem) => (
															<li
																key={modelItem.value}
																className='border-b last:border-none'
															>
																<div
																	onClick={() =>
																		setModel(
																			model === modelItem.value
																				? ''
																				: modelItem.value,
																		)
																	}
																	className={`cursor-pointer flex justify-between items-center p-2 ${
																		model === modelItem.value
																			? 'text-blue-600 font-bold'
																			: ''
																	}`}
																>
																	{modelItem.eng_name}
																	<span className='text-gray-600'>
																		{model === modelItem.value ? '-' : '+'}
																	</span>
																</div>

																{/* Вложенный список поколений */}
																{model === modelItem.value && (
																	<ul className='pl-4 border-l ml-2'>
																		<li className='font-bold text-gray-700 mb-2'>
																			Поколение:
																		</li>
																		{generations
																			?.sort((a, b) =>
																				a.model_start_date > b.model_start_date
																					? -1
																					: 1,
																			)
																			.map((genItem, i) => (
																				<>
																					<li
																						key={i}
																						className='cursor-pointer p-2 hover:bg-gray-100 flex justify-between'
																						onClick={() =>
																							setGeneration(
																								generation === genItem.value
																									? ''
																									: genItem.value,
																							)
																						}
																					>
																						{genItem.value} (
																						{genItem.model_start_date.substring(
																							2,
																							4,
																						)}{' '}
																						-{' '}
																						{genItem.model_end_date
																							? genItem.model_end_date.substring(
																									2,
																									4,
																							  )
																							: 'н.в'}
																						)
																						<span className='text-gray-600'>
																							{generation === genItem.value
																								? '-'
																								: '+'}
																						</span>
																					</li>

																					{generation === genItem.value && (
																						<ul className='pl-8 mt-1 space-y-1'>
																							<li className='font-bold text-gray-700 mb-1'>
																								Объём и тип топлива:
																							</li>
																							{fuelDrivetrains?.map(
																								(fuelItem) => (
																									<>
																										<li
																											key={fuelItem.value}
																											className='cursor-pointer hover:bg-gray-100 p-2 rounded flex justify-between'
																											onClick={() =>
																												setFuelDrivetrain(
																													fuelDrivetrain ===
																														fuelItem.value
																														? ''
																														: fuelItem.value,
																												)
																											}
																										>
																											{fuelItem.value}
																											<span className='text-gray-600'>
																												{fuelDrivetrain ===
																												fuelItem.value
																													? '-'
																													: '+'}
																											</span>
																										</li>

																										{fuelDrivetrain ===
																											fuelItem.value && (
																											<ul className='pl-12 mt-1 space-y-1'>
																												<li className='font-bold text-gray-700 mb-1'>
																													Комплектация:
																												</li>
																												{trims?.map(
																													(trimItem) => (
																														<li
																															key={
																																trimItem.value
																															}
																															className='cursor-pointer hover:bg-gray-100 p-2 rounded flex justify-between'
																															onClick={() =>
																																setTrim(
																																	trim ===
																																		trimItem.value
																																		? ''
																																		: trimItem.value,
																																)
																															}
																														>
																															{trimItem.value}
																															<span className='text-gray-600'>
																																{trim ===
																																trimItem.value
																																	? '-'
																																	: '+'}
																															</span>
																														</li>
																													),
																												)}
																											</ul>
																										)}
																									</>
																								),
																							)}
																						</ul>
																					)}
																				</>
																			))}
																	</ul>
																)}
															</li>
														))
												: // Если модель не выбрана, показываем все модели
												  models
														?.sort((a, b) => (a.eng_name > b.eng_name ? 1 : -1))
														.map((modelItem) => (
															<li
																key={modelItem.value}
																className='border-b last:border-none'
															>
																<div
																	onClick={() =>
																		setModel(
																			model === modelItem.value
																				? ''
																				: modelItem.value,
																		)
																	}
																	className={`cursor-pointer flex justify-between items-center p-2 ${
																		model === modelItem.value
																			? 'text-blue-600 font-bold'
																			: ''
																	}`}
																>
																	{modelItem.eng_name}
																	<span className='text-gray-600'>
																		{model === modelItem.value ? '-' : '+'}
																	</span>
																</div>
															</li>
														))}
										</ul>
									)}
								</li>
							))}
						</ul>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700'>Год от:</label>
							<select
								value={yearFrom}
								onChange={(e) => {
									const selectedYear = parseInt(e.target.value)
									setYearFrom(selectedYear)
									if (selectedYear > yearTo) {
										setYearTo(selectedYear) // Автоматически обновить yearTo
									}
								}}
								className='border rounded p-2 w-full'
								name='year_from'
							>
								{filteredYearsFrom.reverse().map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className='block text-gray-700'>Год до:</label>
							<select
								value={yearTo}
								onChange={(e) => {
									const selectedYear = parseInt(e.target.value)
									setYearTo(selectedYear)
									if (selectedYear < yearFrom) {
										setYearFrom(selectedYear) // Автоматически обновить yearFrom
									}
								}}
								className='border rounded p-2 w-full'
								name='year_to'
							>
								{filteredYearsTo.reverse().map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700'>Месяц от:</label>
							<select
								value={monthFrom}
								onChange={(e) => {
									const selectedMonth = e.target.value
									setMonthFrom(selectedMonth)
									if (
										yearFrom === yearTo &&
										parseInt(selectedMonth) > parseInt(monthTo)
									) {
										setMonthTo(selectedMonth) // Автоматически обновить monthTo
									}
								}}
								className='border rounded p-2 w-full'
								name='month_from'
							>
								{filteredMonthsFrom.map((month) => (
									<option key={month.value} value={month.value}>
										{month.label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className='block text-gray-700'>Месяц до:</label>
							<select
								value={monthTo}
								onChange={(e) => {
									const selectedMonth = e.target.value
									setMonthTo(selectedMonth)
									if (
										yearFrom === yearTo &&
										parseInt(selectedMonth) < parseInt(monthFrom)
									) {
										setMonthFrom(selectedMonth) // Автоматически обновить monthFrom
									}
								}}
								className='border rounded p-2 w-full'
								name='month_to'
							>
								{filteredMonthsTo.map((month) => (
									<option key={month.value} value={month.value}>
										{month.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700'>Пробег от:</label>
							<select
								value={mileageFrom}
								onChange={(e) => {
									const value = parseInt(e.target.value)
									setMileageFrom(value)
									// Обновляем минимальное значение для mileageTo
									if (value > mileageTo) setMileageTo(value)
								}}
								className='border rounded p-2 w-full'
							>
								{Array.from({ length: 20 }, (_, i) => (i + 1) * 10000).map(
									(value) => (
										<option key={value} value={value}>
											{value.toLocaleString()} км
										</option>
									),
								)}
							</select>
						</div>

						<div>
							<label className='block text-gray-700'>Пробег до:</label>
							<select
								value={mileageTo}
								onChange={(e) => {
									const value = parseInt(e.target.value)
									setMileageTo(value)
									// Обновляем максимальное значение для mileageFrom
									if (value < mileageFrom) setMileageFrom(value)
								}}
								className='border rounded p-2 w-full'
							>
								{Array.from({ length: 20 }, (_, i) => (i + 1) * 10000)
									.filter((value) => value >= mileageFrom)
									.map((value) => (
										<option key={value} value={value}>
											{value.toLocaleString()} км
										</option>
									))}
							</select>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700'>Цена от (만원):</label>
							<select
								value={priceFrom}
								onChange={(e) => {
									const value = parseInt(e.target.value)
									setPriceFrom(value)
									// Обновляем минимальное значение для priceTo
									if (value > priceTo) setPriceTo(value)
								}}
								className='border rounded p-2 w-full'
							>
								{Array.from({ length: 100 }, (_, i) => (i + 1) * 100).map(
									(value) => (
										<option key={value} value={value}>
											₩{(value * 10000).toLocaleString()}
										</option>
									),
								)}
							</select>
						</div>

						<div>
							<label className='block text-gray-700'>Цена до (만원):</label>
							<select
								value={priceTo}
								onChange={(e) => {
									const value = parseInt(e.target.value)
									setPriceTo(value)
									// Обновляем максимальное значение для priceFrom
									if (value < priceFrom) setPriceFrom(value)
								}}
								className='border rounded p-2 w-full'
							>
								{Array.from({ length: 100 }, (_, i) => (i + 1) * 100)
									.filter((value) => value >= priceFrom)
									.map((value) => (
										<option key={value} value={value}>
											₩{(value * 10000).toLocaleString()}
										</option>
									))}
							</select>
						</div>
					</div>

					<div>
						<label className='block text-gray-700'>Тип топлива:</label>
						<select
							value={fuelType}
							onChange={(e) => setFuelType(e.target.value)}
							className='border rounded p-2 w-full'
							name='fuel_type'
						>
							<option value=''>Выберите тип топлива</option>
							{Object.entries(fuelTypeOptions).map(([kor, rus]) => (
								<option key={kor} value={kor}>
									{rus}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className='block text-gray-700'>Тип трансмиссии:</label>
						<select
							value={transmission}
							onChange={(e) => setTransmission(e.target.value)}
							className='border rounded p-2 w-full'
							name='transmission'
						>
							<option value=''>Выберите трансмиссию</option>
							{Object.entries(transmissionOptions).map(([kor, rus]) => (
								<option key={kor} value={kor}>
									{rus}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className='block text-gray-700'>Цвет:</label>
						<select
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className='border rounded p-2 w-full'
							name='color'
						>
							<option value=''>Выберите цвет</option>
							{Object.entries(colorOptions).map(([kor, rus]) => (
								<option key={kor} value={kor}>
									{rus}
								</option>
							))}
						</select>
					</div>

					<button
						onClick={handleSubmit}
						className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-sm transition-colors duration-300 cursor-pointer'
					>
						Начать поиск автомобилей
					</button>
				</form>

				{/* {loading ? (
					<Loader />
				) : cars.length > 0 ? (
					<div className='mt-4 container mx-auto flex-1'>
						<ul className='space-y-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-4'>
							{cars.map((car) => (
								<CarCard car={car} key={car.Id} />
							))}
						</ul>
					</div>
				) : (
					<p>Автомобили не найдены</p>
				)} */}
			</div>

			{/* <div className='flex justify-center items-center space-x-2 mt-4'>
				<button
					disabled={currentPage === 1}
					onClick={() => {
						setCurrentPage((prev) => Math.max(prev - 1, 1))
						window.scrollTo({ behavior: 'smooth', top: 0, left: 0 })
					}}
					className='px-3 py-1 border rounded disabled:opacity-50'
				>
					Предыдущая
				</button>

				{getPaginationGroup().map((page) => (
					<button
						key={page}
						onClick={() => {
							setCurrentPage(page)
							window.scrollTo({ behavior: 'smooth', top: 0, left: 0 })
						}}
						className={`px-3 py-1 border rounded ${
							currentPage === page
								? 'bg-blue-500 text-white'
								: 'bg-white text-gray-700 hover:bg-gray-100'
						}`}
					>
						{page}
					</button>
				))}

				<button
					disabled={currentPage === totalPages}
					onClick={() => {
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						window.scrollTo({ behavior: 'smooth', top: 0, left: 0 })
					}}
					className='px-3 py-1 border rounded disabled:opacity-50'
				>
					Следующая
				</button>
			</div> */}
		</div>
	)
}

SearchForm.propTypes = {
	onSearch: PropTypes.func.isRequired,
}

export default SearchForm
