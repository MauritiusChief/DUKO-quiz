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

/**
 * 把尺寸值转换成完整型号中使用的字符串片段。
 *
 * 当尺寸是 0 到 9 的整数时，会补零成两位数，
 * 这样才能生成 `B09`、`W0915` 这类符合规则的型号编码。
 * 其他值则直接转成字符串后保留原样。
 *
 * @param {number|string} value - 某个尺寸值，例如 width 或 height。
 * @returns {string} 可用于拼接型号编码的尺寸字符串。
 */
function formatDimensionValue(value) {
  if (Number.isInteger(value) && value >= 0 && value < 10) {
    return String(value).padStart(2, "0");
  }
  return String(value);
}

/**
 * 生成题目中展示的完整型号编码。
 *
 * 型号由以下几部分组成：
 * 1. 根部 type，例如 `B` 或 `W`
 * 2. `typeCodeKeys` 指定顺序的尺寸值
 * 3. 可选后缀，例如 `F` 或 `-2`
 *
 * @param {string} baseType - 原始数据中的根部 type。
 * @param {string[]} typeCodeKeys - 参与型号编码的尺寸字段，且顺序固定。
 * @param {Record<string, number|string>} dimensions - 当前具体组合下的尺寸对象。
 * @param {string} [suffix=""] - 需要附加到型号末尾的后缀。
 * @returns {string} 完整型号，例如 `B09F`。
 */
function buildFullType(baseType, typeCodeKeys, dimensions, suffix = "") {
  const code = (typeCodeKeys || [])
    .map((key) => formatDimensionValue(dimensions[key]))
    .join("");
  return `${baseType}${code}${suffix || ""}`;
}

/**
 * 生成所有可能的尺寸组合。
 *
 * 例如：
 * `{ width: [9, 12], height: [15, 30] }`
 * 会展开成：
 * `[{ width: 9, height: 15 }, { width: 9, height: 30 }, ...]`
 *
 * 这样后续就能逐个判断每个具体组合会命中哪些 detail 和 variant 规则。
 *
 * @param {Record<string, Array<number|string>>} dimensionMap - 以字段名分组的尺寸数组。
 * @returns {Array<Record<string, number|string>>} 所有具体尺寸组合。
 */
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

/**
 * 找出原始数据项里哪些字段是真正需要展开的尺寸字段。
 *
 * 像 `type_code` 这种虽然也是数组，但它描述的是编码规则，
 * 不是实际尺寸选项，所以这里要排除掉。
 *
 * @param {Record<string, unknown>} item - 一条顶层原始数据。
 * @returns {string[]} 需要展开的尺寸字段，例如 `width`、`height`、`depth`。
 */
function getDimensionKeys(item) {
  return Object.keys(item).filter((key) => Array.isArray(item[key]) && !META_KEYS.has(key));
}

/**
 * 判断某个具体尺寸组合是否满足一条规则。
 *
 * 规则中像 `width: [30, 36]` 这样的数组字段表示匹配条件；
 * 不是数组的字段则代表输出信息，这里不参与匹配判断。
 *
 * @param {Record<string, number|string>} dimensions - 一个具体的尺寸组合。
 * @param {Record<string, unknown>} conditions - 一条 detail 或 variant 规则。
 * @returns {boolean} 当所有数组条件都满足时返回 true。
 */
function matchesConditions(dimensions, conditions) {
  return Object.entries(conditions).every(([key, values]) => {
    if (!Array.isArray(values)) {
      return true;
    }
    return values.includes(dimensions[key]);
  });
}

/**
 * 从 detail 或 variant 规则里提取“结果字段”。
 *
 * 像 `name_suffix`、`type_suffix`、`allow_variant` 以及数组形式的匹配条件，
 * 都不属于最终题目要考的事实，因此这里会剔除掉。
 * 返回的内容只保留类似 `drawer: 2` 这种真正描述结果的信息。
 *
 * @param {Record<string, unknown>} rule - 一条 detail 或 variant 规则。
 * @returns {Record<string, unknown>} 去掉元信息后的结果字段。
 */
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

