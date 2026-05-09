import { Request, Response } from "express";

import { findCompanySources } from "../services/sourceFinder.service";

export const testResearch = async (req: Request, res: Response) => {
  try {
    const { companyName, role } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({
        success: false,
        message: "companyName and role are required",
      });
    }

    const sources = await findCompanySources({
      companyName,
      role,
    });

    return res.status(200).json({
      success: true,
      count: sources.length,
      data: sources,
    });
  } catch (error) {
    console.error("Research Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to find company sources",
    });
  }
};
