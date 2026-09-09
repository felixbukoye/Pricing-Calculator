import {
  CalculationResults,
  DiscountConfig,
  LabourConfig,
  MaterialItem,
  OverheadConfig,
  PackagingItem,
  PricingConfig,
  SellingCostItem,
} from '../types';
import { parseNum } from './formatters';

export function calculateAll(
  batchUnitsInput: number | '',
  materials: MaterialItem[],
  packaging: PackagingItem[],
  labour: LabourConfig,
  overhead: OverheadConfig,
  pricing: PricingConfig,
  sellingCosts: SellingCostItem[],
  discount: DiscountConfig,
): CalculationResults {
  const batchUnits = Math.max(1, parseNum(batchUnitsInput, 1));

  // Section 2: Material/Item cost used
  // Cost Used = (Purchase Price ÷ Quantity Purchased) × Quantity Used
  let totalMaterialCostBatch = 0;
  for (const item of materials) {
    const qtyPurchased = parseNum(item.quantityPurchased, 0);
    const purchasePrice = parseNum(item.purchasePrice, 0);
    const qtyUsed = parseNum(item.quantityUsed, 0);

    if (qtyPurchased > 0 && purchasePrice > 0 && qtyUsed > 0) {
      const costUsed = (purchasePrice / qtyPurchased) * qtyUsed;
      totalMaterialCostBatch += costUsed;
    }
  }
  const materialCostPerUnit = totalMaterialCostBatch / batchUnits;

  // Section 3: Packaging cost per unit
  // Cost Per Unit = (Purchase Price ÷ Quantity Purchased) × Quantity Used Per Product
  let totalPackagingCostPerUnit = 0;
  for (const item of packaging) {
    const qtyPurchased = parseNum(item.quantityPurchased, 0);
    const purchasePrice = parseNum(item.purchasePrice, 0);
    const qtyUsedPerProduct = parseNum(item.quantityUsedPerProduct, 0);

    if (qtyPurchased > 0 && purchasePrice > 0 && qtyUsedPerProduct > 0) {
      const costPerUnit = (purchasePrice / qtyPurchased) * qtyUsedPerProduct;
      totalPackagingCostPerUnit += costPerUnit;
    }
  }

  // Section 4: Labour cost
  let totalLabourCostBatch = 0;
  let labourCostPerUnit = 0;

  if (labour.type === 'time-based') {
    const hoursSpent = parseNum(labour.hoursSpent, 0);
    const hourlyRate = parseNum(labour.hourlyRate, 0);
    totalLabourCostBatch = hoursSpent * hourlyRate;
    labourCostPerUnit = totalLabourCostBatch / batchUnits;
  } else {
    // Fixed cost per unit
    labourCostPerUnit = parseNum(labour.fixedCostPerUnit, 0);
    totalLabourCostBatch = labourCostPerUnit * batchUnits;
  }

  // Section 5: Overhead allocation
  // Overhead Per Unit = Total Monthly Overhead ÷ Expected Monthly Units Produced
  let totalMonthlyOverhead = 0;
  if (overhead.mode === 'itemized') {
    for (const item of overhead.items) {
      totalMonthlyOverhead += parseNum(item.amount, 0);
    }
  } else {
    totalMonthlyOverhead = parseNum(overhead.singleMonthlyAmount, 0);
  }

  const expectedMonthlyUnits = Math.max(1, parseNum(overhead.expectedMonthlyUnits, 1));
  const overheadPerUnit = totalMonthlyOverhead / expectedMonthlyUnits;

  // Section 6: True cost per unit
  // True Cost = Material Cost + Packaging Cost + Labour Cost + Overhead Per Unit
  const trueCostPerUnit =
    materialCostPerUnit +
    totalPackagingCostPerUnit +
    labourCostPerUnit +
    overheadPerUnit;

  // Section 7: Pricing Scenarios
  // Markup formula: Selling Price = True Cost × (1 + Markup %)
  const markupPercent = parseNum(pricing.desiredMarkupPercent, 0) / 100;
  const markupSellingPrice = trueCostPerUnit > 0 ? trueCostPerUnit * (1 + markupPercent) : 0;
  const markupProfit = markupSellingPrice - trueCostPerUnit;
  const markupRealizedMargin = markupSellingPrice > 0 ? markupProfit / markupSellingPrice : 0;

  // Margin formula: Selling Price = True Cost ÷ (1 − Margin %)
  const marginPercent = Math.min(0.99, Math.max(0, parseNum(pricing.desiredMarginPercent, 0) / 100));
  const marginSellingPrice =
    trueCostPerUnit > 0 && marginPercent < 1
      ? trueCostPerUnit / (1 - marginPercent)
      : 0;
  const marginProfit = marginSellingPrice - trueCostPerUnit;
  const marginRealizedMargin = marginSellingPrice > 0 ? marginProfit / marginSellingPrice : 0;

  // Custom Scenario (if user directly entered a target price)
  const customPrice = parseNum(pricing.customSellingPrice, 0);
  const customProfit = customPrice - trueCostPerUnit;
  const customRealizedMargin = customPrice > 0 ? customProfit / customPrice : 0;
  const customImpliedMarkup = trueCostPerUnit > 0 ? (customPrice - trueCostPerUnit) / trueCostPerUnit : 0;

  // Active selling price chosen
  let activeSellingPrice = 0;
  if (pricing.selectedMethod === 'markup') {
    activeSellingPrice = markupSellingPrice;
  } else if (pricing.selectedMethod === 'margin') {
    activeSellingPrice = marginSellingPrice;
  } else {
    activeSellingPrice = customPrice > 0 ? customPrice : marginSellingPrice;
  }

  const activeGrossProfit = activeSellingPrice - trueCostPerUnit;
  const activeGrossMargin = activeSellingPrice > 0 ? activeGrossProfit / activeSellingPrice : 0;

  // Section 8: Selling Costs (payment fees, commission, delivery subsidy)
  // Fee Amount (if %) = Selling Price × Fee %
  // Net Profit = Selling Price − True Cost − Sum of Selling Costs
  let totalSellingCostsPerUnit = 0;
  let totalPercentageFeeRate = 0;
  let totalFixedSellingCosts = 0;

  const sellingCostsBreakdown = sellingCosts.map((cost) => {
    const val = parseNum(cost.value, 0);
    let amount = 0;
    if (cost.type === 'percentage') {
      const rate = val / 100;
      totalPercentageFeeRate += rate;
      amount = activeSellingPrice * rate;
    } else {
      totalFixedSellingCosts += val;
      amount = val;
    }
    totalSellingCostsPerUnit += amount;
    return {
      id: cost.id,
      name: cost.name,
      type: cost.type,
      rateOrFixed: val,
      calculatedAmount: amount,
    };
  });

  const netProfitPerUnit = activeSellingPrice - trueCostPerUnit - totalSellingCostsPerUnit;
  const netProfitMargin = activeSellingPrice > 0 ? netProfitPerUnit / activeSellingPrice : 0;

  // Minimum Viable Price:
  // Price required so that Net Profit >= 0
  // Net Profit = P - TrueCost - (P * rate + fixedCosts) = P * (1 - rate) - (TrueCost + fixedCosts) = 0
  // P = (TrueCost + fixedCosts) / (1 - rate)
  const rateClamped = Math.min(0.95, totalPercentageFeeRate);
  const minimumViablePrice =
    rateClamped < 1
      ? (trueCostPerUnit + totalFixedSellingCosts) / (1 - rateClamped)
      : trueCostPerUnit + totalSellingCostsPerUnit;

  const isBelowTrueCost = activeSellingPrice > 0 && activeSellingPrice < trueCostPerUnit;
  const isBelowMinimumViablePrice =
    activeSellingPrice > 0 && activeSellingPrice < minimumViablePrice - 0.01;

  // Section 9: Discount Testing
  const discountPercent = Math.max(0, Math.min(100, parseNum(discount.testDiscountPercent, 0)));
  const discountedPrice = activeSellingPrice * (1 - discountPercent / 100);

  // Recalculate selling costs at the discounted price (since percentage fees drop with lower selling price)
  let discountedSellingCosts = 0;
  for (const cost of sellingCosts) {
    const val = parseNum(cost.value, 0);
    if (cost.type === 'percentage') {
      discountedSellingCosts += discountedPrice * (val / 100);
    } else {
      discountedSellingCosts += val;
    }
  }

  const profitAfterDiscount = discountedPrice - trueCostPerUnit - discountedSellingCosts;
  const marginAfterDiscount = discountedPrice > 0 ? profitAfterDiscount / discountedPrice : 0;
  const isDiscountBelowTrueCost = discountedPrice > 0 && discountedPrice < trueCostPerUnit;
  const isDiscountBelowMinimumViablePrice =
    discountedPrice > 0 && discountedPrice < minimumViablePrice - 0.01;

  return {
    batchUnits,
    totalMaterialCostBatch,
    materialCostPerUnit,
    totalPackagingCostPerUnit,
    totalLabourCostBatch,
    labourCostPerUnit,
    totalMonthlyOverhead,
    overheadPerUnit,
    trueCostPerUnit,
    markupScenario: {
      sellingPrice: markupSellingPrice,
      profit: markupProfit,
      realizedMargin: markupRealizedMargin,
    },
    marginScenario: {
      sellingPrice: marginSellingPrice,
      profit: marginProfit,
      realizedMargin: marginRealizedMargin,
    },
    customScenario: {
      sellingPrice: customPrice,
      profit: customProfit,
      realizedMargin: customRealizedMargin,
      impliedMarkup: customImpliedMarkup,
    },
    activeSellingPrice,
    activeGrossProfit,
    activeGrossMargin,
    sellingCostsBreakdown,
    totalSellingCostsPerUnit,
    netProfitPerUnit,
    netProfitMargin,
    unavoidableSellingCosts: totalSellingCostsPerUnit,
    minimumViablePrice,
    isBelowTrueCost,
    isBelowMinimumViablePrice,
    discountPercent,
    discountedPrice,
    discountedSellingCosts,
    profitAfterDiscount,
    marginAfterDiscount,
    isDiscountBelowTrueCost,
    isDiscountBelowMinimumViablePrice,
  };
}
