import React, { useState, useMemo, useRef } from 'react';
import {
  MaterialItem,
  PackagingItem,
  LabourConfig,
  OverheadConfig,
  PricingConfig,
  SellingCostItem,
  DiscountConfig,
  BusinessPreset,
} from './types';
import { BUSINESS_PRESETS } from './data/presets';
import { calculateAll } from './utils/calculations';
import { Header } from './components/Header';
import { InstructionsPanel } from './components/InstructionsPanel';
import { StickySummaryBar } from './components/StickySummaryBar';
import { Section1ProductInfo } from './components/Section1ProductInfo';
import { Section2Materials } from './components/Section2Materials';
import { Section3Packaging } from './components/Section3Packaging';
import { Section4Labour } from './components/Section4Labour';
import { Section5Overhead } from './components/Section5Overhead';
import { Section6TrueCostSummary } from './components/Section6TrueCostSummary';
import { Section7Pricing } from './components/Section7Pricing';
import { Section8SellingCosts } from './components/Section8SellingCosts';
import { Section9FinalDashboard } from './components/Section9FinalDashboard';
import { PrintSummarySheet } from './components/PrintSummarySheet';
import { ExecutiveMetricStrip } from './components/ExecutiveMetricStrip';
import { DashboardNavBar, DashboardTabId } from './components/DashboardNavBar';
import { DashboardStepFooter } from './components/DashboardStepFooter';

