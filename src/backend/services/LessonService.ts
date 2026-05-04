import { AIEngine } from "./AIEngine";
import { LessonPlanModel } from "../model/lesson.model";
import { lessonPlanPrompt } from "../utils/prompts";

interface LessonInput {
  subject: string;
  topic: string;
  grade: number;
  duration: number;
  creatorId: string;
}

export class LessonService {
  private readonly aiEngine: AIEngine;

  constructor() {
    this.aiEngine = AIEngine.getInstance();
  }

  async generateContent(data: LessonInput): Promise<object> {
    const { subject, topic, grade, duration } = data;
    const prompt = lessonPlanPrompt({ subject, topic, grade, duration });
    const lessonData = await this.aiEngine.execute(prompt);
    return lessonData;
  }

  // Now accepts and persists the full AI-generated lessonData JSON
  async storePlan(data: LessonInput, lessonData: object): Promise<void> {
    const { subject, topic, grade, duration, creatorId } = data;
    await LessonPlanModel.create({ subject, topic, grade, duration, creatorId, lessonData });
  }

  // Repository: fetch all plans for a user (metadata only for list view)
  async getPlans(creatorId: string) {
    return LessonPlanModel.find({ creatorId })
      .select("subject topic grade duration createdAt")
      .sort({ createdAt: -1 });
  }

  // Repository: fetch single plan with full lessonData for detail view
  async getPlanById(id: string, creatorId: string) {
    return LessonPlanModel.findOne({ _id: id, creatorId });
  }
}
