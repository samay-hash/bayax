import { Request, Response } from "express";
import { IdeaService } from "../services/IdeaService";

export class IdeaController {
  private readonly ideaService: IdeaService;

  constructor() {
    this.ideaService = new IdeaService();
  }

  // POST /analyze — Generate a new idea analysis
  public analyzeIdea = async (req: Request, res: Response): Promise<void> => {
    try {
      const { field, intent, content, techStack } = req.body;
      const creatorId = (req as any).userId;

      const analysisData = await this.ideaService.performAnalysis({
        field,
        intent,
        content,
        techStack,
        creatorId,
      });

      await this.ideaService.storeProject(
        { field, intent, content, techStack, creatorId },
        analysisData
      );

      res.status(200).json({ success: true, data: analysisData });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "AI Analysis Failed",
        error: error.message,
      });
    }
  };

  // GET / — Fetch all ideas for the authenticated user
  public viewAllProjects = async (req: Request, res: Response): Promise<void> => {
    const creatorId = (req as any).userId;
    try {
      const projects = await this.ideaService.getProjects(creatorId);
      res.status(200).json({ success: true, projects });
    } catch (error: any) {
      res.status(500).json({ success: false, message: `Error fetching projects: ${error.message}` });
    }
  };

  // GET /:id — Fetch a single idea with full analysis data
  public viewProject = async (req: Request, res: Response): Promise<void> => {
    const creatorId = (req as any).userId;
    const id = req.params.id as string;
    try {
      const project = await this.ideaService.getProjectById(id, creatorId);
      if (!project) {
        res.status(404).json({ success: false, message: "Project not found" });
        return;
      }
      res.status(200).json({ success: true, project });
    } catch (error: any) {
      res.status(500).json({ success: false, message: `Error fetching project: ${error.message}` });
    }
  };
}
