export type Review = {
  date: string;
  quote: string;
  tags: string[];
  author: {
    name: string;
    flag: string;
    role: string;
    company: string;
    image: string;
  };
};

export const ratingDimensions = [
  { key: "communication", label: "Communication", value: 100 },
  { key: "motivational", label: "Motivational", value: 100 },
  { key: "problem-solving", label: "Problem Solving", value: 100 },
  { key: "subject-knowledge", label: "Subject Knowledge", value: 100 },
] as const;

export const commonTraits = [
  "Analytical",
  "Positive attitude",
  "Constructive",
  "Tactful",
  "Detail-oriented",
  "Mindful",
  "Transparent",
  "Trustworthy",
  "Approachable",
  "Insightful",
  "Honest",
  "Clear",
  "Encouraging",
  "Professional",
  "Resourceful",
];

export const reviews: Review[] = [
  {
    date: "2026-02-17",
    quote:
      "He had a lot of ideas and new insights for me to improve my application game, also getting his point of view on my material was really helpful. Thanks a lot for the session!",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
      "Positive attitude",
      "Constructive",
      "Transparent",
    ],
    author: {
      name: "Marie",
      flag: "🇪🇸",
      role: "UX Design Lead",
      company: "Porsche AG",
      image: "/images/mentees/marie.webp",
    },
  },
  {
    date: "2024-12-16",
    quote:
      "I had an insightful session with Andrzej, where he took the time to thoroughly understand my challenges and provided detailed, constructive feedback on my presentation along with actionable advice. His attention to detail, including spotting spelling errors, is remarkable! Andrzej's ability to mentor and guide is truly exceptional. Thanks so much!",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
      "Constructive",
      "Encouraging",
      "Detail-oriented",
    ],
    author: {
      name: "Leah Buragiewicz",
      flag: "🇪🇸",
      role: "Sr. Product Designer",
      company: "Withings / 8fit / idagio / SoundCloud",
      image: "/images/mentees/leah.webp",
    },
  },
  {
    date: "2024-11-27",
    quote:
      "Had an amazing time with Andrzej! I can confidently say it was one of the best ADP sessions I had. He outlined very well my problem and possible solutions, gave great tips and was so encouraging. Keep it up, Andrzej!",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Mindful",
      "Encouraging",
      "Professional",
      "Resourceful",
      "Trustworthy",
    ],
    author: {
      name: "Nacho Peñalver",
      flag: "🇪🇸",
      role: "Product Designer and Manager",
      company: "Voice123",
      image: "/images/mentees/nacho.webp",
    },
  },
  {
    date: "2024-08-05",
    quote:
      "Very insightful, great mentoring session. I was doubtful about my transition towards UX/UI and he answered everything nicely and broadly. Extremely helpful and a great listener.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Positive attitude",
      "Tactful",
      "Trustworthy",
      "Encouraging",
      "Resourceful",
    ],
    author: {
      name: "Marina Aizen",
      flag: "🇪🇸",
      role: "Illustrator",
      company: "Freelance",
      image: "/images/mentees/marina.webp",
    },
  },
  {
    date: "2024-05-18",
    quote:
      "Andrzej is a person of great knowledge. Explained as well as hinted about the elements to work on. For me, who is just starting to take first steps in the industry, it was very valuable knowledge. Andrzej listened to me in depth, was attentive to what I was talking about. Commitment and professionalism. Thank you again.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Detail-oriented",
      "Transparent",
      "Clear",
      "Professional",
    ],
    author: {
      name: "Viktoria Starykevich",
      flag: "🇵🇱",
      role: "B2B",
      company: "SaaS",
      image: "/images/mentees/Viktoria.webp",
    },
  },
  {
    date: "2024-03-25",
    quote:
      "Andrzej is a natural teacher/mentor. He delivered a really comprehensive set of 8 sessions to support me in a senior role transition into a product design team. He is highly knowledgeable and very clear in his communication style, all questions were answered thoroughly and he provided loads of support material to supplement the sessions.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
      "Detail-oriented",
      "Transparent",
      "Insightful",
    ],
    author: {
      name: "Fiona Dungay",
      flag: "🇬🇧",
      role: "Senior Designer",
      company: "The Workshop",
      image: "/images/mentees/FIona.jpeg",
    },
  },
  {
    date: "2024-02-20",
    quote:
      "I am a product designer and I have recently started learning to code but was unsure about how these interact in the real world. My call with Andrzej was really worthwhile. He was prepared and his expertise gave me a much clearer view of how these two fields interact and how he sees the future. He was also really encouraging, approachable, and honest.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
      "Positive attitude",
      "Constructive",
      "Insightful",
      "Encouraging",
    ],
    author: {
      name: "Joe Watson",
      flag: "🇪🇸",
      role: "Product Designer",
      company: "Freelance",
      image: "/images/mentees/joe.webp",
    },
  },
  {
    date: "2024-02-14",
    quote:
      "Andrzej was right on the spot asking and answering the right questions in order to narrow down some doubts around career path and professional growth. Good listener and also great advisor. Definitely worth the time spent.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Positive attitude",
      "Constructive",
      "Approachable",
      "Insightful",
      "Honest",
    ],
    author: {
      name: "Miguel Ángel Baixauli Moreno",
      flag: "🇪🇸",
      role: "Freelance Graphic Designer",
      company: "Yotpo",
      image: "/images/mentees/Miguel.avif",
    },
  },
  {
    date: "2023-12-25",
    quote:
      "Andrzej is truly a pleasure to talk to. I had a list of questions ready, and we effortlessly went through all of them in a relaxed and conversational fashion. I really appreciate his insights and openness.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Positive attitude",
      "Transparent",
      "Trustworthy",
      "Insightful",
      "Professional",
    ],
    author: {
      name: "Yolanda Santa Cruz",
      flag: "🇺🇸",
      role: "Senior Product Designer",
      company: "Upside",
      image: "/images/mentees/Yolanda.webp",
    },
  },
  {
    date: "2023-12-05",
    quote:
      "The session with Andrzej has been great. He has a clear understanding of the industry and offered detailed and actionable advice. He communicated everything clearly and understandably.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
      "Detail-oriented",
      "Approachable",
      "Clear",
      "Resourceful",
    ],
    author: {
      name: "Fabio Di Cecca",
      flag: "🇩🇪",
      role: "Product Designer",
      company: "Tourlane",
      image: "/images/mentees/Fabio.webp",
    },
  },
  {
    date: "2023-11-08",
    quote:
      "I had a great mentoring session with Andrzej. I was able to ask all my questions and received guidance, clear answers, and motivation. It helped open my perspective.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
    ],
    author: {
      name: "Paula",
      flag: "🇳🇿",
      role: "UX Designer",
      company: "Uneeq",
      image: "/images/mentees/Paula.jpg",
    },
  },
  {
    date: "2023-09-09",
    quote:
      "Andrzej is very friendly and knowledgeable. His tips are unique and supported with compelling stories and resources. He asked the right questions and helped me clarify my career direction.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Constructive",
      "Approachable",
      "Insightful",
      "Encouraging",
      "Resourceful",
    ],
    author: {
      name: "Marzena Bałos",
      flag: "🇵🇱",
      role: "Aspiring UX/UI Designer",
      company: "AGH University of Science and Technology",
      image: "/images/mentees/Marzena.webp",
    },
  },
  {
    date: "2023-06-01",
    quote:
      "This session was one of the most mind-blowing sessions I've ever attended. His thought process and insights about job negotiation were amazing.",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Analytical",
      "Positive attitude",
      "Tactful",
      "Detail-oriented",
      "Insightful",
    ],
    author: {
      name: "Mohan V",
      flag: "🇮🇳",
      role: "Product Designer",
      company: "Dailyhunt",
      image: "/images/mentees/Mohan.webp",
    },
  },
  {
    date: "2023-05-29",
    quote: "It was a great session with Andrzej. Got valuable insights. Thank you!",
    tags: [
      "Technically competent",
      "Very motivational",
      "Amazing communicator",
      "Amazing problem solver",
      "Positive attitude",
      "Constructive",
      "Detail-oriented",
    ],
    author: {
      name: "Al Farabi Khan Rafi",
      flag: "🇧🇩",
      role: "Product Designer",
      company: "weDevs",
      image: "/images/mentees/Al.webp",
    },
  },
];
