import axios from 'axios'

const API_URL = 'https://encar-api-386c41474ec8.herokuapp.com/api'

export const fetchCars = async (params) => {
	try {
		const response = await axios.get(API_URL + '/cars', { params })

		console.log(params)

		return response.data
	} catch (error) {
		console.error('Ошибка при получении списка автомобилей:', error)
		return []
	}
}
