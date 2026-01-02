import React from 'react';
import { FilterBar } from './FilterBar';
import { SectionCard } from './SectionCard';
import { assets as initialAssets, Asset } from '../../lib/data';
import { Toast } from '../ui/Toast';
import { AssetEditView } from './AssetEditView';

export function AssetGrid() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [assets, setAssets] = React.useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const introAssets = filteredAssets.filter(a => a.type === 'intro');
  const midtroAssets = filteredAssets.filter(a => a.type === 'midtro');

  const handleAssetUpload = (newAsset: Asset) => {
    setAssets(prev => [newAsset, ...prev]);
    setShowToast(true);
  };

  const handleAssetSave = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setSelectedAsset(updatedAsset); // Keep showing the edit view with updated data
  };

  if (selectedAsset) {
    return (
      <AssetEditView 
        asset={selectedAsset} 
        onBack={() => setSelectedAsset(null)}
        onSave={handleAssetSave}
      />
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#010101]">
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-white tracking-[-0.3px]">All Assets</h1>
        </div>

        <FilterBar 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onSearchChange={setSearchQuery}
        />

        <SectionCard 
          title="Intros" 
          count={introAssets.length} 
          assets={introAssets} 
          viewMode={viewMode}
          onAssetUpload={handleAssetUpload}
          onAssetClick={setSelectedAsset}
        />
        
        <SectionCard 
          title="Midtros" 
          count={midtroAssets.length} 
          assets={midtroAssets} 
          viewMode={viewMode}
          onAssetUpload={handleAssetUpload}
          onAssetClick={setSelectedAsset}
        />
      </div>

      <Toast 
        show={showToast} 
        message="Asset uploaded successfully" 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}
