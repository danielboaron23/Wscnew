import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Pencil, 
  Trash2, 
  Globe, 
  Info,
  Check,
  Plus,
  ChevronDown
} from 'lucide-react';
import { Asset } from '../../lib/data';
import { cn } from '../../lib/utils';
import { Toast } from '../ui/Toast';

interface AssetEditViewProps {
  asset: Asset;
  onBack: () => void;
  onSave: (updatedAsset: Asset) => void;
}

export function AssetEditView({ asset, onBack, onSave }: AssetEditViewProps) {
  // Determine if it's a template (mock logic: if title contains "Template")
  const isTemplate = asset.title.toLowerCase().includes('template');

  // State
  const [assetName, setAssetName] = useState(asset.title);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    // Map internal type to display category (simple logic for demo)
    asset.type === 'intro' ? 'Intros' : 
    asset.type === 'midtro' ? 'Midtros' : 
    asset.type === 'outro' ? 'Outros' : 
    asset.type === 'thumbnail' ? 'Thumbnails' : 'Overlay Graphics'
  ]);
  const [selectedRatio, setSelectedRatio] = useState<string>('16:9');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Track changes
  const hasChanges = 
    assetName !== asset.title || 
    // This is a simplified check, in a real app would check arrays properly
    (selectedCategories.length > 0 && selectedCategories[0].toLowerCase() !== asset.type + 's' && selectedCategories[0].toLowerCase() !== asset.type);

  // Mock available ratios for the preview selector
  const previewRatios = ['16:9', '9:16', '1:1', '4:5'];
  
  // Mock current variants for the list
  const [variants, setVariants] = useState(
    asset.aspectRatios.map(r => ({
      ratio: r,
      filename: `${asset.title.toLowerCase().replace(/\s/g, '_')}_${r.replace(':', 'x')}.mp4`,
      size: '2.4 MB'
    }))
  );

  const categories = [
    'Intros', 'Midtros', 'Outros', 'Thumbnails', 'Overlay Graphics'
  ];

  const handleToggleCategory = (category: string) => {
    if (isTemplate) return;
    
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const handleDeleteVariant = (ratio: string) => {
    if (variants.length <= 1) return; // Prevent deleting last variant
    setVariants(prev => prev.filter(v => v.ratio !== ratio));
  };

  const handleSave = () => {
    onSave({
      ...asset,
      title: assetName,
      // Update other fields as needed
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onBack();
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#010101] overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="h-[64px] border-b border-[#333333] flex items-center justify-between px-6 shrink-0 bg-[#010101]">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 group"
          >
            <ArrowLeft className="w-6 h-6 text-[#BABABA] group-hover:text-[#F0F0F0] transition-colors" />
            <span className="text-[14px] text-[#BABABA] group-hover:text-[#F0F0F0] transition-colors">Back to Library</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isTemplate && (
            <div className="px-2 py-1 bg-[#282828] rounded text-[12px] font-bold text-[#E5FF00]">
              TEMPLATE
            </div>
          )}
          <h1 className="text-[18px] font-semibold text-[#F0F0F0]">
            {assetName}
          </h1>
          {hasChanges && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#E5FF00]" />
          )}
        </div>

        <div className="flex items-center gap-4">
          {isTemplate ? (
            <button className="h-[40px] px-6 bg-[#E5FF00] hover:bg-[#D4ED00] rounded-[8px] text-[14px] font-bold text-[#010101] transition-colors">
              Use Template
            </button>
          ) : (
            <button 
              onClick={handleSave}
              disabled={!hasChanges}
              className={cn(
                "h-[40px] px-6 rounded-[8px] text-[14px] font-bold transition-colors",
                hasChanges 
                  ? "bg-[#E5FF00] hover:bg-[#D4ED00] text-[#010101]" 
                  : "bg-[#404040] text-[#5D5D5D] cursor-not-allowed"
              )}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column - Preview Section */}
        <div className="w-[60%] p-6 overflow-y-auto border-r border-[#333333]/50">
          <div className="bg-[#181818] border border-[#333333] rounded-[12px] p-6 h-full flex flex-col">
            
            {/* Video Preview Area */}
            <div className="flex-1 bg-[#010101] rounded-[8px] relative flex items-center justify-center overflow-hidden mb-6 group">
              {/* Aspect Ratio Container */}
              <div 
                className="relative bg-black transition-all duration-300"
                style={{
                  aspectRatio: selectedRatio.replace(':', '/'),
                  height: selectedRatio === '9:16' ? '90%' : 'auto',
                  width: selectedRatio === '16:9' ? '100%' : 'auto',
                  maxHeight: '100%',
                  maxWidth: '100%'
                }}
              >
                <img 
                  src={asset.thumbnail} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-[64px] h-[64px] rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Controls Overlay (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-[#333333] rounded-[4px] mb-2 cursor-pointer relative group/progress">
                   <div className="absolute inset-y-0 left-0 bg-[#E5FF00] rounded-[4px] w-[0%]" />
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#BABABA]">0:00 / {asset.duration}</span>
                </div>
              </div>
            </div>

            {/* Video Controls Row */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-[32px] h-[32px] rounded-[4px] bg-[#282828] hover:bg-[#333333] flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[#F0F0F0]" /> : <Play className="w-4 h-4 text-[#F0F0F0]" />}
              </button>
              
              <button className="w-[32px] h-[32px] rounded-[4px] bg-[#282828] hover:bg-[#333333] flex items-center justify-center transition-colors">
                <Volume2 className="w-4 h-4 text-[#F0F0F0]" />
              </button>

              <div className="flex-1" />

              <button className="w-[32px] h-[32px] rounded-[4px] bg-[#282828] hover:bg-[#333333] flex items-center justify-center transition-colors">
                <Maximize className="w-4 h-4 text-[#F0F0F0]" />
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <p className="text-[12px] font-medium text-[#BABABA] mb-3">Preview Variant</p>
              <div className="flex items-end gap-3">
                {previewRatios.map(ratio => {
                  const isSelected = selectedRatio === ratio;
                  const [w, h] = ratio.split(':').map(Number);
                  
                  return (
                    <button
                      key={ratio}
                      onClick={() => setSelectedRatio(ratio)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div 
                        className={cn(
                          "bg-[#282828] border-2 rounded-[8px] transition-all relative overflow-hidden",
                          isSelected ? "border-[#E5FF00]" : "border-transparent group-hover:border-[#404040]"
                        )}
                        style={{
                          width: '80px',
                          height: `${(80 / w) * h}px`,
                          maxHeight: '60px'
                        }}
                      >
                         <img src={asset.thumbnail} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" alt={ratio} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        isSelected ? "text-[#E5FF00]" : "text-[#BABABA]"
                      )}>
                        {ratio}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Panel */}
        <div className="w-[40%] p-6 overflow-y-auto">
          <div className="bg-[#181818] border border-[#333333] rounded-[12px] p-6 flex flex-col gap-6">
            
            {/* Section 1: Asset Name */}
            <div>
              <label className="block text-[12px] font-medium text-[#BABABA] mb-2">Asset Name</label>
              {isTemplate ? (
                 <p className="text-[16px] font-semibold text-[#F0F0F0] py-2">{assetName}</p>
              ) : (
                <div className="relative">
                  <input 
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full h-[44px] bg-[#282828] border border-[#404040] rounded-[8px] px-3 pr-10 text-[14px] text-[#F0F0F0] focus:outline-none focus:border-[#E5FF00] transition-colors"
                  />
                  <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BABABA]" />
                </div>
              )}
            </div>

            {/* Section 2: Categories */}
            <div>
              <label className="block text-[12px] font-medium text-[#BABABA] mb-2">Categories</label>
              {isTemplate ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.concat(['Essentials']).map(cat => (
                    <div key={cat} className="px-3 py-1 bg-[#282828] rounded-[24px]">
                      <span className="text-[12px] font-medium text-[#F0F0F0]">{cat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map(category => {
                    const isChecked = selectedCategories.includes(category);
                    return (
                      <button 
                        key={category}
                        onClick={() => handleToggleCategory(category)}
                        className="flex items-center gap-2 group w-full text-left"
                      >
                        <div className={cn(
                          "w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors",
                          isChecked 
                            ? "bg-[#E5FF00] border-[#E5FF00]" 
                            : "bg-[#282828] border-[#404040] group-hover:border-[#5D5D5D]"
                        )}>
                          {isChecked && <Check className="w-3 h-3 text-[#010101] stroke-[3]" />}
                        </div>
                        <span className="text-[14px] text-[#F0F0F0]">{category}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: Aspect Ratios */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-medium text-[#BABABA]">Aspect Ratios</label>
                {!isTemplate && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-[12px] font-bold text-[#BABABA] hover:text-[#F0F0F0] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Variant
                    </button>
                    
                    {/* Add Variant Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[200px] bg-[#282828] border border-[#404040] rounded-[8px] shadow-xl z-50 py-2">
                        {['16:9 (Landscape)', '9:16 (Portrait)', '1:1 (Square)', '4:5 (Portrait)', '4:3 (Landscape)', '21:9 (Cinematic)'].map(opt => {
                           const ratio = opt.split(' ')[0];
                           const isDisabled = variants.some(v => v.ratio === ratio);
                           
                           return (
                             <button
                               key={opt}
                               disabled={isDisabled}
                               className={cn(
                                 "w-full text-left px-4 py-2 text-[14px]",
                                 isDisabled 
                                   ? "text-[#5D5D5D] cursor-not-allowed" 
                                   : "text-[#F0F0F0] hover:bg-[#333333]"
                               )}
                               onClick={() => {
                                 setVariants(prev => [...prev, { ratio, filename: `new_variant_${ratio.replace(':','x')}.mp4`, size: '0 MB' }]);
                                 setIsDropdownOpen(false);
                               }}
                             >
                               {opt}
                             </button>
                           );
                        })}
                      </div>
                    )}
                    {/* Backdrop for dropdown */}
                    {isDropdownOpen && (
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {isTemplate ? (
                  <div className="flex flex-wrap gap-2">
                    {previewRatios.map(ratio => (
                       <div key={ratio} className="px-2 py-1 bg-[#282828] rounded-[8px] border border-transparent">
                          <span className="text-[12px] font-medium text-white block leading-none">{ratio}</span>
                       </div>
                    ))}
                  </div>
                ) : (
                  variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-3 h-[44px] group">
                      <div className="px-[9px] py-[3px] bg-[#282828] rounded-[8px] w-[50px] flex justify-center">
                        <span className="text-[12px] font-medium text-white">{variant.ratio}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-[#F0F0F0] truncate">{variant.filename}</p>
                        <p className="text-[12px] text-[#5D5D5D]">{variant.size}</p>
                      </div>
                      <button 
                         onClick={() => handleDeleteVariant(variant.ratio)}
                         className="w-[24px] h-[24px] flex items-center justify-center rounded-full text-[#BABABA] hover:text-[#DE4A4A] transition-colors hover:bg-[#DE4A4A]/10 opacity-0 group-hover:opacity-100"
                         title={variants.length <= 1 ? "Cannot delete last variant" : "Delete variant"}
                         disabled={variants.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 4: Visibility / Template Info */}
            <div>
              {isTemplate ? (
                 <>
                   <label className="block text-[12px] font-medium text-[#BABABA] mb-2">Template Info</label>
                   <div className="space-y-1">
                      <p className="text-[14px] text-[#F0F0F0]">This is a shared template</p>
                      <p className="text-[12px] text-[#5D5D5D]">Created by: WSC Sport</p>
                      <p className="text-[12px] text-[#5D5D5D]">Added: Nov 10, 2024</p>
                      <div className="flex items-center gap-1.5 mt-2">
                         <Info className="w-3.5 h-3.5 text-[#5D5D5D]" />
                         <span className="text-[12px] text-[#5D5D5D]">Templates cannot be edited</span>
                      </div>
                   </div>
                 </>
              ) : (
                 <>
                    <label className="block text-[12px] font-medium text-[#BABABA] mb-2">Visibility</label>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#F0F0F0]" />
                          <span className="text-[14px] text-[#F0F0F0]">All Users</span>
                       </div>
                       <button className="text-[14px] font-bold text-[#80B8FF] underline hover:text-[#80B8FF]/80">
                         Edit Rules
                       </button>
                    </div>
                 </>
              )}
            </div>

            <div className="h-px bg-[#333333] my-2" />
            
            {/* Asset Info */}
            <div className="space-y-1">
              <p className="text-[12px] text-[#5D5D5D]">Uploaded: {asset.date}</p>
              <p className="text-[12px] text-[#5D5D5D]">File size: {asset.fileSize} total</p>
              <p className="text-[12px] text-[#5D5D5D]">Last modified: Dec 28, 2024</p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast 
        show={showToast}
        message="Changes saved successfully"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
