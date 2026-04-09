const DIMENSION_LABELS = {
  width: "W",
  height: "H",
  depth: "D",
  length: "L",
  thickness: "T",
};

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
 * 计算两个整数的最大公约数。
 *
 * @param {number} a - 第一个整数。
 * @param {number} b - 第二个整数。
 * @returns {number} 最大公约数。
 */
function greatestCommonDivisor(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x || 1;
}

/**
 * 将十进制尺寸值转换成分数字符串。
 *
 * @param {number|string} value - 原始尺寸值。
 * @returns {string} 适合显示在选项中的字符串格式。
 */
function formatDimensionDisplay(value) {
  if (typeof value !== "number" || Number.isInteger(value)) {
    return String(value);
  }

  const scale = 16;
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);
  const whole = Math.floor(absoluteValue);
  const fractionNumeratorRaw = Math.round((absoluteValue - whole) * scale);

  if (fractionNumeratorRaw === 0) {
    return `${sign}${whole}`;
  }

  if (fractionNumeratorRaw === scale) {
    return `${sign}${whole + 1}`;
  }

  const divisor = greatestCommonDivisor(fractionNumeratorRaw, scale);
  const numerator = fractionNumeratorRaw / divisor;
  const denominator = scale / divisor;

  if (whole === 0) {
    return `${sign}${numerator}/${denominator}`;
  }

  return `${sign}${whole} ${numerator}/${denominator}`;
}

/**
 * 返回尺寸字段对应的显示缩写。
 *
 * @param {string} key - 原始尺寸字段名。
 * @returns {string} 尺寸缩写。
 */
function formatDimensionLabel(key) {
  return DIMENSION_LABELS[key] || key.toUpperCase();
}

/**
 * 从统一实体里提取没有编码进 type 的尺寸字段。
 *
 * @param {{ typeCodeKeys: string[], dimensions: Record<string, number|string> }} entity - 已归一化实体。
 * @returns {string[]} 非 type_code 尺寸字段列表。
 */
function getVisibleDimensionKeys(entity) {
  return Object.keys(entity.dimensions).filter((key) => !entity.typeCodeKeys.includes(key));
}

/**
 * 为尺寸题拼出完整选项文本。
 *
 * @param {{ dimensions: Record<string, number|string>, typeCodeKeys: string[] }} entity - 已归一化实体。
 * @returns {string} 尺寸组合文本；如果没有可展示维度则返回空字符串。
 */
function buildDimensionOption(entity) {
  const visibleKeys = getVisibleDimensionKeys(entity);
  if (visibleKeys.length === 0) {
    return "";
  }

  return visibleKeys
    .map((key) => `${formatDimensionLabel(key)}=${formatDimensionDisplay(entity.dimensions[key])}`)
    .join(", ");
}

/**
 * 生成 detail_count 题型使用的候选题列表。
 *
 * @param {Array<{ id: string, fullType: string, baseName: string, effectiveFields: Record<string, unknown> }>} entities - 统一实体列表。
 * @returns {Array<object>} 适用于 detail_count 的候选题。
 */
function collectDetailCountCandidates(entities) {
  const candidates = [];

  for (const entity of entities) {
    for (const detailKey of QUIZ_NUMERIC_FIELDS) {
      if (typeof entity.effectiveFields[detailKey] !== "number") {
        continue;
      }

      candidates.push({
        id: `${entity.id}:detail_count:${detailKey}`,
        typeKey: "detail_count",
        baseName: entity.baseName,
        fullType: entity.fullType,
        detailKey,
        answerValue: entity.effectiveFields[detailKey],
        entity,
      });
    }
  }

  return candidates;
}

/**
 * 生成 detail_stack 题型使用的候选题列表。
 *
 * @param {Array<{ id: string, fullType: string, baseName: string, effectiveFields: Record<string, unknown> }>} entities - 统一实体列表。
 * @returns {Array<object>} 适用于 detail_stack 的候选题。
 */
function collectDetailStackCandidates(entities) {
  return entities
    .filter((entity) => typeof entity.effectiveFields.stack === "string")
    .map((entity) => ({
      id: `${entity.id}:detail_stack`,
      typeKey: "detail_stack",
      baseName: entity.baseName,
      fullType: entity.fullType,
      answerValue: entity.effectiveFields.stack,
      entity,
    }));
}