export default function App() {
  const initialPreset = BUSINESS_PRESETS[0];

  const [activePresetId, setActivePresetId] = useState<string | null>(initialPreset.id);
  const [productName, setProductName] = useState<string>(initialPreset.productName);
  const [batchUnits, setBatchUnits] = useState<number | ''>(initialPreset.batchUnits);
  const [materials, setMaterials] = useState<MaterialItem[]>(initialPreset.materials);
  const [packaging, setPackaging] = useState<PackagingItem[]>(initialPreset.packaging);
  const [labour, setLabour] = useState<LabourConfig>(initialPreset.labour);
  const [overhead, setOverhead] = useState<OverheadConfig>(initialPreset.overhead);
  const [pricing, setPricing] = useState<PricingConfig>(initialPreset.pricing);
  const [sellingCosts, setSellingCosts] = useState<SellingCostItem[]>(initialPreset.sellingCosts);
  const [discount, setDiscount] = useState<DiscountConfig>(initialPreset.discount);

  // UI state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTabId>('1');

  // Section reference for quick scroll
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const dashboardContentRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Live calculations
  const results = useMemo(() => {
    return calculateAll(
      batchUnits,
      materials,
      packaging,
      labour,
      overhead,
      pricing,
      sellingCosts,
      discount
    );
  }, [batchUnits, materials, packaging, labour, overhead, pricing, sellingCosts, discount]);

  // Handlers for Preset and Reset
  const handleSelectPreset = (preset: BusinessPreset) => {
    setActivePresetId(preset.id);
    setProductName(preset.productName);
    setBatchUnits(preset.batchUnits);
    setMaterials(JSON.parse(JSON.stringify(preset.materials)));
    setPackaging(JSON.parse(JSON.stringify(preset.packaging)));
    setLabour(JSON.parse(JSON.stringify(preset.labour)));
    setOverhead(JSON.parse(JSON.stringify(preset.overhead)));
    setPricing(JSON.parse(JSON.stringify(preset.pricing)));
    setSellingCosts(JSON.parse(JSON.stringify(preset.sellingCosts)));
    setDiscount(JSON.parse(JSON.stringify(preset.discount)));
  };

  const handleReset = () => {
    setActivePresetId(null);
    setProductName('');
    setBatchUnits(1);
    setMaterials([
      {
        id: `mat-${Date.now()}-1`,
        name: '',
        quantityPurchased: '',
        unit: 'pcs',
        purchasePrice: '',
        quantityUsed: '',
      },
    ]);
    setPackaging([
      {
        id: `pkg-${Date.now()}-1`,
        name: '',
        quantityPurchased: '',
        unit: 'pcs',
        purchasePrice: '',
        quantityUsedPerProduct: 1,
      },
    ]);
    setLabour({
      type: 'time-based',
      hoursSpent: '',
      hourlyRate: '',
      fixedCostPerUnit: '',
    });
    setOverhead({
      mode: 'itemized',
      singleMonthlyAmount: '',
      items: [
        { id: `ovh-${Date.now()}-1`, name: 'Generator fuel & power', amount: '' },
        { id: `ovh-${Date.now()}-2`, name: 'Store/studio rent', amount: '' },
      ],
      expectedMonthlyUnits: 50,
    });
    setPricing({
      selectedMethod: 'markup',
      desiredMarkupPercent: 50,
      desiredMarginPercent: 35,
      customSellingPrice: '',
    });
    setSellingCosts([
      {
        id: `sc-${Date.now()}-1`,
        name: 'Payment Processing (Paystack)',
        type: 'percentage',
        value: 1.5,
      },
    ]);
    setDiscount({
      testDiscountPercent: 10,
    });
  };

  // Section 2 Materials handlers
  const handleUpdateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setActivePresetId(null);
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddMaterial = () => {
    setActivePresetId(null);
    setMaterials((prev) => [
      ...prev,
      {
        id: `mat-${Date.now()}`,
        name: '',
        quantityPurchased: '',
        unit: 'pcs',
        purchasePrice: '',
        quantityUsed: '',
      },
    ]);
  };

  const handleRemoveMaterial = (id: string) => {
    setActivePresetId(null);
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  // Section 3 Packaging handlers
  const handleUpdatePackaging = (id: string, field: keyof PackagingItem, value: any) => {
    setActivePresetId(null);
    setPackaging((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddPackaging = () => {
    setActivePresetId(null);
    setPackaging((prev) => [
      ...prev,
      {
        id: `pkg-${Date.now()}`,
        name: '',
        quantityPurchased: '',
        unit: 'pcs',
        purchasePrice: '',
        quantityUsedPerProduct: 1,
      },
    ]);
  };

  const handleRemovePackaging = (id: string) => {
    setActivePresetId(null);
    setPackaging((prev) => prev.filter((item) => item.id !== id));
  };

  // Section 4 Labour handlers
  const handleUpdateLabour = (field: keyof LabourConfig, value: any) => {
    setActivePresetId(null);
    setLabour((prev) => ({ ...prev, [field]: value }));
  };

  // Section 5 Overhead handlers
  const handleUpdateOverhead = (field: keyof OverheadConfig, value: any) => {
    setActivePresetId(null);
    setOverhead((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOverheadItem = () => {
    setActivePresetId(null);
    setOverhead((prev) => ({
      ...prev,
      items: [...prev.items, { id: `ovh-${Date.now()}`, name: '', amount: '' }],
    }));
  };

  const handleUpdateOverheadItem = (
    id: string,
    field: keyof OverheadConfig['items'][0],
    value: any
  ) => {
    setActivePresetId(null);
    setOverhead((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const handleRemoveOverheadItem = (id: string) => {
    setActivePresetId(null);
    setOverhead((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Section 7 Pricing handlers
  const handleUpdatePricing = (field: keyof PricingConfig, value: any) => {
    setActivePresetId(null);
    setPricing((prev) => ({ ...prev, [field]: value }));
  };

  // Section 8 Selling Costs handlers
  const handleUpdateSellingCost = (id: string, field: keyof SellingCostItem, value: any) => {
    setActivePresetId(null);
    setSellingCosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddSellingCost = () => {
    setActivePresetId(null);
    setSellingCosts((prev) => [
      ...prev,
      {
        id: `sc-${Date.now()}`,
        name: '',
        type: 'percentage',
        value: '',
      },
    ]);
  };

  const handleRemoveSellingCost = (id: string) => {
    setActivePresetId(null);
    setSellingCosts((prev) => prev.filter((item) => item.id !== id));
  };

  // Section 9 Discount handlers
  const handleChangeDiscount = (value: number | '') => {
    setDiscount({ testDiscountPercent: value });
  };

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  // Scroll helpers
  const handleScrollToPricing = () => {
    if (activeTab === 'all') {
      pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('7');
      dashboardContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tabId: DashboardTabId) => {
    setActiveTab(tabId);
    if (tabId !== 'all') {
      dashboardContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      {/* Slim, Minimal Sticky Summary Bar */}
      <StickySummaryBar
        productName={productName}
        results={results}
        onScrollToTop={handleScrollToTop}
        onScrollToPricing={handleScrollToPricing}
      />

      <div ref={topRef} className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 print:hidden">
        {/* Minimal Header */}
        <Header
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
          onReset={handleReset}
          onPrint={handlePrint}
          onToggleGuide={() => setIsGuideOpen(!isGuideOpen)}
          isGuideOpen={isGuideOpen}
        />

        {/* Collapsible Quick Guide */}
        <InstructionsPanel
          isOpen={isGuideOpen}
          onToggle={() => setIsGuideOpen(!isGuideOpen)}
        />

        {/* Executive Metric Cards */}
        <ExecutiveMetricStrip
          results={results}
          pricing={pricing}
          onSelectTab={(tabId) => handleSelectTab(tabId as DashboardTabId)}
        />

        {/* Workflow Navigation Bar */}
        <DashboardNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          results={results}
          batchUnits={batchUnits}
          pricing={pricing}
          productName={productName}
        />

        {/* Active View Container */}
        <div ref={dashboardContentRef}>
          {/* STEP FOCUS MODE */}
          {activeTab !== 'all' && (
            <div>
              {/* Step 1: Product Info */}
              {activeTab === '1' && (
                <div id="section-1">
                  <Section1ProductInfo
                    productName={productName}
                    batchUnits={batchUnits}
                    onChangeProductName={(name) => {
                      setActivePresetId(null);
                      setProductName(name);
                    }}
                    onChangeBatchUnits={(units) => {
                      setActivePresetId(null);
                      setBatchUnits(units);
                    }}
                  />
                  <DashboardStepFooter currentTab="1" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 2: Materials */}
              {activeTab === '2' && (
                <div id="section-2">
                  <Section2Materials
                    materials={materials}
                    batchUnits={batchUnits}
                    totalMaterialCostBatch={results.totalMaterialCostBatch}
                    materialCostPerUnit={results.materialCostPerUnit}
                    onUpdateMaterial={handleUpdateMaterial}
                    onAddMaterial={handleAddMaterial}
                    onRemoveMaterial={handleRemoveMaterial}
                  />
                  <DashboardStepFooter currentTab="2" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 3: Packaging */}
              {activeTab === '3' && (
                <div id="section-3">
                  <Section3Packaging
                    packaging={packaging}
                    totalPackagingCostPerUnit={results.totalPackagingCostPerUnit}
                    onUpdatePackaging={handleUpdatePackaging}
                    onAddPackaging={handleAddPackaging}
                    onRemovePackaging={handleRemovePackaging}
                  />
                  <DashboardStepFooter currentTab="3" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 4: Labour */}
              {activeTab === '4' && (
                <div id="section-4">
                  <Section4Labour
                    labour={labour}
                    batchUnits={batchUnits}
                    totalLabourCostBatch={results.totalLabourCostBatch}
                    labourCostPerUnit={results.labourCostPerUnit}
                    onUpdateLabour={handleUpdateLabour}
                  />
                  <DashboardStepFooter currentTab="4" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 5: Overhead */}
              {activeTab === '5' && (
                <div id="section-5">
                  <Section5Overhead
                    overhead={overhead}
                    totalMonthlyOverhead={results.totalMonthlyOverhead}
                    overheadPerUnit={results.overheadPerUnit}
                    onUpdateOverhead={handleUpdateOverhead}
                    onAddOverheadItem={handleAddOverheadItem}
                    onUpdateOverheadItem={handleUpdateOverheadItem}
                    onRemoveOverheadItem={handleRemoveOverheadItem}
                  />
                  <DashboardStepFooter currentTab="5" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 6: True Cost Summary */}
              {activeTab === '6' && (
                <div id="section-6">
                  <Section6TrueCostSummary
                    materialCostPerUnit={results.materialCostPerUnit}
                    totalPackagingCostPerUnit={results.totalPackagingCostPerUnit}
                    labourCostPerUnit={results.labourCostPerUnit}
                    overheadPerUnit={results.overheadPerUnit}
                    trueCostPerUnit={results.trueCostPerUnit}
                    productName={productName}
                  />
                  <DashboardStepFooter currentTab="6" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 7: Pricing Strategy */}
              {activeTab === '7' && (
                <div id="section-7" ref={pricingSectionRef}>
                  <Section7Pricing
                    trueCostPerUnit={results.trueCostPerUnit}
                    pricing={pricing}
                    markupScenario={results.markupScenario}
                    marginScenario={results.marginScenario}
                    onUpdatePricing={handleUpdatePricing}
                  />
                  <DashboardStepFooter currentTab="7" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 8: Selling Costs & Gateway Fees */}
              {activeTab === '8' && (
                <div id="section-8">
                  <Section8SellingCosts
                    sellingCosts={sellingCosts}
                    activeSellingPrice={results.activeSellingPrice}
                    totalSellingCostsPerUnit={results.totalSellingCostsPerUnit}
                    netProfitPerUnit={results.netProfitPerUnit}
                    netProfitMargin={results.netProfitMargin}
                    onUpdateSellingCost={handleUpdateSellingCost}
                    onAddSellingCost={handleAddSellingCost}
                    onRemoveSellingCost={handleRemoveSellingCost}
                  />
                  <DashboardStepFooter currentTab="8" onSelectTab={handleSelectTab} />
                </div>
              )}

              {/* Step 9: Final Executive Dashboard */}
              {activeTab === '9' && (
                <div id="section-9">
                  <Section9FinalDashboard
                    productName={productName}
                    results={results}
                    pricing={pricing}
                    testDiscountPercent={discount.testDiscountPercent}
                    onChangeDiscount={handleChangeDiscount}
                    onPrint={handlePrint}
                  />
                  <DashboardStepFooter currentTab="9" onSelectTab={handleSelectTab} />
                </div>
              )}
            </div>
          )}

          {/* CONTINUOUS VIEW MODE */}
          {activeTab === 'all' && (
            <div className="space-y-5">
              <Section1ProductInfo
                productName={productName}
                batchUnits={batchUnits}
                onChangeProductName={(name) => {
                  setActivePresetId(null);
                  setProductName(name);
                }}
                onChangeBatchUnits={(units) => {
                  setActivePresetId(null);
                  setBatchUnits(units);
                }}
              />

              <Section2Materials
                materials={materials}
                batchUnits={batchUnits}
                totalMaterialCostBatch={results.totalMaterialCostBatch}
                materialCostPerUnit={results.materialCostPerUnit}
                onUpdateMaterial={handleUpdateMaterial}
                onAddMaterial={handleAddMaterial}
                onRemoveMaterial={handleRemoveMaterial}
              />

              <Section3Packaging
                packaging={packaging}
                totalPackagingCostPerUnit={results.totalPackagingCostPerUnit}
                onUpdatePackaging={handleUpdatePackaging}
                onAddPackaging={handleAddPackaging}
                onRemovePackaging={handleRemovePackaging}
              />

              <Section4Labour
                labour={labour}
                batchUnits={batchUnits}
                totalLabourCostBatch={results.totalLabourCostBatch}
                labourCostPerUnit={results.labourCostPerUnit}
                onUpdateLabour={handleUpdateLabour}
              />

              <Section5Overhead
                overhead={overhead}
                totalMonthlyOverhead={results.totalMonthlyOverhead}
                overheadPerUnit={results.overheadPerUnit}
                onUpdateOverhead={handleUpdateOverhead}
                onAddOverheadItem={handleAddOverheadItem}
                onUpdateOverheadItem={handleUpdateOverheadItem}
                onRemoveOverheadItem={handleRemoveOverheadItem}
              />

              <Section6TrueCostSummary
                materialCostPerUnit={results.materialCostPerUnit}
                totalPackagingCostPerUnit={results.totalPackagingCostPerUnit}
                labourCostPerUnit={results.labourCostPerUnit}
                overheadPerUnit={results.overheadPerUnit}
                trueCostPerUnit={results.trueCostPerUnit}
                productName={productName}
              />

              <div ref={pricingSectionRef}>
                <Section7Pricing
                  trueCostPerUnit={results.trueCostPerUnit}
                  pricing={pricing}
                  markupScenario={results.markupScenario}
                  marginScenario={results.marginScenario}
                  onUpdatePricing={handleUpdatePricing}
                />
              </div>

              <Section8SellingCosts
                sellingCosts={sellingCosts}
                activeSellingPrice={results.activeSellingPrice}
                totalSellingCostsPerUnit={results.totalSellingCostsPerUnit}
                netProfitPerUnit={results.netProfitPerUnit}
                netProfitMargin={results.netProfitMargin}
                onUpdateSellingCost={handleUpdateSellingCost}
                onAddSellingCost={handleAddSellingCost}
                onRemoveSellingCost={handleRemoveSellingCost}
              />

              <Section9FinalDashboard
                productName={productName}
                results={results}
                pricing={pricing}
                testDiscountPercent={discount.testDiscountPercent}
                onChangeDiscount={handleChangeDiscount}
                onPrint={handlePrint}
              />
            </div>
          )}
        </div>
      </div>

      {/* Printable Sheet */}
      <PrintSummarySheet
        productName={productName}
        batchUnits={batchUnits}
        materials={materials}
        packaging={packaging}
        labour={labour}
        overhead={overhead}
        pricing={pricing}
        sellingCosts={sellingCosts}
        results={results}
      />
    </div>
  );
}
