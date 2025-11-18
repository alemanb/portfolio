export const portfolioData = {
  profile: {
    name: "Benjamin Aleman",
    title: "AI Automation Engineer & Full-Stack Developer",
    location: "College Station, TX",
    email: "benjaminaleman04@gmail.com",
    github: "https://github.com/alemanb",
    linkedin: "https://www.linkedin.com/in/benjamin-aleman-977854229/",
    image: "/profile.jpg", // Add your image to public folder
  },

  about: {
    description: `I'm a Computer Science student at Texas A&M University with a passion for building intelligent automation systems and crafting delightful web experiences. When I'm not architecting APIs or training multi-agent AI systems, you'll find me tinkering with music tech or exploring the intersection of code and creativity. Currently riding the wave of AI innovation while keeping one foot firmly planted in solid software engineering fundamentals.`,
    highlights: [
      "AI automation and multi-agent systems",
      "Full-stack development with React and FastAPI",
      "Cloud infrastructure and RESTful API design",
      "Building things that actually make life easier"
    ]
  },

  projects: [
    {
      title: "AI-Powered Teaching IDE",
      description: "A full-stack online code editor with a multi-agent AI system that generates context-aware code and explains concepts in real-time. Features secure cloud-based execution and streaming APIs for a smooth learning experience.",
      technologies: ["React", "TypeScript", "Python", "FastAPI", "Agno", "E2B", "Supabase", "Tailwind"],
      link: "https://github.com/alemanb",
      image: "/project1.jpg"
    },
    {
      title: "DummyStocks",
      description: "An interactive financial literacy platform that combines dynamic data visualization with AI-powered article simplification. Makes stock market trends and financial news actually understandable.",
      technologies: ["TypeScript", "React", "Python", "Flask", "OpenAI", "pandas"],
      link: "https://github.com/alemanb",
      image: "/project2.jpg"
    },
    {
      title: "CV-Theremin",
      description: "A music application that turns hand gestures into sound waves. Uses OpenCV for real-time hand tracking and JUCE to generate dynamic sine waves with pitch and velocity controlled by hand motion.",
      technologies: ["C++", "JUCE", "OpenCV"],
      link: "https://github.com/alemanb",
      image: "/project3.jpg"
    }
  ],

  experience: [
    {
      role: "AI Automation Engineer Intern",
      company: "jov.ai",
      period: "Summer 2025",
      description: "Crafted intelligent automation workflows that actually save people time. Worked across marketing, manufacturing, and consulting clients to build RESTful APIs, custom MCP servers, and multi-agent AI systems. Turned complex business processes into smooth, automated workflows using Python, FastAPI, and modern AI frameworks.",
      achievements: [
        "Built custom MCP servers and integrated AI automation to boost workflow efficiency",
        "Architected RESTful APIs and backend services for seamless system integrations",
        "Implemented RAG systems with ChromaDB and Pinecone for smarter AI responses",
        "Deployed multi-agent systems using Langchain and Agno frameworks"
      ]
    },
  ],

  skills: {
    languages: ["Python", "TypeScript", "JavaScript", "C++", "Java", "HTML/CSS"],
    frameworks: ["React", "FastAPI", "Flask", "Tailwind", "Langchain", "Agno"],
    tools: ["Git", "Docker", "AWS", "Supabase", "VS Code", "E2B"],
    ai: ["Multi-agent systems", "RAG implementations", "MCP", "ChromaDB", "Pinecone"],
    concepts: ["RESTful API design", "Cloud architecture", "AI automation", "Agentic AI"]
  }
}
