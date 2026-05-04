import axiosInstance from "./axiosInstance";

// Facade: clean API functions hiding axios complexity

export const fetchIdeas = async () => {
  try {
    const response = await axiosInstance.get("/idea/");
    return response.data;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return { success: false, projects: [] };
  }
};

export const fetchIdeaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/idea/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching idea:", error);
    return { success: false };
  }
};

export const fetchLessons = async () => {
  try {
    const response = await axiosInstance.get("/lesson/viewAllLessonPlans");
    return response.data;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return { success: false, lessonPlans: [] };
  }
};

export const fetchLessonById = async (id) => {
  try {
    const response = await axiosInstance.get(`/lesson/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return { success: false };
  }
};
