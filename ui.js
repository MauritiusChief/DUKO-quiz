const elements = {
  score: document.getElementById("score-value"),
  answered: document.getElementById("answered-value"),
  questionType: document.getElementById("question-type"),
  questionText: document.getElementById("question-text"),
  questionContext: document.getElementById("question-context"),
  feedback: document.getElementById("feedback"),
  nextButton: document.getElementById("next-button"),
  choiceButtons: Array.from(document.querySelectorAll(".choice-button")),
};

/**
 * 把当前题目对象渲染到页面 DOM 上。
 *
 * 它会更新题面、辅助上下文、反馈区、下一题按钮，
 * 以及四个答案按钮，让页面进入“等待作答”的状态。
 *
 * @param {{
 *   type: string,
 *   prompt: string,
 *   choices: number[],
 *   candidate: {
 *     id: string,
 *     baseType: string,
 *     baseName: string,
 *     displayName: string,
 *     tags: string,
 *     context: string
 *   }
 * }} question - 需要渲染的题目对象。
 * @returns {void}
 */
function renderQuestion(question) {
  state.currentQuestion = question;
  state.lastQuestionId = question.candidate.id;
  elements.questionType.textContent = question.label;
  elements.questionText.textContent = question.prompt;

  // question-context 只展示基础名字，避免把 name_suffix 或其他细节提前暴露出来。
  elements.questionContext.textContent = question.candidate.baseName || "";

  const hotkeys = ["A", "B", "C", "D"].slice(0, question.choices.length).join("-");
  elements.feedback.textContent = `Press ${hotkeys} or tap a choice.`;
  elements.feedback.className = "feedback";
  elements.nextButton.disabled = true;

  const indexList = ["A", "B", "C", "D"];

  elements.choiceButtons.forEach((button, index) => {
    // 每一轮都复用同一批按钮，所以这里先把状态重置干净。
    const hasChoice = index < question.choices.length;
    button.hidden = !hasChoice;
    button.disabled = !hasChoice;
    button.className = "choice-button";
    button.textContent = hasChoice ? `${indexList[index]}. ${question.choices[index]}` : "";
  });
}

/**
 * 根据当前内存中的 state 更新计分板显示。
 *
 * @returns {void}
 */
function renderScoreboard() {
  elements.score.textContent = String(state.score);
  elements.answered.textContent = String(state.answered);
}

/**
 * 处理用户提交的答案，更新状态并在界面上揭示结果。
 *
 * @param {number} choiceIndex - 用户点击的选项索引。
 * @returns {void}
 */
function submitAnswer(choiceIndex) {
  const question = state.currentQuestion;
  if (!question) {
    return;
  }

  const selectedValue = question.choices[choiceIndex];
  const isCorrect = QUESTION_TYPES[question.type].grade(selectedValue, question);

  // 每提交一次答案，就推进一次答题进度。
  state.answered += 1;
  if (isCorrect) {
    state.score += 1;
  }

  renderScoreboard();

  elements.choiceButtons.forEach((button, index) => {
    button.disabled = true;
    // 答完题后立即揭示真相：标出正确项，也标出用户选错的位置。
    if (index === question.correctIndex) {
      button.classList.add("correct", "reveal");
    } else if (index === choiceIndex) {
      button.classList.add("wrong");
    }
  });

  const answerText = `Correct answer: ${question.candidate.answerValue}`;
  if (isCorrect) {
    elements.feedback.textContent = `Correct. ${answerText}`;
    elements.feedback.className = "feedback success";
  } else {
    elements.feedback.textContent = `Not quite. ${answerText}`;
    elements.feedback.className = "feedback error";
  }

  elements.nextButton.disabled = false;
}

/**
 * 生成并渲染下一题；如果没有 candidate，则显示空状态提示。
 *
 * @returns {void}
 */
function loadNextQuestion() {
  const candidate = pickNextCandidate();
  if (!candidate) {
    elements.questionText.textContent = "No quiz candidates were generated.";
    elements.questionContext.textContent = "Check the data and normalization rules.";
    elements.feedback.textContent = "Nothing to ask yet.";
    elements.choiceButtons.forEach((button) => {
      button.hidden = false;
      button.disabled = true;
      button.textContent = "-";
    });
    return;
  }

  const pool = state.candidatePoolsByType[candidate.typeKey] || [];
  renderQuestion(createQuestion(candidate.typeKey, candidate.candidate, pool));
}

/**
 * 绑定点击和键盘事件，让用户可以答题并切到下一题。
 *
 * 键盘快捷键：
 * - `A` 到 `D`：选择答案
 * - `Enter` 或 `Space`：答完后进入下一题
 *
 * @returns {void}
 */
function wireEvents() {
  elements.choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) {
        return;
      }
      submitAnswer(Number(button.dataset.choiceIndex));
    });
  });

  elements.nextButton.addEventListener("click", () => {
    loadNextQuestion();
  });

  window.addEventListener("keydown", (event) => {
    const choiceKeys = ["a", "b", "c", "d"];
    // A-D 键和屏幕上的四个选项按钮一一对应。
    if (choiceKeys.includes(event.key)) {
      const choiceIndex = choiceKeys.findIndex((key) => key === event.key);
      const button = elements.choiceButtons[choiceIndex];
      if (button && !button.hidden && !button.disabled) {
        submitAnswer(choiceIndex);
      }
    }

    // Enter 和空格是为了更快连续刷题。
    if ((event.key === "Enter" || event.key === " ") && !elements.nextButton.disabled) {
      event.preventDefault();
      loadNextQuestion();
    }
  });
}
