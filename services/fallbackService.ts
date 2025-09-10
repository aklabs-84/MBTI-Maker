import { Question, MbtiAxis, MbtiDimension } from '../types';

const templates: Record<MbtiAxis, Omit<Question, 'id' | 'text'>[]> = {
    EI: [
        { icon: '🎉', dimension: 'EI', weight: 1, choices: [{ id: 'L', label: '여러 사람과 함께하며 에너지를 얻는다', polarity: 'E' }, { id: 'R', label: '혼자 조용히 생각하며 에너지를 얻는다', polarity: 'I' }] },
        { icon: '🏃‍♂️', dimension: 'EI', weight: 1, choices: [{ id: 'L', label: '먼저 행동하고 나중에 생각한다', polarity: 'E' }, { id: 'R', label: '충분히 생각한 후 행동한다', polarity: 'I' }] },
        { icon: '🗣️', dimension: 'EI', weight: 1, choices: [{ id: 'L', label: '폭넓은 대화를 통해 아이디어를 발전시킨다', polarity: 'E' }, { id: 'R', label: '깊이 있는 소수의 대화를 선호한다', polarity: 'I' }] }
    ],
    SN: [
        { icon: '🌳', dimension: 'SN', weight: 1, choices: [{ id: 'L', label: '실제 경험과 사실에 더 집중한다', polarity: 'S' }, { id: 'R', label: '미래의 가능성과 아이디어를 더 탐구한다', polarity: 'N' }] },
        { icon: '🔍', dimension: 'SN', weight: 1, choices: [{ id: 'L', label: '구체적이고 현실적인 설명을 선호한다', polarity: 'S' }, { id: 'R', label: '비유적이고 추상적인 설명을 선호한다', polarity: 'N' }] },
        { icon: '🛠️', dimension: 'SN', weight: 1, choices: [{ id: 'L', label: '검증된 방식으로 일하는 것을 선호한다', polarity: 'S' }, { id: 'R', label: '새로운 방식으로 시도하는 것을 즐긴다', polarity: 'N' }] }
    ],
    TF: [
        { icon: '📊', dimension: 'TF', weight: 1, choices: [{ id: 'L', label: '객관적인 사실과 논리를 중시한다', polarity: 'T' }, { id: 'R', label: '사람들과의 관계와 감정을 중시한다', polarity: 'F' }] },
        { icon: '❤️', dimension: 'TF', weight: 1, choices: [{ id: 'L', label: '결정이 가져올 결과에 대해 분석한다', polarity: 'T' }, { id: 'R', label: '결정이 사람들에게 미칠 영향에 공감한다', polarity: 'F' }] },
        { icon: '⚖️', dimension: 'TF', weight: 1, choices: [{ id: 'L', label: '진실과 효율성을 위해 솔직하게 비판한다', polarity: 'T' }, { id: 'R', label: '상대방의 기분을 고려하여 조심스럽게 말한다', polarity: 'F' }] }
    ],
    JP: [
        { icon: '📅', dimension: 'JP', weight: 1, choices: [{ id: 'L', label: '계획을 세우고 체계적으로 진행한다', polarity: 'J' }, { id: 'R', label: '상황에 맞춰 유연하게 대처한다', polarity: 'P' }] },
        { icon: '🎨', dimension: 'JP', weight: 1, choices: [{ id: 'L', label: '마감 기한을 지키는 것이 중요하다', polarity: 'J' }, { id: 'R', label: '자유로운 분위기에서 더 능률이 오른다', polarity: 'P' }] },
        { icon: '🧭', dimension: 'JP', weight: 1, choices: [{ id: 'L', label: '정리된 환경에서 안정을 느낀다', polarity: 'J' }, { id: 'R', label: '다소 어수선해도 자유로운 환경을 즐긴다', polarity: 'P' }] }
    ]
};

const baseTexts: Record<MbtiAxis, string[]> = {
    EI: ["{topic} 상황에서, 나는 주로", "새로운 {topic} 프로젝트를 시작할 때, 나는", "{topic}에 대해 이야기할 때, 나는"],
    SN: ["{topic} 문제를 해결할 때, 나는", "{topic}에 대한 정보를 받아들일 때, 나는", "{topic} 관련 업무를 처리할 때, 나는"],
    TF: ["{topic}에 대한 결정을 내릴 때, 나는", "{topic}에 대해 피드백을 줄 때, 나는", "{topic} 결과에 대해 동료에게 피드백을 줄 때, 나는"],
    JP: ["{topic}을 진행할 때 나의 스타일은", "{topic} 마감일을 앞두고, 나는", "{topic}을 위한 나의 작업 공간은,"]
}

export const getFallbackQuestions = (topic: string): Question[] => {
    const questions: Question[] = [];
    let idCounter = 1;

    (Object.keys(templates) as MbtiAxis[]).forEach(axis => {
        templates[axis].forEach((template, index) => {
            questions.push({
                ...template,
                id: `fallback_${idCounter++}`,
                text: baseTexts[axis][index].replace('{topic}', topic),
            });
        });
    });

    return questions;
};