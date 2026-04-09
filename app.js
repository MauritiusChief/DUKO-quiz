const RAW_DATA = {
  B: {
    name: "BASE CABINET",
    type_code: ["width"],
    width: [9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42],
    height: [34.5],
    depth: [24],
    detail: {
      no_drawer: { drawer: 0, door: 1, type_suffix: "F", width: [9] },
      single_drawer: { drawer: 1, door: 1, name_suffix: " - SINGLE DOOR", width: [12, 15, 18, 21] },
      double_door: { drawer: 1, door: 2, name_suffix: " - DOUBLE DOOR", width: [24, 27, 30, 33, 36] },
      double_drawer: { drawer: 2, door: 2, name_suffix: " - DOUBLE DOOR", width: [42] },
    },
  },
  DB: {
    name: "DRAWER BASE CABINET",
    type_code: ["width"],
    width: [12, 15, 18, 21, 24, 27, 30, 33, 36],
    height: [34.5],
    depth: [24],
    variant: {
      double_drawer: { drawer: 2, type_suffix: "-2", allow_variant: { width: [24, 30, 36] } },
      triple_drawer: { drawer: 3 },
    },
  },
  BMC: {
    name: "BASE MICROWAVE CABINET",
    type_code: ["width"],
    width: [30, 27],
    height: [34.5],
    depth: [24],
  },
  DKD: {
    name: "DESK KNEE DREWER",
    type_code: ["width"],
    width: [30, 36],
    height: [6.625],
    depth: [21],
    detail: {
      out_width_30: { self_width: 24, width: [30] },
      out_width_36: { self_width: 30, width: [36] },
    },
  },
  BLS: {
    name: "BASE CORNER CABINET-LASY SUSAN",
    type_code: ["width"],
    width: [33, 36],
    height: [34.5],
    depth: [24],
  },
  BBC: {
    name: "BASE BLIND CORNER CABINET",
    type_code: ["width"],
    width: [36, 39, 42],
    height: [34.5],
    depth: [24],
    detail: {
      install_range_36: { install_range: 39, type_suffix: "39", width: [36] },
      install_range_39: { install_range: 42, type_suffix: "42", width: [39] },
      install_range_42: { install_range: 45, type_suffix: "45", width: [42] },
    },
  },
  BSR: {
    name: "BASE SPICE RACK CABINET",
    type_code: ["width"],
    width: [6, 9, 12],
    height: [34.5],
    depth: [24],
  },
  BES: {
    name: "BASE ENDING SHELF",
    type_code: ["width"],
    width: [9],
    height: [30],
    depth: [24],
  },
  RD: {
    name: "ROLL-OUT DRAWER",
    type_code: ["width"],
    width: [18, 21, 24, 27, 30, 33, 36],
    depth: [20.375],
  },
  SB: {
    name: "SINK BASE CABINET",
    type_code: ["width"],
    width: [30, 33, 36, 42],
    height: [34.5],
    depth: [24],
    detail: {
      single_fake_drawer: { fake_drawer: 1, door: 2, width: [30, 33, 36] },
      double_fake_drawer: { fake_drawer: 2, door: 2, width: [42] },
    },
  },
  FSB: {
    name: "FARMHOUSE SINK BASE",
    type_code: ["width"],
    width: [36],
    height: [34.5],
    depth: [24],
  },
  CSB: {
    name: "CORNER SINK",
    type_code: ["width"],
    width: [42],
    height: [34.5],
    depth: [24],
  },
  W: {
    name: "WALL CABINET",
    type_code: ["width", "height"],
    width: [9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42],
    height: [12, 15, 18, 21, 24, 30, 36, 42],
    depth: [12, 24],
    detail: {
      single_door: { door: 1, name_suffix: " - SINGLE DOOR", width: [9, 12, 15, 18, 21] },
      double_door: { door: 2, name_suffix: " - DOUBLE DOOR", width: [24, 27, 30, 33, 36, 42] },
      double_shelves: { shelves: 2, height: [30, 36] },
      triple_shelves: { shelves: 3, height: [42] },
      not_wall_cab: { not_exist: true, width: [9, 12, 15, 18, 21, 24, 27, 33, 42], height: [18, 21, 24] },
      stackable: { name: "WALL STACKABLE CABINET", height: [12, 15], depth: [12] },
      not_stackable: { not_exist: true, width: [33, 42], height: [12, 15], depth: [12] },
      fridge: { name: "WALL FRIDGE CABINET", width: [30, 36], height: [12, 15, 18, 21, 24], depth: [24] },
      not_fridge_width: { not_exist: true, width: [9, 12, 15, 18, 21, 24, 27, 33, 42], depth: [24] },
      not_fridge_height: { not_exist: true, height: [30, 36, 42], depth: [24] },
      bridge: { name: "WALL BRIDGE CABINET", width: [30, 36], height: [12, 15, 18, 21, 24], depth: [12] },
    },
  },
  WDC: {
    name: "WALL DIAGONAL CORNER CABINET",
    type_code: ["width", "height"],
    width: [24],
    height: [15, 30, 36, 42],
    depth: [12],
  },
  WER: {
    name: "WALL EASYREACH CORNER CABINET",
    type_code: ["width", "height"],
    width: [24],
    height: [30, 36, 42],
    depth: [24],
  },
  WBC: {
    name: "WALL EASYREACH CORNER CABINET",
    type_code: ["width", "height"],
    width: [27],
    height: [30, 36, 42],
    depth: [12],
  },
  WES: {
    name: "WALL ENDING SHELF",
    type_code: ["width", "height"],
    width: [9],
    height: [30, 36, 42],
    depth: [12],
  },
  WMC: {
    name: "WALL MICROWAVE CABINET",
    type_code: ["width", "height"],
    width: [30, 27],
    height: [30, 36, 42],
    depth: [12],
  },
  WRC: {
    name: "WALL RACK",
    type_code: ["width", "height"],
    width: [30],
    height: [15],
    depth: [12],
  },
  PR: {
    name: "PLATE RACK",
    type_code: ["width", "height"],
    width: [30],
    height: [15],
    depth: [12],
  },
  UT: {
    name: "PANTRY",
    type_code: ["width", "height", "depth"],
    width: [18, 24, 36],
    height: [30, 36, 42, 51, 54],
    depth: [24],
    detail: {
      single_door: { door: 1, width: [18] },
      double_door: { door: 2, name_suffix: " CABINET", width: [24, 30, 36] },
      stack_top: { stack: "top", height: [30, 36, 42] },
      stack_bottom: { stack: "bottom", height: [51, 54] },
    },
  },
  OV: {
    name: "OVEN CABINET",
    type_code: ["width", "height", "depth"],
    width: [33],
    height: [15, 18, 21, 24, 27, 30, 66],
    depth: [24],
    detail: {
      stack_top: { stack: "top", height: [15, 18, 21, 24, 27, 30] },
      stack_bottom: { stack: "bottom", height: [66] },
    },
  },
  VDB: {
    name: "VANITY DRAWER BASE CABINET",
    type_code: ["width"],
    width: [12, 15, 18, 21, 24],
    height: [34.5],
    depth: [21],
  },
  VSB: {
    name: "VANITY SINK BASE CABINET",
    type_code: ["width"],
    width: [24, 27, 30, 36],
    height: [34.5],
    depth: [21],
    detail: {
      real_drawer: { drawer: 0, fake_drawer: 1 },
    },
  },
  VSD: {
    name: "VANITY SINK BASE CABINET",
    type_code: ["width"],
    width: [24, 27, 30, 36],
    height: [34.5],
    depth: [21],
    detail: {
      real_drawer: { drawer: 1, fake_drawer: 0 },
    },
  },
  VC: {
    name: "VANITY COMBINATION CABINET",
    type_code: ["width"],
    width: [30, 36, 42, 48],
    height: [34.5],
    depth: [21],
    variant: {
      left: { direction: "left", type_suffix: "L" },
      right: { direction: "right", type_suffix: "R" },
    },
    detail: {
      single_door: { door: 1, drawer: 2, fake_drawer: 1, width: [30] },
      double_door: { door: 2, drawer: 2, fake_drawer: 1, width: [36] },
      triple_drawer: { door: 2, drawer: 3, fake_drawer: 1, width: [42] },
      six_drawer: { door: 2, drawer: 6, fake_drawer: 1, width: [48] },
    },
  },
  BF: {
    name: "BASE FILLER",
    type_code: ["width"],
    width: [3, 6],
    height: [34.5],
    thickness: [1],
  },
  WF: {
    name: "WALL FILLER",
    type_code: ["width"],
    width: [3, 6],
    length: [42],
    thickness: [0.75],
  },
  TF: {
    name: "TALL FILLER",
    type_code: ["width"],
    width: [3, 6, 1.5],
    length: [96],
    thickness: [0.75],
    detail: {
      alias: { type: "RF", width: [1.5] },
    },
  },
  TK8: {
    name: "TOE KICK",
    width: [4.5],
    length: [96],
    thickness: [0.25],
  },
  PNL: {
    name: "PANEL",
    type_code: ["width", "length"],
    width: [24, 36, 39],
    length: [96],
    thickness: [0.25, 0.5, 0.75],
    detail: {
      alias: { type: "SK", width: [24], thickness: [0.25] },
      half_thick: { type_suffix: "H", thickness: [0.5] },
      quarter_thick: { type_suffix: "Q", thickness: [0.25] },
      triple_quarter_thick: { type_suffix: "-3/4''", thickness: [0.75] },
    },
  },
  VAL: {
    name: "VALANCE",
    type_code: ["width"],
    width: [60],
  },
  LM8: {
    name: "LIGHT MOLDING",
    length: [96],
    variant: {
      l_shape: { shape: "L", type_suffix: "-L" },
      normal: { shape: "normal" },
    },
  },
  SM8: {
    name: "SCRIKE MOLDING",
    length: [96],
  },
  OSM8: {
    name: "OUTSIDE SCRIKE MOLDING",
    length: [96],
  },
  CM: {
    name: "CROWN MOLDING",
    width: [2.5, 3.4375, 4.375],
    length: [96],
    detail: {
      suffix_1: { type_suffix: "1-1/4", width: [2.5] },
      suffix_2: { type_suffix: "2-1/2", width: [3.4375] },
      suffix_4: { type_suffix: "4", width: [4.375] },
    },
  },
  CP: {
    name: "POST",
    type_code: ["width", "height"],
    width: [3],
    height: [34],
  },
  ACM8: {
    name: "ANGLED CROWN MOLDING",
    length: [96],
  },
  CCM: {
    name: "COUE CROWN MOLDING",
    width: [2.5, 5],
    length: [96],
    detail: {
      suffix_2: { type_suffix: "2-1/2", width: [2.5] },
      suffix_5: { type_suffix: "5", width: [5] },
    },
  },
  CBL: {
    name: "CORBEL",
  },
  WDD: {
    name: "DECOR DOOR",
    type_code: ["width", "height"],
    width: [12],
    height: [30, 36, 42],
  },
  BDD: {
    name: "DECOR DOOR",
    type_code: ["width"],
    width: [24],
    height: [30],
  },
  VDD: {
    name: "DECOR DOOR",
    type_code: ["width"],
    width: [21],
    height: [30],
  },
  QR8: {
    name: "QUARTER ROUND",
    length: [96],
  },
  GH: {
    name: "GLASS HOLDER",
    type_code: ["width"],
    width: [30],
  },
  BM8: {
    name: "FANCY TOE KICK",
    width: [4.5],
    length: [96],
    thickness: [0.75],
  },
  BEP: {
    name: "BASE ENDING PANEL",
    type_code: ["width"],
    width: [24],
    height: [30],
  },
  WEP: {
    name: "WALL ENDING PANEL",
    type_code: ["width", "height"],
    width: [12],
    height: [30, 36, 42],
  },
  SD: {
    name: "SAMPLE DOOR",
    width: [12],
    height: [15],
  },
};