/**
 * 生成 type_dimensions 题型使用的候选题列表。
 *
 * @param {Array<{ id: string, fullType: string, baseName: string, dimensions: Record<string, number|string>, typeCodeKeys: string[] }>} entities - 统一实体列表。
 * @returns {Array<object>} 适用于 type_dimensions 的候选题。
 */
function collectTypeDimensionCandidates(entities) {
  return entities
    .map((entity) => {
      const visibleDimensionKeys = getVisibleDimensionKeys(entity);
      const answerValue = buildDimensionOption(entity);
      return {
        id: `${entity.id}:type_dimensions`,
        typeKey: "type_dimensions",
        baseName: entity.baseName,
        fullType: entity.fullType,
        answerValue,
        visibleDimensionKeys,
        entity,
      };
    })
    .filter((candidate) => candidate.answerValue !== "");
}

/**
 * 按完整名字建立可快速查询的 type 索引。
 *
 * @param {Array<{ fullName: string, fullType: string }>} entities - 统一实体列表。
 * @returns {Map<string, string[]>} 从 fullName 到真实 fullType 列表的映射。
 */
function buildNameTypeIndex(entities) {
  const index = new Map();

  for (const entity of entities) {
    const existing = index.get(entity.fullName) || [];
    if (!existing.includes(entity.fullType)) {
      existing.push(entity.fullType);
    }
    index.set(entity.fullName, existing);
  }

  return index;
}

/**
 * 生成 name_to_type 题型使用的候选题列表。
 *
 * @param {Array<{ id: string, baseName: string, baseType: string, fullName: string, fullType: string }>} entities - 统一实体列表。
 * @returns {Array<object>} 适用于 name_to_type 的候选题。
 */
function collectNameToTypeCandidates(entities) {
  const index = buildNameTypeIndex(entities);
  const candidates = [];

  for (const entity of entities) {
    // 这类题要求用“同 baseType + 混淆尺寸”来构造干扰项，
    // 因此没有 type_code 尺寸的实体不进入该题型题池。
    if (!entity.typeCodeKeys || entity.typeCodeKeys.length === 0) {
      continue;
    }

    const trueTypes = index.get(entity.fullName) || [];
    if (!trueTypes.includes(entity.fullType)) {
      continue;
    }

    candidates.push({
      id: `${entity.id}:name_to_type`,
      typeKey: "name_to_type",
      baseName: entity.baseName,
      baseType: entity.baseType,
      fullName: entity.fullName,
      answerValue: entity.fullType,
      trueTypes,
      entity,
    });
  }

  return candidates.filter((candidate, indexPosition, list) => {
    return list.findIndex((other) => other.id === candidate.id) === indexPosition;
  });
}

/**
 * 按题型生成候选题池，方便后续随机抽题。
 *
 * @param {Array<object>} entities - 统一实体列表。
 * @returns {Record<string, object[]>} 按题型 key 分组后的候选池。
 */
function buildCandidatePoolsByType(entities) {
  const pools = {};

  for (const [typeKey, questionType] of Object.entries(QUESTION_TYPES)) {
    pools[typeKey] = questionType.collectCandidates(entities);
  }

  return pools;
}

/**
 * 根据现有字符串选项补出最多三个错误答案。
 *
 * @param {string} correctValue - 正确答案文本。
 * @param {string[]} poolValues - 可作为干扰项的候选文本。
 * @returns {string[]} 最多三个错误答案。
 */
function createStringDistractors(correctValue, poolValues) {
  return shuffle(
    Array.from(new Set(poolValues.filter((value) => value !== correctValue && value !== "")))
  ).slice(0, 3);
}

/**
 * 构建一个用于尺寸题的伪造错误选项，保持维度结构不变。
 *
 * @param {{ visibleDimensionKeys: string[], entity: { dimensions: Record<string, number|string> }, answerValue: string }} candidate - 当前尺寸题 candidate。
 * @param {Array<object>} pool - 同题型完整题池。
 * @param {string[]} existingChoices - 已经生成的选项文本。
 * @returns {string|null} 新的错误选项；如果无法构造则返回 null。
 */
