/**
 * 用 Fisher-Yates 算法返回一个打乱后的新数组。
 *
 * @template T
 * @param {T[]} items - 需要打乱的数组。
 * @returns {T[]} 随机顺序的新数组副本。
 */
function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

/**
 * 为四选一题目生成三个错误答案。
 *
 * 它会优先使用同一类知识点里真实存在过的其他数值，
 * 因为这样的干扰项更像真的。若真实值不够，再从正确答案附近的整数补齐。
 *
 * @param {number} correctValue - 当前题目的正确答案。
 * @param {number[]} poolValues - 同一 detailKey 下出现过的其他答案值。
 * @returns {number[]} 三个不重复的错误选项。
 */
function createDistractors(correctValue, poolValues) {
  const uniqueValues = Array.from(new Set(poolValues.filter((value) => value !== correctValue)));
  const distractors = shuffle(uniqueValues).slice(0, 3);

  let offset = 1;
  while (distractors.length < 3) {
    // 从正确答案向两侧逐步扩张，直到补够足够合理的错误选项。
    const fallbackValues = [correctValue - offset, correctValue + offset];
    for (const value of fallbackValues) {
      if (value < 0 || distractors.includes(value) || value === correctValue) {
        continue;
      }
      distractors.push(value);
      if (distractors.length === 3) {
        break;
      }
    }
    offset += 1;
  }

  return distractors;
}

const QUESTION_TYPES = {
  detail_count: {
    collectCandidates: normalizeData,
    /**
     * 生成一道“数量题”的题面文本。
     *
     * @param {{ fullType: string, detailKey: string }} candidate - 当前要出题的 candidate。
     * @returns {string} 显示在页面上的题目文本。
     */
    buildPrompt(candidate) {
      return `${candidate.fullType} has how many ${candidate.detailKey}?`;
    },
    /**
     * 生成并打乱一道题显示的四个选项。
     *
     * @param {{ detailKey: string, answerValue: number }} candidate - 当前题目的 candidate。
     * @param {Array<{ detailKey: string, answerValue: number }>} pool - 完整 candidate 池。
     * @returns {number[]} 包含正确答案在内的四个选项。
     */
    buildChoices(candidate, pool) {
      const sameFieldValues = pool
        .filter((item) => item.detailKey === candidate.detailKey)
        .map((item) => item.answerValue);
      const distractors = createDistractors(candidate.answerValue, sameFieldValues);
      return shuffle([candidate.answerValue, ...distractors]);
    },
    /**
     * 判断用户所选答案是否等于当前题目的真实值。
     *
     * @param {number} choice - 用户选中的选项值。
     * @param {{ candidate: { answerValue: number } }} question - 当前题目对象。
     * @returns {boolean} 答对时返回 true。
     */
    grade(choice, question) {
      return choice === question.candidate.answerValue;
    },
  },
};

/**
 * 把一条 candidate 转成可直接渲染的题目对象。
 *
 * @param {{
 *   id: string,
 *   fullType: string,
 *   detailKey: string,
 *   answerValue: number
 * }} candidate - 被选中用于出下一题的 candidate。
 * @param {Array<{ detailKey: string, answerValue: number }>} pool - 完整 candidate 池。
 * @returns {{
 *   type: string,
 *   prompt: string,
 *   choices: number[],
 *   correctIndex: number,
 *   candidate: object
 * }} 可直接用于渲染的完整题目对象。
 */
function createQuestion(candidate, pool) {
  const questionType = QUESTION_TYPES.detail_count;
  const choices = questionType.buildChoices(candidate, pool);
  return {
    type: "detail_count",
    prompt: questionType.buildPrompt(candidate),
    choices,
    correctIndex: choices.indexOf(candidate.answerValue),
    candidate,
  };
}

/**
 * 从 candidate 池里抽取下一题，尽量避免和上一题完全重复。
 *
 * @returns {object|null} 下一条 candidate；如果题池为空则返回 null。
 */
function pickNextCandidate() {
  const pool = state.candidates;
  if (pool.length === 0) {
    return null;
  }

  const filtered = pool.filter((candidate) => candidate.id !== state.lastCandidateId);
  const source = filtered.length > 0 ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}
