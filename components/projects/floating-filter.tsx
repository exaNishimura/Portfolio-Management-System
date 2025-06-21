import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Filter, 
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SkillIcon } from '@/lib/utils/skill-icons';
import { SORT_OPTIONS, SortOption } from '@/lib/constants/projects';

interface FloatingFilterProps {
  isVisible: boolean;
  isSidebarMinimized: boolean;
  setIsSidebarMinimized: (value: boolean) => void;
  isTechFilterOpen: boolean;
  setIsTechFilterOpen: (value: boolean) => void;
  isSortFilterOpen: boolean;
  setIsSortFilterOpen: (value: boolean) => void;
  allTechnologies: string[];
  selectedTechnologies: string[];
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  filteredCount: number;
  onTechnologyChange: (tech: string, checked: boolean | 'indeterminate') => void;
  onClearFilters: () => void;
}

export function FloatingFilter({
  isVisible,
  isSidebarMinimized,
  setIsSidebarMinimized,
  isTechFilterOpen,
  setIsTechFilterOpen,
  isSortFilterOpen,
  setIsSortFilterOpen,
  allTechnologies,
  selectedTechnologies,
  sortBy,
  setSortBy,
  filteredCount,
  onTechnologyChange,
  onClearFilters
}: FloatingFilterProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed bottom-6 right-6 z-40"
    >
      {/* フィルターボタン */}
      <motion.button
        onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
        className="bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-full p-4 shadow-2xl hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200 mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSidebarMinimized ? (
          <Filter className="h-6 w-6 text-slate-800 dark:text-white" />
        ) : (
          <X className="h-6 w-6 text-slate-800 dark:text-white" />
        )}
      </motion.button>

      {/* フィルターパネル */}
      <AnimatePresence>
        {!isSidebarMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl w-80 md:w-96 max-h-[70vh] min-h-96 pt-6 pb-6 px-6"
            style={{ marginBottom: '60px', marginRight: '0px' }}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white">フィルター</h3>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[calc(70vh-120px)]">
              {/* 技術スタックフィルター */}
              <Collapsible open={isTechFilterOpen} onOpenChange={setIsTechFilterOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-colors backdrop-blur-sm">
                  <span className="font-medium text-slate-800 dark:text-white">技術</span>
                  {isTechFilterOpen ? <ChevronUp className="h-4 w-4 text-slate-800 dark:text-white" /> : <ChevronDown className="h-4 w-4 text-slate-800 dark:text-white" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {allTechnologies.map((tech) => (
                        <div key={tech} className="flex items-center space-x-3">
                          <Checkbox
                            id={`floating-tech-${tech}`}
                            checked={selectedTechnologies.includes(tech)}
                            onCheckedChange={(checked) => onTechnologyChange(tech, checked)}
                            className="border-slate-600 dark:border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <Label 
                            htmlFor={`floating-tech-${tech}`} 
                            className="text-sm cursor-pointer flex-1 text-slate-800 dark:text-white flex items-center gap-2"
                          >
                            <SkillIcon skill={tech} size={16} />
                            {tech}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ソートフィルター */}
              <Collapsible open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-colors backdrop-blur-sm">
                  <span className="font-medium text-slate-800 dark:text-white">並び順</span>
                  {isSortFilterOpen ? <ChevronUp className="h-4 w-4 text-slate-800 dark:text-white" /> : <ChevronDown className="h-4 w-4 text-slate-800 dark:text-white" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3">
                    <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-3">
                      {SORT_OPTIONS.map((option) => (
                        <div 
                          key={option.value} 
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem 
                            value={option.value} 
                            id={`floating-sort-${option.value}`}
                            className="border-slate-600 dark:border-slate-400 text-blue-500"
                          />
                          <Label 
                            htmlFor={`floating-sort-${option.value}`} 
                            className="text-sm cursor-pointer flex-1 text-slate-800 dark:text-white"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* フィルタークリア */}
              <button
                onClick={onClearFilters}
                className="w-full p-3 bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-500 hover:to-pink-600 rounded-xl text-white font-medium transition-all duration-200 backdrop-blur-sm"
              >
                フィルターをクリア
              </button>

              {/* 結果件数 */}
              <div className="text-center text-slate-600 dark:text-slate-300 text-sm">
                {filteredCount}件の実績
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 