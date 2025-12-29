export interface Task {
  id: string;
  text: string;
  schedule?: string;
  link?: string;
  linkText?: string;
}

export interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  month: string;
  year: number;
  phase: string;
  focus: string;
  japanese: Task[];
  aiml: Task[];
  college: Task[];
  goals: Task[];
  resources?: { title: string; url: string }[];
  milestone?: string;
}

// Helper to generate dates
const getWeekDates = (weekNum: number) => {
  const startDate = new Date(2024, 11, 1); // Dec 1, 2024
  startDate.setDate(startDate.getDate() + (weekNum - 1) * 7);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  return {
    startDate: `${startDate.getDate()} ${months[startDate.getMonth()]}`,
    endDate: `${endDate.getDate()} ${months[endDate.getMonth()]}`,
    month: months[startDate.getMonth()],
    year: startDate.getFullYear()
  };
};

// Generate all 175+ weeks
export const generateWeeklyData = (): WeekData[] => {
  const weeks: WeekData[] = [];
  
  // December 2024 (Weeks 1-4) - Foundations
  for (let w = 1; w <= 4; w++) {
    const dates = getWeekDates(w);
    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Foundations",
      focus: "Math Bootcamp + Hiragana/Katakana",
      japanese: [
        { id: `w${w}-jp-1`, text: "Anki review (15 min/day)", schedule: "Daily", link: "https://apps.ankiweb.net/", linkText: "Anki" },
        { id: `w${w}-jp-2`, text: "Hiragana practice (20 min/day)", schedule: "Daily", link: "https://www.tofugu.com/japanese/learn-hiragana/", linkText: "Tofugu" },
        { id: `w${w}-jp-3`, text: "Duolingo Japanese (15 min/day)", schedule: "Daily", link: "https://www.duolingo.com/course/ja/en/Learn-Japanese", linkText: "Duolingo" },
        { id: `w${w}-jp-4`, text: "Master 5 new Hiragana characters per day" },
        { id: `w${w}-jp-5`, text: "Writing practice sheets", schedule: "Weekends" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: "3Blue1Brown Linear Algebra", schedule: "Mon/Wed/Fri/Sun", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", linkText: "YouTube" },
        { id: `w${w}-ai-2`, text: "Khan Academy Math practice (30 min)", schedule: "Tue/Thu/Sat", link: "https://www.khanacademy.org/math/linear-algebra", linkText: "Khan Academy" },
        { id: `w${w}-ai-3`, text: "Python basics tutorial (30 min)", schedule: "Tue/Thu/Sat", link: "https://www.python.org/about/gettingstarted/", linkText: "Python.org" },
        { id: `w${w}-ai-4`, text: "Write 1 simple Python program", schedule: "Weekend" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "Attend college (3 days)", schedule: "Mon/Wed/Fri" },
        { id: `w${w}-col-2`, text: "Complete all assignments on time" },
        { id: `w${w}-col-3`, text: "Review lecture notes after each class" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: "Learn 25 Hiragana characters" },
        { id: `w${w}-goal-2`, text: "Understand vectors and matrices" },
        { id: `w${w}-goal-3`, text: "Setup: Install Anki, Duolingo, Python (Anaconda)" },
        { id: `w${w}-goal-4`, text: "Write first Python program (Hello World + Calculator)" },
      ],
    });
  }

  // January 2025 (Weeks 5-8) - Foundations
  for (let w = 5; w <= 8; w++) {
    const dates = getWeekDates(w);
    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Foundations",
      focus: "Python Basics + Japanese Grammar Basics",
      japanese: [
        { id: `w${w}-jp-1`, text: "Anki review (15 min/day)", schedule: "Daily", link: "https://apps.ankiweb.net/", linkText: "Anki" },
        { id: `w${w}-jp-2`, text: "Genki I Lesson study (25 min)", schedule: "Mon/Wed/Fri/Sun", linkText: "Genki I" },
        { id: `w${w}-jp-3`, text: "Duolingo (15 min/day)", schedule: "Daily", link: "https://www.duolingo.com/", linkText: "Duolingo" },
        { id: `w${w}-jp-4`, text: "Grammar exercises from Genki I", schedule: "Sat/Sun" },
        { id: `w${w}-jp-5`, text: "Learn 50 new vocabulary words", schedule: "Weekly" },
        { id: `w${w}-jp-6`, text: "Practice writing Katakana", schedule: "Daily 10 min" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: "Python for Data Science course (45 min)", schedule: "Tue/Thu/Sat", link: "https://www.coursera.org/learn/python-for-applied-data-science-ai", linkText: "Coursera" },
        { id: `w${w}-ai-2`, text: "LeetCode Easy problems (2 per day)", schedule: "Mon/Wed/Fri", link: "https://leetcode.com/problemset/all/", linkText: "LeetCode" },
        { id: `w${w}-ai-3`, text: "Calculus review videos (30 min)", schedule: "Tue/Thu/Sun", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", linkText: "3Blue1Brown" },
        { id: `w${w}-ai-4`, text: "Build 1 small Python project", schedule: "Weekend" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "College attendance (3 days)", schedule: "Mon/Wed/Fri" },
        { id: `w${w}-col-2`, text: "Study for semester exams (1 hour daily)" },
        { id: `w${w}-col-3`, text: "Complete assignments before deadline" },
        { id: `w${w}-col-4`, text: "Group project work", schedule: "Tue/Thu evenings" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: "Complete Genki I Lessons 1-2" },
        { id: `w${w}-goal-2`, text: "Master Python control flow and functions" },
        { id: `w${w}-goal-3`, text: "Reach 200 vocabulary words total" },
        { id: `w${w}-goal-4`, text: "Solve 50 LeetCode Easy problems total" },
      ],
      resources: [
        { title: "Tae Kim's Grammar Guide", url: "http://www.guidetojapanese.org/learn/grammar" },
        { title: "Python Documentation", url: "https://docs.python.org/3/tutorial/" },
      ],
    });
  }

  // February 2025 (Weeks 9-12)
  for (let w = 9; w <= 12; w++) {
    const dates = getWeekDates(w);
    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Foundations",
      focus: "ML Introduction + Japanese Vocabulary Building",
      japanese: [
        { id: `w${w}-jp-1`, text: "Anki review (20 min/day)", schedule: "Daily - NEVER SKIP" },
        { id: `w${w}-jp-2`, text: "Genki I study (30 min)", schedule: "Mon/Wed/Fri/Sat" },
        { id: `w${w}-jp-3`, text: "Duolingo maintain streak", schedule: "Daily 15 min" },
        { id: `w${w}-jp-4`, text: "JapanesePod101 listening (15 min)", schedule: "Tue/Thu/Sun", link: "https://www.japanesepod101.com/", linkText: "JapanesePod101" },
        { id: `w${w}-jp-5`, text: "Complete 1 Genki lesson per week" },
        { id: `w${w}-jp-6`, text: "Watch anime with Japanese subtitles (20 min)", schedule: "Daily" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: "Google ML Crash Course (1 hour)", schedule: "Tue/Thu/Sat", link: "https://developers.google.com/machine-learning/crash-course", linkText: "Google ML" },
        { id: `w${w}-ai-2`, text: "Probability & Statistics videos (30 min)", schedule: "Mon/Wed/Fri", link: "https://www.youtube.com/c/joshstarmer", linkText: "StatQuest" },
        { id: `w${w}-ai-3`, text: "Python practice problems", schedule: "Daily 20 min" },
        { id: `w${w}-ai-4`, text: "First ML project: Linear Regression", schedule: "Weekend", link: "https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols.html", linkText: "Tutorial" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "Maintain 8.0+ GPA (priority)" },
        { id: `w${w}-col-2`, text: "Active class participation", schedule: "College days" },
        { id: `w${w}-col-3`, text: "Complete all assignments early" },
        { id: `w${w}-col-4`, text: "Mid-semester exam preparation" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: "Reach 450 vocabulary words total" },
        { id: `w${w}-goal-2`, text: "Understand ML fundamentals (supervised/unsupervised)" },
        { id: `w${w}-goal-3`, text: "Build working Linear Regression model" },
        { id: `w${w}-goal-4`, text: "Complete Genki I Lessons 3-6" },
      ],
    });
  }

  // March-May 2025 (Weeks 13-24)
  for (let w = 13; w <= 24; w++) {
    const dates = getWeekDates(w);
    const month = dates.month;
    let focus = "";
    let milestone = "";
    
    if (w <= 16) focus = "NumPy/Pandas + Genki I Progress";
    else if (w <= 20) focus = "Andrew Ng ML Course + Genki I";
    else {
      focus = "ML Projects + Complete Genki I";
      if (w === 24) milestone = "Foundation Phase Complete!";
    }
    
    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Foundations",
      focus,
      milestone,
      japanese: [
        { id: `w${w}-jp-1`, text: "Anki review (20 min/day)", schedule: "Daily" },
        { id: `w${w}-jp-2`, text: w <= 20 ? "Genki I study (35 min)" : "Complete Genki I / Start Genki II", schedule: "Mon/Wed/Fri/Sat" },
        { id: `w${w}-jp-3`, text: "Duolingo", schedule: "Daily 15 min" },
        { id: `w${w}-jp-4`, text: "Japanese immersion (anime/YouTube)", schedule: "Daily 30 min" },
        { id: `w${w}-jp-5`, text: w >= 21 ? "Register for JLPT N5 (July exam)" : "Conversation practice on HelloTalk", link: w >= 21 ? "https://www.jlpt.jp/e/" : "https://www.hellotalk.com/", linkText: w >= 21 ? "JLPT" : "HelloTalk" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: `Andrew Ng ML Course Week ${Math.min(Math.floor((w-13)/2)+1, 8)}`, schedule: "Tue/Thu/Sat", link: "https://www.coursera.org/learn/machine-learning", linkText: "Coursera" },
        { id: `w${w}-ai-2`, text: w <= 16 ? "NumPy/Pandas tutorials" : "Data visualization: Matplotlib + Seaborn", schedule: "Mon/Wed/Fri", link: w <= 16 ? "https://numpy.org/doc/stable/user/quickstart.html" : "https://matplotlib.org/stable/tutorials/index.html", linkText: w <= 16 ? "NumPy" : "Matplotlib" },
        { id: `w${w}-ai-3`, text: "Build ML project", schedule: "Weekend" },
        { id: `w${w}-ai-4`, text: "GitHub: Upload projects with proper README", link: "https://github.com/", linkText: "GitHub" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "College", schedule: "Mon/Wed/Fri" },
        { id: `w${w}-col-2`, text: w >= 21 ? "Final exams - Give 100%" : "Semester project work" },
        { id: `w${w}-col-3`, text: "Aim for 8.5+ GPA this semester" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: `${600 + (w-13) * 50} vocabulary words target` },
        { id: `w${w}-goal-2`, text: w >= 21 ? "Complete Andrew Ng ML Course" : "Andrew Ng course progress" },
        { id: `w${w}-goal-3`, text: `${2 + Math.floor((w-13)/4)} ML projects on GitHub` },
      ],
    });
  }

  // June-July 2025 Summer Break (Weeks 25-32) - Core Building
  for (let w = 25; w <= 32; w++) {
    const dates = getWeekDates(w);
    const isJuly = w >= 29;
    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Core Building",
      focus: isJuly ? "Deep Learning Projects + JLPT N5 Exam" : "Deep Learning + JLPT N5 Prep",
      milestone: isJuly && w === 32 ? "First JLPT certificate!" : undefined,
      japanese: [
        { id: `w${w}-jp-1`, text: "Anki review (20 min/day)", schedule: "Daily - NO EXCEPTIONS" },
        { id: `w${w}-jp-2`, text: "Genki II intensive study (1 hour)", schedule: "Daily" },
        { id: `w${w}-jp-3`, text: "Duolingo (20 min/day)", schedule: "Daily" },
        { id: `w${w}-jp-4`, text: "Listening practice (30 min)", schedule: "Daily", link: "https://www.nhk.or.jp/lesson/", linkText: "NHK" },
        { id: `w${w}-jp-5`, text: isJuly ? "TAKE JLPT N5 EXAM - Early July" : "JLPT N5 practice tests", link: "https://jlptsensei.com/jlpt-n5-practice-tests/", linkText: "JLPT Practice" },
        { id: `w${w}-jp-6`, text: "HelloTalk language exchange", schedule: "3x per week", link: "https://www.hellotalk.com/", linkText: "HelloTalk" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: `fast.ai Practical Deep Learning Lesson ${w <= 28 ? w-24 : w-26}`, schedule: "Daily 2 hours", link: "https://course.fast.ai/", linkText: "fast.ai" },
        { id: `w${w}-ai-2`, text: isJuly ? "Build personal project: Image/Sentiment classifier" : "Build image classifier project" },
        { id: `w${w}-ai-3`, text: isJuly ? "Deploy project on Hugging Face Spaces" : "Read research papers", link: isJuly ? "https://huggingface.co/spaces" : "https://arxiv.org/list/cs.LG/recent", linkText: isJuly ? "Hugging Face" : "arXiv" },
        { id: `w${w}-ai-4`, text: "Daily GitHub contributions" },
        { id: `w${w}-ai-5`, text: isJuly ? "Kaggle competition participation" : "PyTorch tutorials", link: isJuly ? "https://www.kaggle.com/competitions" : "https://pytorch.org/tutorials/", linkText: isJuly ? "Kaggle" : "PyTorch" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "SUMMER BREAK - No classes!" },
        { id: `w${w}-col-2`, text: "Use this time for intensive learning (6-8 hours/day)" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: `fast.ai Lessons ${w <= 28 ? '1-4' : '5-7'} completed` },
        { id: `w${w}-goal-2`, text: `${1300 + (w-25) * 100} vocabulary words` },
        { id: `w${w}-goal-3`, text: isJuly ? "1 deployed Deep Learning project" : "Deep Learning project built" },
        { id: `w${w}-goal-4`, text: isJuly ? "JLPT N5 PASSED!" : "JLPT N5 practice score: 70%+" },
      ],
    });
  }

  // August-December 2025 (Weeks 33-52)
  for (let w = 33; w <= 52; w++) {
    const dates = getWeekDates(w);
    let focus = "";
    let phase = "Core Building";
    let milestone = "";

    if (w <= 36) focus = "Advanced Projects + JLPT N4 Prep";
    else if (w <= 40) focus = "Advanced ML + N4 Preparation";
    else if (w <= 44) focus = "Project Deployment + N4 Prep";
    else if (w <= 48) focus = "TOEFL + N4 Final Prep";
    else {
      focus = "JLPT N4 Exam + Year Review";
      if (w === 52) milestone = "Year 1 Complete! JLPT N4 + TOEFL achieved!";
    }

    const isTOEFLPrep = w >= 45 && w <= 48;
    const isN4Exam = w >= 49;

    weeks.push({
      weekNumber: w,
      ...dates,
      phase,
      focus,
      milestone,
      japanese: [
        { id: `w${w}-jp-1`, text: "Anki review (20 min/day)", schedule: "Daily" },
        { id: `w${w}-jp-2`, text: isN4Exam ? "Final N4 preparation / TAKE JLPT N4 EXAM" : "JLPT N4 preparation / Intermediate textbook", schedule: isN4Exam ? "Daily intensive" : "Mon-Sat" },
        { id: `w${w}-jp-3`, text: "Listening: Japanese podcasts", schedule: "Daily 30 min" },
        { id: `w${w}-jp-4`, text: w >= 41 ? "Kanji study: 300+ learned" : "NHK Easy News reading", link: w >= 41 ? "https://www.wanikani.com/" : "https://www3.nhk.or.jp/news/easy/", linkText: w >= 41 ? "WaniKani" : "NHK Easy" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: isTOEFLPrep ? "Maintain GitHub streak" : "Real-world project development", schedule: isTOEFLPrep ? "Daily" : "Mon-Sat 1.5 hours" },
        { id: `w${w}-ai-2`, text: w <= 36 ? "Create portfolio website" : "Kaggle competition", link: w <= 36 ? "https://pages.github.com/" : "https://www.kaggle.com/", linkText: w <= 36 ? "GitHub Pages" : "Kaggle" },
        { id: `w${w}-ai-3`, text: w <= 40 ? "MLOps basics: Docker" : "Portfolio polish", link: "https://docs.docker.com/get-started/", linkText: "Docker" },
        { id: `w${w}-ai-4`, text: "Blog post / Paper reading", link: "https://paperswithcode.com/", linkText: "Papers with Code" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "College", schedule: "Mon/Wed/Fri" },
        { id: `w${w}-col-2`, text: isN4Exam ? "Final exams excellence" : "Strong GPA focus" },
        { id: `w${w}-col-3`, text: "All assignments on time" },
      ],
      goals: isTOEFLPrep ? [
        { id: `w${w}-goal-1`, text: "TOEFL prep course - Daily 1 hour", link: "https://www.ets.org/toefl/test-takers/ibt/prepare.html", linkText: "ETS TOEFL" },
        { id: `w${w}-goal-2`, text: "TOEFL Reading + Listening practice (75 min/day)" },
        { id: `w${w}-goal-3`, text: "TOEFL Speaking + Writing practice (60 min/day)" },
        { id: `w${w}-goal-4`, text: "Full practice test every weekend" },
        { id: `w${w}-goal-5`, text: "Target score: 90-100+" },
      ] : [
        { id: `w${w}-goal-1`, text: `${2200 + (w-33) * 30} vocabulary words` },
        { id: `w${w}-goal-2`, text: isN4Exam ? "JLPT N4 PASSED" : "N4 practice score: 80%+" },
        { id: `w${w}-goal-3`, text: w <= 44 ? "Real-world project deployed" : "Kaggle Bronze medal target" },
        { id: `w${w}-goal-4`, text: "Strong semester finish" },
      ],
    });
  }

  // 2026 (Weeks 53-104) - Advanced Building
  for (let w = 53; w <= 104; w++) {
    const dates = getWeekDates(w);
    const monthNum = Math.floor((w - 53) / 4);
    let focus = "";
    
    if (monthNum < 3) focus = "Research Experience Start + N3 Prep";
    else if (monthNum < 6) focus = "Undergraduate Research + Specialization";
    else if (monthNum < 9) focus = "Paper Writing + N3 Progress";
    else focus = "Research Completion + JLPT N3 Exam";

    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Advanced Building",
      focus,
      milestone: w === 104 ? "Year 2 Complete! JLPT N3 + Research Experience!" : undefined,
      japanese: [
        { id: `w${w}-jp-1`, text: "Daily Anki (20 min)", schedule: "NEVER stop" },
        { id: `w${w}-jp-2`, text: "Intermediate textbook (Tobira/Quartet)", schedule: "45 min daily" },
        { id: `w${w}-jp-3`, text: "NHK Easy News reading", schedule: "Daily 20 min", link: "https://www3.nhk.or.jp/news/easy/", linkText: "NHK Easy" },
        { id: `w${w}-jp-4`, text: "Podcasts/immersion", schedule: "Daily 30 min" },
        { id: `w${w}-jp-5`, text: "Kanji study: Target 650+ for N3" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: "Undergraduate research work", schedule: "6+ hours/week" },
        { id: `w${w}-ai-2`, text: "Advanced projects in specialization" },
        { id: `w${w}-ai-3`, text: "Research paper writing / reading", link: "https://scholar.google.com/", linkText: "Google Scholar" },
        { id: `w${w}-ai-4`, text: "Professor collaboration" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "Semester coursework" },
        { id: `w${w}-col-2`, text: "Strong GPA maintenance (8.5+)" },
        { id: `w${w}-col-3`, text: "Final year project" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: `${3000 + (w-53) * 20} vocabulary words` },
        { id: `w${w}-goal-2`, text: "Research progress / Paper submission" },
        { id: `w${w}-goal-3`, text: w >= 100 ? "JLPT N3 achieved" : "N3 preparation ongoing" },
      ],
      resources: [
        { title: "arXiv Preprints", url: "https://arxiv.org/" },
        { title: "Semantic Scholar", url: "https://www.semanticscholar.org/" },
        { title: "Connected Papers", url: "https://www.connectedpapers.com/" },
      ],
    });
  }

  // 2027 Jan-Apr (Weeks 105-125) - Applications
  for (let w = 105; w <= 125; w++) {
    const dates = getWeekDates(w);
    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Applications",
      focus: "Professor Contact + MEXT Application",
      milestone: w === 125 ? "BTech Graduation + MEXT Application Submitted!" : undefined,
      japanese: [
        { id: `w${w}-jp-1`, text: "N3 level maintenance (30 min/day)" },
        { id: `w${w}-jp-2`, text: "Conversational practice" },
        { id: `w${w}-jp-3`, text: "Research vocabulary" },
        { id: `w${w}-jp-4`, text: "Self-introduction practice in Japanese" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: "Professor research (10-15 targets)" },
        { id: `w${w}-ai-2`, text: "Research proposal writing (5-7 pages)" },
        { id: `w${w}-ai-3`, text: "Email professors (Jan-Apr)" },
        { id: `w${w}-ai-4`, text: "Video call preparations" },
      ],
      college: [
        { id: `w${w}-col-1`, text: "Final semester excellence" },
        { id: `w${w}-col-2`, text: "Graduate BTech (May 2027)" },
        { id: `w${w}-col-3`, text: "Final year project completion" },
      ],
      goals: [
        { id: `w${w}-goal-1`, text: "Research 2-3 professors weekly" },
        { id: `w${w}-goal-2`, text: "Read their papers thoroughly" },
        { id: `w${w}-goal-3`, text: "Refine research proposal" },
        { id: `w${w}-goal-4`, text: "MEXT documents preparation", link: "https://www.mext.go.jp/en/", linkText: "MEXT" },
      ],
      resources: [
        { title: "Study in Japan", url: "https://www.studyinjapan.go.jp/en/" },
        { title: "MEXT Official", url: "https://www.mext.go.jp/en/" },
      ],
    });
  }

  // 2027 May - 2028 Mar (Weeks 126-175) - Final Preparation
  for (let w = 126; w <= 175; w++) {
    const dates = getWeekDates(w);
    let focus = "";
    let milestone = "";
    
    if (w <= 135) focus = "Post-Graduation + Await MEXT Results";
    else if (w <= 155) focus = "Visa Processing + Japan Preparation";
    else {
      focus = "Final Preparations for Japan";
      if (w === 175) milestone = "DEPART FOR JAPAN! 🇯🇵✈️";
    }

    weeks.push({
      weekNumber: w,
      ...dates,
      phase: "Final Preparation",
      focus,
      milestone,
      japanese: [
        { id: `w${w}-jp-1`, text: "Japanese language maintenance" },
        { id: `w${w}-jp-2`, text: "Survival Japanese practice" },
        { id: `w${w}-jp-3`, text: "Watch Japanese content about daily life" },
        { id: `w${w}-jp-4`, text: "Connect with Japanese students online" },
      ],
      aiml: [
        { id: `w${w}-ai-1`, text: "Research current trends in your field" },
        { id: `w${w}-ai-2`, text: "Prepare for lab meetings/presentations" },
        { id: `w${w}-ai-3`, text: "Review professor's recent publications" },
      ],
      college: w <= 130 ? [
        { id: `w${w}-col-1`, text: "Graduation completed!" },
        { id: `w${w}-col-2`, text: "Collect all documents/transcripts" },
      ] : [],
      goals: w <= 155 ? [
        { id: `w${w}-goal-1`, text: w <= 135 ? "Await MEXT results (June-July)" : "Visa processing" },
        { id: `w${w}-goal-2`, text: "Financial preparation" },
        { id: `w${w}-goal-3`, text: "Research accommodation options" },
        { id: `w${w}-goal-4`, text: "Cultural research about Japan" },
      ] : [
        { id: `w${w}-goal-1`, text: "Pack and prepare belongings" },
        { id: `w${w}-goal-2`, text: "Final Japanese practice" },
        { id: `w${w}-goal-3`, text: "Connect with future labmates" },
        { id: `w${w}-goal-4`, text: "Book flights and arrange arrival" },
      ],
    });
  }

  return weeks;
};

export const weeklyData = generateWeeklyData();