function buildSyntheticDimensionDistractor(candidate, pool, existingChoices) {
  const keys = candidate.visibleDimensionKeys;
  const signature = keys.join("|");
  const related = pool.filter((item) => item.visibleDimensionKeys.join("|") === signature);

  for (const key of keys) {
    const alternateValues = Array.from(
      new Set(
        related
          .map((item) => item.entity.dimensions[key])
          .filter((value) => value !== candidate.entity.dimensions[key])
      )
    );

    for (const alternateValue of alternateValues) {
      const fakeDimensions = { ...candidate.entity.dimensions, [key]: alternateValue };
      const optionText = keys
        .map((dimensionKey) => `${formatDimensionLabel(dimensionKey)}=${formatDimensionDisplay(fakeDimensions[dimensionKey])}`)
        .join(", ");

      if (!existingChoices.includes(optionText) && optionText !== candidate.answerValue) {
        return optionText;
      }
    }
  }

  // 如果同结构真实数据不足，则用邻近尺寸值伪造同结构干扰项。
  for (const key of keys) {
    const baseValue = candidate.entity.dimensions[key];
    if (typeof baseValue !== "number") {
      continue;
    }

    const fallbackOffsets = [1, -1, 0.5, -0.5, 0.25, -0.25];
    for (const offset of fallbackOffsets) {
      const nextValue = baseValue + offset;
      if (nextValue < 0) {
        continue;
      }

      const fakeDimensions = { ...candidate.entity.dimensions, [key]: nextValue };
      const optionText = keys
        .map((dimensionKey) => `${formatDimensionLabel(dimensionKey)}=${formatDimensionDisplay(fakeDimensions[dimensionKey])}`)
        .join(", ");

      if (!existingChoices.includes(optionText) && optionText !== candidate.answerValue) {
        return optionText;
      }
    }
  }

  return null;
}

/**
 * 为 name_to_type 题型收集同 baseType 下可复用的尺寸值池。
 *
 * @param {Array<{ baseType: string, entity: { dimensions: Record<string, number|string> } }>} pool - 完整名字题池。
 * @param {string} baseType - 当前题目的 baseType。
 * @returns {Record<string, Array<number|string>>} 按尺寸字段分组的可用值池。
 */
function collectDimensionValuesByBaseType(pool, baseType) {
  const dimensionValues = {};

  for (const item of pool) {
    if (item.baseType !== baseType) {
      continue;
    }

    for (const [key, value] of Object.entries(item.entity.dimensions)) {
      if (!dimensionValues[key]) {
        dimensionValues[key] = [];
      }
      if (!dimensionValues[key].includes(value)) {
        dimensionValues[key].push(value);
      }
    }
  }

  return dimensionValues;
}

/**
 * 为 name_to_type 题型生成一个 synthetic 干扰项。
 *
 * 规则：
 * 1. 保留原有 baseType
 * 2. 按当前实体的 typeCodeKeys 顺序重组尺寸编码
 * 3. 优先复用同 baseType 的真实尺寸值
 * 4. 若真实尺寸值不够，再用邻近数值补位
 *
 * @param {{
 *   answerValue: string,
 *   baseType: string,
 *   trueTypes: string[],
 *   entity: {
 *     typeCodeKeys: string[],
 *     dimensions: Record<string, number|string>
 *   }
 * }} candidate - 当前名字题 candidate。
 * @param {Array<object>} pool - 完整名字题池。
 * @param {string[]} existingChoices - 已经使用过的选项。
 * @returns {string|null} 新的 synthetic type；如果无法生成则返回 null。
 */
function buildSyntheticTypeDistractor(candidate, pool, existingChoices) {
  const dimensionValues = collectDimensionValuesByBaseType(pool, candidate.baseType);
  const { typeCodeKeys, dimensions } = candidate.entity;

  for (const key of typeCodeKeys) {
    const knownValues = dimensionValues[key] || [];
    for (const value of knownValues) {
      if (value === dimensions[key]) {
        continue;
      }

      const fakeDimensions = { ...dimensions, [key]: value };
      const fakeType = buildFullType(candidate.baseType, typeCodeKeys, fakeDimensions);

      if (
        !existingChoices.includes(fakeType) &&
        fakeType !== candidate.answerValue &&
        !candidate.trueTypes.includes(fakeType)
      ) {
        return fakeType;
      }
    }
  }

  for (const key of typeCodeKeys) {
    const baseValue = dimensions[key];
    if (typeof baseValue !== "number") {
      continue;
    }

    const fallbackOffsets = [1, -1, 3, -3, 6, -6, 0.5, -0.5, 0.25, -0.25];
    for (const offset of fallbackOffsets) {
      const nextValue = baseValue + offset;
      if (nextValue < 0) {
        continue;
      }

      const fakeDimensions = { ...dimensions, [key]: nextValue };
      const fakeType = buildFullType(candidate.baseType, typeCodeKeys, fakeDimensions);

      if (
        !existingChoices.includes(fakeType) &&
        fakeType !== candidate.answerValue &&
        !candidate.trueTypes.includes(fakeType)
      ) {
        return fakeType;
      }
    }
  }

  return null;
}

