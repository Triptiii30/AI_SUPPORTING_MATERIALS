/**
 * Frame Representation System
 * Implements Minsky's Frame Theory: Slots, Facets (value, default, type, range),
 * Procedural Attachments (if-needed demons, if-added demons), and Inheritance.
 */

export const BASE_SUPPLIER_FRAME_SCHEMA = {
  frameName: "GenericSupplierFrame",
  parentFrame: null,
  description: "Root prototype schema defining fundamental supplier slots, default values, and demons.",
  slots: {
    name: {
      facetType: "String",
      required: true,
      defaultValue: "Unnamed Supplier",
      description: "Legal entity registered name"
    },
    product: {
      facetType: "String",
      required: true,
      defaultValue: "General Industrial Goods",
      description: "Primary product category supplied"
    },
    cost: {
      facetType: "Currency (INR)",
      required: true,
      defaultValue: 50000,
      range: [1000, 1000000],
      description: "Unit contract quote in Indian Rupees"
    },
    quality: {
      facetType: "Percentage",
      required: true,
      defaultValue: 85,
      range: [0, 100],
      description: "QA inspection compliance score"
    },
    deliveryTime: {
      facetType: "Integer (Days)",
      required: true,
      defaultValue: 5,
      range: [1, 60],
      description: "Order dispatch and transit lead time"
    },
    reliability: {
      facetType: "Percentage",
      required: true,
      defaultValue: 85,
      range: [0, 100],
      description: "Contractual SLA adherence historical rate"
    },
    capacity: {
      facetType: "Integer (Units)",
      required: true,
      defaultValue: 1000,
      range: [10, 50000],
      description: "Maximum monthly batch capacity"
    },
    riskLevel: {
      facetType: "Categorical",
      allowedValues: ["Low", "Medium", "High"],
      demon: {
        type: "if-needed",
        description: "Procedural demon: dynamically derives Risk Level if absent from Quality & Reliability",
        compute: (slots) => {
          const q = slots.quality ?? 85;
          const r = slots.reliability ?? 85;
          if (q >= 90 && r >= 90) return "Low";
          if (q < 82 || r < 80) return "High";
          return "Medium";
        }
      }
    },
    costEfficiencyIndex: {
      facetType: "Derived Float",
      demon: {
        type: "if-needed",
        description: "Procedural demon: computes unit cost per capacity efficiency",
        compute: (slots) => {
          const cost = slots.cost || 50000;
          const cap = slots.capacity || 1000;
          return Number((cost / cap).toFixed(2));
        }
      }
    }
  }
};

/**
 * Creates an instantiated Frame for a specific supplier object
 */
export function createSupplierFrame(supplier, schema = BASE_SUPPLIER_FRAME_SCHEMA) {
  if (!supplier) return null;

  const slotInstances = {};
  const validationErrors = [];

  // Populate slots from supplier or default
  Object.keys(schema.slots).forEach(slotKey => {
    const slotDef = schema.slots[slotKey];
    let val = supplier[slotKey];

    // Apply default if undefined
    if (val === undefined || val === null || val === "") {
      if (slotDef.demon && slotDef.demon.type === "if-needed") {
        val = slotDef.demon.compute(supplier);
      } else if (slotDef.defaultValue !== undefined) {
        val = slotDef.defaultValue;
      }
    }

    // Range / Constraint checking
    if (slotDef.range && typeof val === "number") {
      const [min, max] = slotDef.range;
      if (val < min || val > max) {
        validationErrors.push(`Slot "${slotKey}" value ${val} outside valid constraint range [${min}, ${max}]`);
      }
    }

    if (slotDef.allowedValues && !slotDef.allowedValues.includes(val)) {
      // Execute demon fallback
      if (slotDef.demon) {
        val = slotDef.demon.compute(supplier);
      }
    }

    slotInstances[slotKey] = {
      name: slotKey,
      value: val,
      facetType: slotDef.facetType,
      demonAttached: Boolean(slotDef.demon),
      demonDescription: slotDef.demon ? slotDef.demon.description : null,
      range: slotDef.range || null,
      description: slotDef.description
    };
  });

  return {
    frameId: `frame-${supplier.id || supplier.name}`,
    frameName: `Frame: ${supplier.name}`,
    isA: schema.frameName,
    supplierId: supplier.id,
    slots: slotInstances,
    validationErrors,
    isValid: validationErrors.length === 0
  };
}

/**
 * Update a slot value in a frame and trigger demons
 */
export function updateFrameSlot(frame, slotKey, newValue, schema = BASE_SUPPLIER_FRAME_SCHEMA) {
  const updatedSlots = { ...frame.slots };
  const slotDef = schema.slots[slotKey];

  if (!slotDef) {
    throw new Error(`Unknown slot: ${slotKey}`);
  }

  // Type coercion
  let parsedValue = newValue;
  if (slotDef.facetType.includes("Integer") || slotDef.facetType.includes("Percentage") || slotDef.facetType.includes("Currency")) {
    parsedValue = Number(newValue);
  }

  updatedSlots[slotKey] = {
    ...updatedSlots[slotKey],
    value: parsedValue
  };

  // Re-trigger procedural attachments
  const plainValues = {};
  Object.keys(updatedSlots).forEach(k => {
    plainValues[k] = updatedSlots[k].value;
  });

  if (schema.slots.riskLevel.demon) {
    updatedSlots.riskLevel.value = schema.slots.riskLevel.demon.compute(plainValues);
  }
  if (schema.slots.costEfficiencyIndex.demon) {
    updatedSlots.costEfficiencyIndex.value = schema.slots.costEfficiencyIndex.demon.compute(plainValues);
  }

  return {
    ...frame,
    slots: updatedSlots
  };
}