const QUIZ_FIELDS = ["drawer", "door", "fake_drawer", "shelves"];
const META_KEYS = new Set([
  "name",
  "type_code",
  "detail",
  "variant",
  "allow_variant",
  "type_suffix",
  "name_suffix",
  "type",
  "not_exist",
]);

const state = {
  score: 0,
  answered: 0,
  currentQuestion: null,
  lastCandidateId: null,
  candidates: [],
};

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

function formatDimensionValue(value) {
  if (Number.isInteger(value) && value >= 0 && value < 10) {
    return String(value).padStart(2, "0");
  }
  return String(value);
}

function buildFullType(baseType, typeCodeKeys, dimensions, suffix = "") {
  const code = (typeCodeKeys || [])
    .map((key) => formatDimensionValue(dimensions[key]))
    .join("");
  return `${baseType}${code}${suffix || ""}`;
}

function cartesianProduct(dimensionMap) {
  const entries = Object.entries(dimensionMap);
  if (entries.length === 0) {
    return [{}];
  }
  return entries.reduce((accumulator, [key, values]) => {
    const next = [];
    for (const existing of accumulator) {
      for (const value of values) {
        next.push({ ...existing, [key]: value });
      }
    }
    return next;
  }, [{}]);
}

function getDimensionKeys(item) {
  return Object.keys(item).filter((key) => Array.isArray(item[key]) && !META_KEYS.has(key));
}

