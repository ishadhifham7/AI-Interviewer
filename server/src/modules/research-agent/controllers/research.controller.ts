import { Request, Response } from "express";

import { findCompanySources } from "../services/sourceFinder.service";
import { retrieveCompanyContent } from "../services/contentRetriever.service";

export const testResearch = async (req: Request, res: Response) => {
  try {
    const { companyName, role } = req.body;

    // Validation
    if (!companyName || !role) {
      return res.status(400).json({
        success: false,
        message: "companyName and role are required",
      });
    }

    // STEP 1 → Find relevant company URLs
    const sources = await findCompanySources({
      companyName,
      role,
    });

    // Safety check
    if (!sources.length) {
      return res.status(404).json({
        success: false,
        message: "No relevant company sources found",
      });
    }

    // STEP 2 → Retrieve webpage content
    const content = await retrieveCompanyContent(sources);

    return res.status(200).json({
      success: true,
      sourceCount: sources.length,
      contentCount: content.length,
      data: content,
    });
  } catch (error) {
    console.error("Research Pipeline Error:", error);

    return res.status(500).json({
      success: false,
      message: "Research pipeline failed",
    });
  }
};