/**
 * 把 variant 定义整理成统一可遍历的结构。
 *
 * 即使某条数据没有 `variant`，这里也会补一个默认项，
 * 这样后面的流程就不需要区分“有 variant”还是“没有 variant”。
 *
 * @param {Record<string, unknown>} item - 一条顶层原始数据。
 * @returns {Array<{ key: string, rule: Record<string, unknown> }>} 可统一处理的 variant 列表。
 */
function getVariantEntries(item) {
  const variants = item.variant || {};
  const entries = Object.entries(variants);
  if (entries.length === 0) {
    return [{ key: "default", rule: {} }];
  }
  return entries.map(([key, rule]) => ({ key, rule }));
}

/**
 * 把命中的 detail 规则拆成正向规则和 `not_exist` 规则。
 *
 * 正向规则会提供像 drawer、door、shelves 这样的知识点；
 * `not_exist` 规则表示某些尺寸组合本来就不存在。
 * 现在这一版 quiz 主要使用正向数值信息，但先把两类分开，
 * 后续扩展题型时会更清楚。
 *
 * @param {Record<string, unknown>} item - 一条顶层原始数据。
 * @param {Record<string, number|string>} dimensions - 一个具体的尺寸组合。
 * @returns {{ positive: Array<{ key: string, rule: Record<string, unknown> }>, negative: Array<{ key: string, rule: Record<string, unknown> }> }}
 * 按语义拆分后的 detail 规则。
 */
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

/**
 * 把层级化的原始 cabinet 数据展开成扁平的 quiz 候选题列表。
 *
 * 原始数据结构是这样的：
 * 一个 base type 下面挂着尺寸、可选 variant、可选 detail。
 * 但 quiz 需要的结构正好相反：
 * 每一条候选题都应该只代表一个可以直接提问的事实。
 *
 * 这个函数的主要流程是：
 * 1. 把每个 cabinet type 展开成具体尺寸组合
 * 2. 套用匹配到的 detail 和 variant 规则
 * 3. 生成最终完整型号
 * 4. 把每个可考的数值事实输出成一条 candidate
 *
 * @param {Record<string, Record<string, unknown>>} rawData - 完整原始数据集。
 * @returns {Array<{
 *   id: string,
 *   baseType: string,
 *   fullType: string,
 *   displayName: string,
 *   detailKey: string,
 *   answerValue: number,
 *   dimensions: Record<string, number|string>,
 *   context: string,
 *   tags: string
 * }>} 可直接用于出题的扁平候选列表。
 */
function normalizeData(rawData) {
  const candidates = [];

  for (const [baseType, item] of Object.entries(rawData)) {
    const baseDimensionKeys = getDimensionKeys(item);
    const dimensionSource = {};

    // 只拷贝真正的尺寸数组，用来枚举所有具体 cabinet 实例。
    for (const key of baseDimensionKeys) {
      dimensionSource[key] = item[key];
    }

    const dimensionCombos = cartesianProduct(dimensionSource);
    const typeCodeKeys = item.type_code || [];
    const variantEntries = getVariantEntries(item);

    for (const dimensions of dimensionCombos) {
      const applicableDetails = collectApplicableDetails(item, dimensions);

      for (const variantEntry of variantEntries) {
        // 某些 variant 只允许出现在特定尺寸下，例如只允许某些 width。
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

        // 把所有命中的正向 detail 规则合并到当前 cabinet 实例上。
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

        // 所有 suffix/type 调整完成后，再生成最终完整型号。
        const fullType = buildFullType(effectiveType, typeCodeKeys, dimensions, suffix);

        // 只把没有编码进型号里的尺寸显示到上下文中，避免重复。
        for (const key of Object.keys(dimensions)) {
          if (!typeCodeKeys.includes(key)) {
            contextParts.push(`${key} ${dimensions[key]}`);
          }
        }

        // variant 也可能带来额外上下文，但这里要避免把答案本身提前暴露出来。
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

        // 每个数值事实都单独输出成一条 candidate，后面才好一题一题地出。
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

  // 不同规则路径有时会落到同一条题目上，这里按 id 去重。
  return candidates.filter((candidate, index, list) => {
    return list.findIndex((other) => other.id === candidate.id) === index;
  });
}
