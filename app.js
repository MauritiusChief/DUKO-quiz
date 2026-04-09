
const state = {
  score: 0,
  answered: 0,
  currentQuestion: null,
  lastCandidateId: null,
  candidates: [],
};

/**
 * 在页面脚本加载后初始化整个 quiz 应用。
 *
 * @returns {void}
 */
function init() {
  // 先把层级化原始数据转成 quiz 引擎可直接使用的扁平题池。
  state.candidates = QUESTION_TYPES.detail_count.collectCandidates(RAW_DATA);
  renderScoreboard();
  wireEvents();
  loadNextQuestion();
}

init();