function matchesConditions(dimensions, conditions) {
  return Object.entries(conditions).every(([key, values]) => {
    if (!Array.isArray(values)) {
      return true;
    }
    return values.includes(dimensions[key]);
  });
}

function pickRuleFields(rule) {
  const picked = {};
  for (const [key, value] of Object.entries(rule)) {
    if (META_KEYS.has(key)) {
      continue;
    }
    if (Array.isArray(value)) {
      continue;
    }
    picked[key] = value;
  }
  return picked;
}

function getVariantEntries(item) {
  const variants = item.variant || {};
  const entries = Object.entries(variants);
  if (entries.length === 0) {
    return [{ key: "default", rule: {} }];
  }
  return entries.map(([key, rule]) => ({ key, rule }));
}

function collectApplicableDetails(item, dimensions) {
  const details = item.detail || {};
  const positive = [];
  const negative = [];

  for (const [key, rule] of Object.entries(details)) {
    if (!matchesConditions(dimensions, rule)) {
      continue;
    }

    const detailEntry = { key, rule };
    if (rule.not_exist) {
      negative.push(detailEntry);
    } else {
      positive.push(detailEntry);
    }
  }

  return { positive, negative };
}

function normalizeData(rawData) {
  const candidates = [];

  for (const [baseType, item] of Object.entries(rawData)) {
    const baseDimensionKeys = getDimensionKeys(item);
    const dimensionSource = {};

    for (const key of baseDimensionKeys) {
      dimensionSource[key] = item[key];
    }

    const dimensionCombos = cartesianProduct(dimensionSource);
    const typeCodeKeys = item.type_code || [];
    const variantEntries = getVariantEntries(item);

    for (const dimensions of dimensionCombos) {
      const applicableDetails = collectApplicableDetails(item, dimensions);

      for (const variantEntry of variantEntries) {
        if (variantEntry.rule.allow_variant && !matchesConditions(dimensions, variantEntry.rule.allow_variant)) {
          continue;
        }

        const variantFields = pickRuleFields(variantEntry.rule);
        const effectiveFields = { ...variantFields };
        const displayNames = [];
        const contextParts = [];
        const activeTags = [];
        let effectiveType = baseType;
        let suffix = variantEntry.rule.type_suffix || "";

        if (variantEntry.key !== "default") {
          activeTags.push(variantEntry.key.replaceAll("_", " "));
        }

        for (const detailEntry of applicableDetails.positive) {
          const detailFields = pickRuleFields(detailEntry.rule);
          Object.assign(effectiveFields, detailFields);

          if (detailEntry.rule.name) {
            displayNames.push(detailEntry.rule.name);
          }

          if (detailEntry.rule.name_suffix) {
            displayNames.push(`${item.name}${detailEntry.rule.name_suffix}`);
          }

          if (detailEntry.rule.type_suffix) {
            suffix += detailEntry.rule.type_suffix;
          }

          if (detailEntry.rule.type) {
            effectiveType = detailEntry.rule.type;
          }

          const label = detailEntry.key.replaceAll("_", " ");
          activeTags.push(label);
        }

        if (displayNames.length === 0) {
          displayNames.push(item.name);
        }

        const fullType = buildFullType(effectiveType, typeCodeKeys, dimensions, suffix);

        for (const key of Object.keys(dimensions)) {
          if (!typeCodeKeys.includes(key)) {
            contextParts.push(`${key} ${dimensions[key]}`);
          }
        }

        for (const [key, value] of Object.entries(variantFields)) {
          if (QUIZ_FIELDS.includes(key)) {
            continue;
          }
          if (typeof value === "number" || typeof value === "string") {
            contextParts.push(`${key} ${value}`);
          }
        }

        const contextText = contextParts.join(" • ");
        const displayName = Array.from(new Set(displayNames)).join(" / ");
        const tagText = Array.from(new Set(activeTags)).join(" • ");

        for (const detailKey of QUIZ_FIELDS) {
          if (typeof effectiveFields[detailKey] !== "number") {
            continue;
          }

          const candidate = {
            id: `${fullType}:${detailKey}:${tagText || "base"}`,
            baseType,
            fullType,
            displayName,
            detailKey,
            answerValue: effectiveFields[detailKey],
            dimensions,
            context: contextText,
            tags: tagText,
          };

          candidates.push(candidate);
        }
      }
    }
  }

  return candidates.filter((candidate, index, list) => {
    return list.findIndex((other) => other.id === candidate.id) === index;
  });
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function createDistractors(correctValue, poolValues) {
  const uniqueValues = Array.from(new Set(poolValues.filter((value) => value !== correctValue)));
  const distractors = shuffle(uniqueValues).slice(0, 3);

  let offset = 1;
  while (distractors.length < 3) {
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
    buildPrompt(candidate) {
      return `${candidate.fullType} has how many ${candidate.detailKey}?`;
    },
    buildChoices(candidate, pool) {
      const sameFieldValues = pool
        .filter((item) => item.detailKey === candidate.detailKey)
        .map((item) => item.answerValue);
      const distractors = createDistractors(candidate.answerValue, sameFieldValues);
      return shuffle([candidate.answerValue, ...distractors]);
    },
    grade(choice, question) {
      return choice === question.candidate.answerValue;
    },
  },
};

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

function pickNextCandidate() {
  const pool = state.candidates;
  if (pool.length === 0) {
    return null;
  }

  const filtered = pool.filter((candidate) => candidate.id !== state.lastCandidateId);
  const source = filtered.length > 0 ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function renderQuestion(question) {
  state.currentQuestion = question;
  state.lastCandidateId = question.candidate.id;
  elements.questionType.textContent = "Detail Count";
  elements.questionText.textContent = question.prompt;

  const contextParts = [];
  if (question.candidate.displayName && question.candidate.displayName !== question.candidate.baseType) {
    contextParts.push(question.candidate.displayName);
  }
  if (question.candidate.tags) {
    contextParts.push(question.candidate.tags);
  }
  if (question.candidate.context) {
    contextParts.push(question.candidate.context);
  }
  elements.questionContext.textContent = contextParts.join(" • ");

  elements.feedback.textContent = "Press 1-4 or tap a choice.";
  elements.feedback.className = "feedback";
  elements.nextButton.disabled = true;

  elements.choiceButtons.forEach((button, index) => {
    button.disabled = false;
    button.className = "choice-button";
    button.textContent = `${index + 1}. ${question.choices[index]}`;
  });
}

function renderScoreboard() {
  elements.score.textContent = String(state.score);
  elements.answered.textContent = String(state.answered);
}

function submitAnswer(choiceIndex) {
  const question = state.currentQuestion;
  if (!question) {
    return;
  }

  const selectedValue = question.choices[choiceIndex];
  const isCorrect = QUESTION_TYPES[question.type].grade(selectedValue, question);

  state.answered += 1;
  if (isCorrect) {
    state.score += 1;
  }

  renderScoreboard();

  elements.choiceButtons.forEach((button, index) => {
    button.disabled = true;
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

function loadNextQuestion() {
  const candidate = pickNextCandidate();
  if (!candidate) {
    elements.questionText.textContent = "No quiz candidates were generated.";
    elements.questionContext.textContent = "Check the data and normalization rules.";
    elements.feedback.textContent = "Nothing to ask yet.";
    elements.choiceButtons.forEach((button) => {
      button.disabled = true;
      button.textContent = "-";
    });
    return;
  }

  renderQuestion(createQuestion(candidate, state.candidates));
}

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
    if (event.key >= "1" && event.key <= "4") {
      const choiceIndex = Number(event.key) - 1;
      const button = elements.choiceButtons[choiceIndex];
      if (button && !button.disabled) {
        submitAnswer(choiceIndex);
      }
    }

    if ((event.key === "Enter" || event.key === " ") && !elements.nextButton.disabled) {
      event.preventDefault();
      loadNextQuestion();
    }
  });
}

function init() {
  state.candidates = QUESTION_TYPES.detail_count.collectCandidates(RAW_DATA);
  renderScoreboard();
  wireEvents();
  loadNextQuestion();
}

init();
