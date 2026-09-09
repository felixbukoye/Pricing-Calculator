export interface MaterialItem {
  id: string;
  name: string;
  quantityPurchased: number | '';
  unit: string;
  purchasePrice: number | '';
  quantityUsed: number | '';
}

export interface PackagingItem {
  id: string;
  name: string;
  quantityPurchased: number | '';
  unit: string;
  purchasePrice: number | '';
  quantityUsedPerProduct: number | '';
}

export type LabourType = 'time-based' | 'fixed';

export interface LabourConfig {
  type: LabourType;
  hoursSpent: number | '';
  hourlyRate: number | '';
  fixedCostPerUnit: number | '';
}

export interface OverheadExpenseItem {
  id: string;
  name: string;
  amount: number | '';
}

export type OverheadMode = 'itemized' | 'single';

export interface OverheadConfig {
  mode: OverheadMode;
  singleMonthlyAmount: number | '';
  items: OverheadExpenseItem[];
  expectedMonthlyUnits: number | '';
}

export type PricingMethod = 'markup' | 'margin' | 'custom';

export interface PricingConfig {
  desiredMarkupPercent: number | '';
  desiredMarginPercent: number | '';
  selectedMethod: PricingMethod;
  customSellingPrice: number | '';
}

export type SellingCostType = 'percentage' | 'fixed';

export interface SellingCostItem {
  id: string;
  name: string;
  type: SellingCostType;
  value: number | '';
}

export interface DiscountConfig {
  testDiscountPercent: number | '';
}

export interface CalculationResults {
  // Batch & Unit counts
  batchUnits: number;

  // Section 2: Materials
  totalMaterialCostBatch: number;
  materialCostPerUnit: number;

  // Section 3: Packaging
  totalPackagingCostPerUnit: number;

  // Section 4: Labour
  totalLabourCostBatch: number;
  labourCostPerUnit: number;

  // Section 5: Overhead
  totalMonthlyOverhead: number;
  overheadPerUnit: number;

  // Section 6: True Cost
  trueCostPerUnit: number;

  // Section 7: Pricing Calculations
  markupScenario: {
    sellingPrice: number;
    profit: number;
    realizedMargin: number; // profit / sellingPrice
  };
  marginScenario: {
    sellingPrice: number;
    profit: number;
    realizedMargin: number; // profit / sellingPrice
  };
  customScenario: {
    sellingPrice: number;
    profit: number;
    realizedMargin: number;
    impliedMarkup: number;
  };

  // Active chosen selling price
  activeSellingPrice: number;
  activeGrossProfit: number;
  activeGrossMargin: number;

  // Section 8: Selling Costs
  sellingCostsBreakdown: {
    id: string;
    name: string;
    type: SellingCostType;
    rateOrFixed: number;
    calculatedAmount: number;
  }[];
  totalSellingCostsPerUnit: number;
  netProfitPerUnit: number;
  netProfitMargin: number; // netProfit / activeSellingPrice

  // Minimum viable price
  unavoidableSellingCosts: number;
  minimumViablePrice: number;
  isBelowTrueCost: boolean;
  isBelowMinimumViablePrice: boolean;

  // Section 9: Discount Testing
  discountPercent: number;
  discountedPrice: number;
  discountedSellingCosts: number;
  profitAfterDiscount: number;
  marginAfterDiscount: number;
  isDiscountBelowTrueCost: boolean;
  isDiscountBelowMinimumViablePrice: boolean;
}

export interface BusinessPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  productName: string;
  batchUnits: number;
  materials: MaterialItem[];
  packaging: PackagingItem[];
  labour: LabourConfig;
  overhead: OverheadConfig;
  pricing: PricingConfig;
  sellingCosts: SellingCostItem[];
  discount: DiscountConfig;
}

export interface UserAccountInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  creationTime?: string;
  lastSignInTime?: string;
}

export interface UserUploadedFile {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath?: string;
  downloadUrl?: string;
  dataUrl?: string;
  uploadDate: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SavedCalculationRecord {
  id: string;
  userId: string;
  productName: string;
  batchUnits: number;
  trueCostPerUnit: number;
  activeSellingPrice: number;
  payloadJson: string;
  createdAt: string;
  updatedAt?: string;
}
