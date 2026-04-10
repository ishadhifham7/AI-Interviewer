server/
├── src/
│ ├── app.ts # Entry point: express app + middleware
│ ├── server.ts # Server bootstrap: listen on port
│ ├── config/
│ │ └── firestore.ts # Firestore DB connection & config
│ │ └── env.ts # Environment variables & constants
│ ├── modules/
│ │ ├── cv/ # CV Module
│ │ │ ├── controllers/
│ │ │ │ └── cvController.ts
│ │ │ ├── services/
│ │ │ │ ├── cvService.ts
│ │ │ │ └── aiCvStructuring.ts
│ │ │ ├── repositories/
│ │ │ │ └── cvRepository.ts
│ │ │ ├── utils/
│ │ │ │ └── extractText.ts
│ │ │ ├── types/
│ │ │ │ └── cvTypes.ts
│ │ │ └── routes/
│ │ │ └── cvRoutes.ts
│ │ └── shared/
│ │ ├── aiClient/
│ │ │ ├── aiClient.ts # Shared AI client for Gemini 2.1 / LLaMA
│ │ │ ├── prompts/
│ │ │ │ ├── cvPrompt.ts
│ │ │ │ └── interviewPrompt.ts # Placeholder for future
│ │ │ └── types/
│ │ │ └── aiTypes.ts
│ │ └── utils/
│ │ └── logger.ts # Optional: centralized logging
│ ├── middlewares/
│ │ ├── errorHandler.ts
│ │ └── fileUpload.ts # Multer or equivalent for CV upload
│ ├── routes/
│ │ └── index.ts # Root router: attach all module routers
│ └── types/
│ └── global.d.ts # Global types / shared interfaces
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
