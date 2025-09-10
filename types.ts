export type Page = 'home' | 'loadingSuggestions' | 'suggestion' | 'loadingQuiz' | 'quiz' | 'loadingResult' | 'result';

export type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP';

export type Choice = {
  id: 'L' | 'R';
  label: string;
  polarity: MbtiDimension;
};

export type Question = {
  id: string;
  text: string;
  icon: string;
  dimension: MbtiAxis;
  weight: number;
  choices: [Choice, Choice];
};

export type MbtiScores = Record<MbtiDimension, number>;

export type ContributingQuestion = {
  text: string;
  choice: string;
};

export type InterpretationDetail = {
  title: string;
  emoji: string;
  summary: string;
  match: {
    type: string;
    description: string;
  };
  strengths: string[];
  weaknesses: string[];
  characteristics: string[];
};


export type MBTIResult = {
  type: string;
  scores: MbtiScores;
  interpretation: InterpretationDetail;
  contributingQuestions: ContributingQuestion[];
};