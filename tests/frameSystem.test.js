import { describe, it, expect } from 'vitest';
import {
  BASE_SUPPLIER_FRAME_SCHEMA,
  createSupplierFrame,
  updateFrameSlot
} from '../src/algorithms/frameSystem';

describe('Frame Representation System', () => {
  const sampleSupplier = {
    id: "sup-99",
    name: "Apex Precision Motors",
    product: "Electric Actuators",
    cost: 48000,
    quality: 94,
    deliveryTime: 4,
    reliability: 95,
    capacity: 1500
  };

  it('instantiates a valid supplier frame with all schema slots', () => {
    const frame = createSupplierFrame(sampleSupplier);
    expect(frame.frameId).toBe("frame-sup-99");
    expect(frame.isA).toBe("GenericSupplierFrame");
    expect(frame.slots.name.value).toBe("Apex Precision Motors");
    expect(frame.slots.cost.value).toBe(48000);
    expect(frame.isValid).toBe(true);
  });

  it('executes if-needed demon to derive unassigned risk level', () => {
    // When riskLevel is absent, demon computes from quality (94) & reliability (95) -> "Low"
    const frame = createSupplierFrame(sampleSupplier);
    expect(frame.slots.riskLevel.value).toBe("Low");

    // Substandard supplier
    const riskySupplier = {
      id: "sup-risk",
      name: "Risky Parts",
      product: "Bolts",
      cost: 20000,
      quality: 70,
      deliveryTime: 10,
      reliability: 65,
      capacity: 500
    };
    const riskyFrame = createSupplierFrame(riskySupplier);
    expect(riskyFrame.slots.riskLevel.value).toBe("High");
  });

  it('enforces range constraints and reports validation errors', () => {
    const invalidSupplier = {
      id: "sup-err",
      name: "Out of Bounds Vendor",
      product: "Steel",
      cost: -500, // Invalid: range is [1000, 1000000]
      quality: 150, // Invalid: range is [0, 100]
      deliveryTime: 0, // Invalid: range is [1, 60]
      reliability: 90,
      capacity: 1000
    };
    const frame = createSupplierFrame(invalidSupplier);
    expect(frame.isValid).toBe(false);
    expect(frame.validationErrors.length).toBeGreaterThanOrEqual(2);
  });

  it('updates slot values and re-triggers procedural demons dynamically', () => {
    const frame = createSupplierFrame(sampleSupplier);
    expect(frame.slots.riskLevel.value).toBe("Low");

    // Degrade quality slot to 60
    const updated = updateFrameSlot(frame, "quality", 60);
    expect(updated.slots.quality.value).toBe(60);
    // Demon should recalculate riskLevel to "High"
    expect(updated.slots.riskLevel.value).toBe("High");
  });
});