/**
 * 为 name_to_type 题型生成三个错误答案。
 *
 * 错误答案必须：
 * 1. 与正确答案拥有相同 baseType
 * 2. 不属于当前 fullName 的任何真实 type
 * 3. 不与已有答案重复
 *
 * @param {{
 *   answerValue: string,
 *   baseType: string,
 *   trueTypes: string[],
 *   entity: object
 * }} candidate - 当前名字题 candidate。
 * @param {Array<{ answerValue: string, baseType: string, trueTypes: string[], entity: object }>} pool - 完整名字题池。
 * @returns {string[]} 三个错误答案。
 */
function buildNameTypeDistractors(candidate, pool) {
  const distractors = [];

  const realSameBaseTypePool = pool
    .filter((item) => item.baseType === candidate.baseType)
    .map((item) => item.answerValue)
    .filter((value) => value !== candidate.answerValue)
    .filter((value) => !candidate.trueTypes.includes(value));

  for (const value of shuffle(Array.from(new Set(realSameBaseTypePool)))) {
    distractors.push(value);
    if (distractors.length === 3) {
      return distractors;
    }
  }

  while (distractors.length < 3) {
    const synthetic = buildSyntheticTypeDistractor(candidate, pool, [
      candidate.answerValue,
      ...distractors,
    ]);

    if (!synthetic) {
      break;
    }

    distractors.push(synthetic);
  }

  return distractors;
}

