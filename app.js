
const state = {
  score: 0,
  answered: 0,
  currentQuestion: null,
  lastQuestionId: null,
  entities: [],
  candidatePoolsByType: {},
  questionTypeKeys: [],
};

/**
 * 在页面脚本加载后初始化整个 quiz 应用。
 *
 * @returns {void}
 */
function init() {
  // 先把层级化原始数据转成统一实体，再按题型拆分成各自题池。
  state.entities = normalizeData(RAW_DATA);
  state.candidatePoolsByType = buildCandidatePoolsByType(state.entities);
  state.questionTypeKeys = Object.keys(state.candidatePoolsByType).filter((typeKey) => {
    return state.candidatePoolsByType[typeKey].length > 0;
  });
  renderScoreboard();
  wireEvents();
  loadNextQuestion();
}

init();
