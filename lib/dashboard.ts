export const listening = [
  { artist: "Nils Frahm", note: "Solo" },
  { artist: "Caroline Polachek", note: "Desire, I Want to Turn Into You" },
  { artist: "Tim Hecker", note: "Ravedeath, 1972" },
  { artist: "Jon Hopkins", note: "Music for Psychedelic Therapy" },
  { artist: "Floating Points", note: "Crush" },
  { artist: "Arvo Pärt", note: "Tabula Rasa" },
  { artist: "Steve Reich", note: "Music for 18 Musicians" },
];

export const principles: { group: string; text: string }[] = [
  // Leadership & influence (now includes the previous Focus items at the end)
  { group: "Leadership & influence", text: "you're responsible for the room" },
  { group: "Leadership & influence", text: "influence over authority" },
  {
    group: "Leadership & influence",
    text: "alignment and direction beats speed and grind",
  },
  { group: "Leadership & influence", text: "listen more than you speak" },
  { group: "Leadership & influence", text: "give context, not just feedback" },
  {
    group: "Leadership & influence",
    text: "people remember how you make them feel",
  },
  { group: "Leadership & influence", text: "protect people's time" },
  { group: "Leadership & influence", text: "create space for deep work" },
  // Communication & trust
  { group: "Communication & trust", text: "clarity over urgency" },
  { group: "Communication & trust", text: "questions above statements" },
  { group: "Communication & trust", text: "show up on time" },
  { group: "Communication & trust", text: "do what you say you will" },
  // Craft
  {
    group: "Craft",
    text: "design skill is a muscle, it needs constant stimuli",
  },
  { group: "Craft", text: "systems over solutions" },
  { group: "Craft", text: "ship at scale" },
  // Mindset (closes the list with the new principle as #20)
  { group: "Mindset", text: "work harder than you think you should" },
  {
    group: "Mindset",
    text: "surround yourself with people who are better than you are",
  },
  { group: "Mindset", text: "it's a marathon, not a sprint" },
  { group: "Mindset", text: "consistency breeds excellence" },
  { group: "Mindset", text: "think in loops, not lines" },
];

export const reading = [
  {
    title: "The Staff Designer",
    author: "Catt Small",
    note: "Re-reading",
    isActive: true,
  },
  {
    title: "The Coming Wave",
    author: "Mustafa Suleyman",
    note: "Finished",
  },
  {
    title: "21 Lessons for the 21st Century",
    author: "Yuval Noah Harari",
    note: "Finished",
  },
  {
    title: "The Burgundians: A Vanished Empire",
    author: "Bart Van Loo",
    note: "Finished",
  },
  {
    title:
      "John of Brienne: King of Jerusalem, Emperor of Constantinople",
    author: "Guy Perry",
    note: "Finished",
  },
];

export const watching = [
  { title: "Perfect Days", year: 2023, rating: "★★★★½" },
  { title: "The Zone of Interest", year: 2023, rating: "★★★★" },
  { title: "Past Lives", year: 2023, rating: "★★★★" },
  { title: "Aftersun", year: 2022, rating: "★★★★½" },
];

export const recentPosts = [
  {
    body: "A design system that needs three meetings to add a token has stopped being a system. It's now a process.",
    date: "2026-04-28",
  },
  {
    body: "Mentorship at scale is mostly two questions: what's the actual constraint, and what would you do if you trusted yourself?",
    date: "2026-04-21",
  },
  {
    body: "Most teams don't have a craft problem. They have a deciding-what-to-build problem dressed up as a craft problem.",
    date: "2026-04-14",
  },
];

export const photos = [
  { caption: "Sierra de Grazalema, after the storm" },
  { caption: "Studio, late evening" },
  { caption: "Cádiz coast" },
  { caption: "A wall in Sevilla I keep coming back to" },
  { caption: "Notebook in motion" },
];

export const mentorship = {
  platform: "ADPList",
  sessionsCompleted: "320+",
  rating: "4.99",
  bookHref: "https://adplist.org/mentors/andrzej-delgado",
  reviewsHref: "https://adplist.org/mentors/andrzej-delgado#reviews",
  community: {
    totalMentoringMinutes: 5580,
    sessionsCompleted: 84,
    averageAttendance: 100,
  },
};

export const live = {
  isLive: true,
  headline: "Latest Projects",
  blurb:
    "Concepts I've enjoyed developing into real, functional outcomes",
  projects: [
    {
      key: "atlas",
      name: "Project Atlas",
      cta: "This site, in the open",
      href: "/",
      tint: "260 80% 65%",
    },
    {
      key: "mentorship",
      name: "Mentorship at Scale",
      cta: "Framework in progress",
      href: "/reviews",
      tint: "150 65% 50%",
    },
    {
      key: "ui-crux",
      name: "UI Crux series",
      cta: "Writing the next chapter",
      href: "https://medium.com/@andrzej.delgado",
      tint: "30 90% 60%",
    },
    {
      key: "tokens",
      name: "Token taxonomy v2",
      cta: "Three-layer system, evolving",
      href: "/case-studies/tokens-that-travel",
      tint: "210 85% 60%",
    },
  ],
  events: [
    {
      flag: "🇵🇱",
      title: "Google × SGH AI Training: Skills for Tomorrow",
      description:
        "Google's free training program developing AI and digital skills for professionals.",
      iso: "2026-06-15T10:00:00+02:00",
      href: "https://rsvp.withgoogle.com/events/umiejetnoscijutra/strona-glowna-30",
    },
    {
      flag: "🇵🇱",
      title: "Product Hive 2026",
      description:
        "Two-day Warsaw conference — keynotes, panels, workshops, and barcamps on product strategy, AI integration, and leadership.",
      iso: "2026-03-18T08:30:00+01:00",
      href: "https://producthive.pl/schedule/",
    },
    {
      flag: "🌐",
      title: "Into Design Systems Hackathon 2026",
      description:
        "Free 3-day virtual hackathon — 150 design-system makers worldwide build tools, plugins, and workflows with AI and design automation.",
      iso: "2026-02-06T19:00:00+01:00",
      href: "https://www.intodesignsystems.com/hackathon",
    },
    {
      flag: "🌐",
      title: "NASA Space Apps Challenge 2026",
      description:
        "NASA's annual global hackathon — teams across 190+ countries spend a weekend addressing real-world challenges with open NASA data.",
      iso: "2026-10-03T09:00:00+00:00",
      href: "https://www.spaceappschallenge.org",
    },
  ],
};
