import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../types/response.types';

interface WeatherData {
  city: string; 
  temp: number;
  humidity: number;
  description: string;
  icon: string;
}

class WeatherService {

  private readonly cities = [
    { name: 'Seoul', lat: 37.5665, lon: 126.9780 },      // 서울
    { name: 'Incheon', lat: 37.4563, lon: 126.7052 },    // 인천
    { name: 'Suwon', lat: 37.2911, lon: 127.0089 },      // 수원
    { name: 'Seongnam', lat: 37.4386, lon: 127.1378 },   // 성남
    { name: 'Goyang', lat: 37.6583, lon: 126.8320 },     // 고양
    { name: 'Yongin', lat: 37.2410, lon: 127.1775 },     // 용인
    { name: 'Gimpo', lat: 37.6619, lon: 126.7119 },      // 김포
    { name: 'Hanam', lat: 37.5398, lon: 127.2054 },      // 하남
    { name: 'Busan', lat: 35.1796, lon: 129.0756 },      // 부산
    { name: 'Daegu', lat: 35.8714, lon: 128.6014 },      // 대구
    { name: 'Daejeon', lat: 36.3504, lon: 127.3845 },    // 대전
    { name: 'Gwangju', lat: 35.1595, lon: 126.8526 },    // 광주
    { name: 'Ulsan', lat: 35.5384, lon: 129.3114 },      // 울산
    { name: 'Sejong', lat: 36.4801, lon: 127.2892 },     // 세종
    { name: 'Jeonju', lat: 35.8242, lon: 127.1480 }      // 전주
  ];

  async getCitiesWeather(): Promise<ApiResponse<WeatherData[]>> {
    try {
      if (!process.env.WEATHER_API_KEY) {
        throw new Error('날씨 API 키가 설정되지 않았습니다.');
      }

      const weatherPromises = this.cities.map(city => 
        axios.get(process.env.WEATHER_API_URL!, {
          params: {
            lat: city.lat,
            lon: city.lon,
            appid: process.env.WEATHER_API_KEY,
            units: 'metric',
            lang: 'kr'
          }
        }).catch(error => {
          console.error(`Error fetching weather for ${city.name}:`, error.response?.data || error.message);
          return null;
        })
      );

      const responses = await Promise.all(weatherPromises);
      
      const weatherData = responses
        .filter(response => response !== null)
        .map((response, index) => ({
          city: this.cities[index].name,
          temp: Number(response.data.main.temp.toFixed(1)),
          humidity: response.data.main.humidity,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon
        }));

      if (weatherData.length === 0) {
        throw new Error('날씨 정보를 가져오는데 실패했습니다.');
      }

      return {
        success: true,
        message: '전국 날씨 정보 조회 성공',
        data: weatherData
      };
    } catch (error) {
      console.error('Weather API Error:', error instanceof AxiosError ? error.response?.data : error);
      throw new Error('날씨 정보 조회에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}

export const weatherService = new WeatherService(); 