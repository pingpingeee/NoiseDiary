import api from './api';

// default export로 변경
const diaryService = {
  // 최근 일기 가져오기
  async getRecentDiaries(limit = 3) {
    try {
      const response = await api.get(`/diary/recent?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error("❌ Error fetching recent diaries:", error)
      throw error
    }
  },

  // 특정 날짜의 일기 가져오기
  async getDiaryByDate(date) {
    try {
      const response = await api.get(`/diary/date/${date}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null // 해당 날짜에 일기가 없음
      }
      console.error("❌ Error fetching diary by date:", error)
      throw error
    }
  },

  // 일기 작성
  async createDiary(diaryData) {
    try {
      const response = await api.post("/diary", diaryData)
      return response.data
    } catch (error) {
      console.error("❌ Error creating diary:", error)
      throw error
    }
  },

  // 일기 상세 조회
  async getDiary(diaryNo) {
    try {
      const response = await api.get(`/diary/${diaryNo}`)
      return response.data
    } catch (error) {
      console.error("❌ Error fetching diary:", error)
      throw error
    }
  },
}

export default diaryService