const QUESTION_TYPES = {
  detail_count: {
    label: "Detail Count",
    collectCandidates: collectDetailCountCandidates,
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
     * @returns {Array<number>} 包含正确答案在内的四个选项。
     */
    buildChoices(candidate, pool) {
      const sameFieldValues = pool
        .filter((item) => item.detailKey === candidate.detailKey)
        .map((item) => item.answerValue);
      const distractors = createNumericDistractors(candidate.answerValue, sameFieldValues);
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
  detail_stack: {
    label: "Stack Position",
    collectCandidates: collectDetailStackCandidates,
    /**
     * 生成一道 stack 题的题面文本。
     *
     * @param {{ fullType: string }} candidate - 当前要出题的 candidate。
     * @returns {string} 显示在页面上的题目文本。
     */
    buildPrompt(candidate) {
      return `${candidate.fullType} belongs to which stack?`;
    },
    /**
     * 生成 stack 题的两个选项。
     *
     * @returns {string[]} `top` 与 `bottom` 的随机顺序选项。
     */
    buildChoices() {
      return shuffle(["top", "bottom"]);
    },
    /**
     * 判断 stack 题答案是否正确。
     *
     * @param {string} choice - 用户选中的字符串答案。
     * @param {{ candidate: { answerValue: string } }} question - 当前题目对象。
     * @returns {boolean} 答对时返回 true。
     */
    grade(choice, question) {
      return choice === question.candidate.answerValue;
    },
  },
  type_dimensions: {
    label: "Type Dimensions",
    collectCandidates: collectTypeDimensionCandidates,
    /**
     * 生成一道尺寸题的题面文本。
     *
     * @param {{ fullType: string }} candidate - 当前要出题的 candidate。
     * @returns {string} 显示在页面上的题目文本。
     */
    buildPrompt(candidate) {
      return `Which dimension set can belong to ${candidate.fullType}?`;
    },
    /**
     * 生成尺寸题的四个选项。
     *
     * @param {{ answerValue: string, visibleDimensionKeys: string[] }} candidate - 当前尺寸题 candidate。
     * @param {Array<{ answerValue: string, visibleDimensionKeys: string[], entity: object }>} pool - 完整尺寸题池。
     * @returns {string[]} 包含正确答案在内的选项。
     */
    buildChoices(candidate, pool) {
      const signature = candidate.visibleDimensionKeys.join("|");
      const sameStructureOptions = pool
        .filter((item) => item.visibleDimensionKeys.join("|") === signature)
        .map((item) => item.answerValue);

      const distractors = createStringDistractors(candidate.answerValue, sameStructureOptions);

      while (distractors.length < 3) {
        const synthetic = buildSyntheticDimensionDistractor(candidate, pool, [
          candidate.answerValue,
          ...distractors,
        ]);

        if (!synthetic) {
          break;
        }

        distractors.push(synthetic);
      }

      return shuffle([candidate.answerValue, ...distractors]);
    },
    /**
     * 判断尺寸题答案是否正确。
     *
     * @param {string} choice - 用户选中的尺寸组合文本。
     * @param {{ candidate: { answerValue: string } }} question - 当前题目对象。
     * @returns {boolean} 答对时返回 true。
     */
    grade(choice, question) {
      return choice === question.candidate.answerValue;
    },
  },
  name_to_type: {
    label: "Name To Type",
    collectCandidates: collectNameToTypeCandidates,
    /**
     * 生成一道“名字找 type”题的题面文本。
     *
     * @param {{ fullName: string }} candidate - 当前要出题的 candidate。
     * @returns {string} 显示在页面上的题目文本。
     */
    buildPrompt(candidate) {
      return `Which type truly belongs to ${candidate.fullName}?`;
    },
    /**
     * 生成名字题的四个选项。
     *
     * @param {{ answerValue: string, trueTypes: string[], baseType: string, baseName: string }} candidate - 当前题目的 candidate。
     * @param {Array<{ answerValue: string, trueTypes: string[], baseType: string, baseName: string }>} pool - 完整名字题池。
     * @returns {string[]} 包含正确答案在内的四个选项。
     */
    buildChoices(candidate, pool) {
      const distractors = buildNameTypeDistractors(candidate, pool);
      return shuffle([candidate.answerValue, ...distractors]);
    },
    /**
     * 判断名字题答案是否正确。
     *
     * @param {string} choice - 用户选中的完整 type。
     * @param {{ candidate: { answerValue: string } }} question - 当前题目对象。
     * @returns {boolean} 答对时返回 true。
     */
    grade(choice, question) {
      return choice === question.candidate.answerValue;
    },
  },
};

/**
 * 为数值题目生成三个错误答案。
 *
 * @param {number} correctValue - 当前题目的正确答案。
 * @param {number[]} poolValues - 同一 detailKey 下出现过的其他答案值。
 * @returns {number[]} 三个不重复的错误选项。
 */
function createNumericDistractors(correctValue, poolValues) {
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

/**
 * 把一条 candidate 转成可直接渲染的题目对象。
 *
 * @param {string} typeKey - 当前题型 key。
 * @param {object} candidate - 被选中用于出下一题的 candidate。
 * @param {object[]} pool - 当前题型的完整 candidate 池。
 * @returns {{
 *   type: string,
 *   label: string,
 *   prompt: string,
 *   choices: Array<string|number>,
 *   correctIndex: number,
 *   candidate: object
 * }} 可直接用于渲染的完整题目对象。
 */
function createQuestion(typeKey, candidate, pool) {
  const questionType = QUESTION_TYPES[typeKey];
  const choices = questionType.buildChoices(candidate, pool);
  return {
    type: typeKey,
    label: questionType.label,
    prompt: questionType.buildPrompt(candidate, pool),
    choices,
    correctIndex: choices.indexOf(candidate.answerValue),
    candidate,
  };
}

/**
 * 按题型随机抽取下一题来源，尽量避免与上一题完全重复。
 *
 * @returns {{ typeKey: string, candidate: object }|null} 下一题的题型与 candidate。
 */
function pickNextCandidate() {
  const availableTypeKeys = state.questionTypeKeys.filter((typeKey) => {
    return (state.candidatePoolsByType[typeKey] || []).length > 0;
  });

  if (availableTypeKeys.length === 0) {
    return null;
  }

  const typeKey = availableTypeKeys[Math.floor(Math.random() * availableTypeKeys.length)];
  const pool = state.candidatePoolsByType[typeKey];
  const filtered = pool.filter((candidate) => candidate.id !== state.lastQuestionId);
  const source = filtered.length > 0 ? filtered : pool;
  const candidate = source[Math.floor(Math.random() * source.length)];

  return { typeKey, candidate };
}
