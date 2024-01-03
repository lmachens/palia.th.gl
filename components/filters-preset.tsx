"use client";
import { isOverwolfApp } from "@/lib/env";
import { useFilterPresetsStore } from "@/lib/storage/filter-presets";
import Toggle from "./toggle";
import { nanoid } from "nanoid";
import { useParamsStore } from "@/lib/storage/params";
import { useDict } from "./(i18n)/i18n-provider";
import { useState } from "react";

export default function FiltersPreset() {
  const dict = useDict();
  const presets = useFilterPresetsStore();
  const filters = useParamsStore((state) => state.filters);
  const setParams = useParamsStore((state) => state.setParams);
  const[newPresetName,setnewPresetName] = useState("")

  return (
    <>
      {presets.presets.length === 0 && (
        <div className="p-2">{dict.filters.noPresetsWarning}</div>
      )}
      {presets.presets.map((preset) => {
        return (
          <article key={preset.id} className={`p-2 space-y-1`}>
            <div className="flex justify-between">
            <div className="truncate text-base">{preset.name}</div>
              <Toggle
                checked={presets.activePresets.includes(preset.id)}
                onChange={(checked) => 
                  {
                    if(checked)
                     { 
                        presets.activatePreset(preset.id)
                        setParams({ filters: [...filters, ...preset.filters], dict });
                    }
                    else {
                        presets.deactivatePreset(preset.id)
                        setParams({ filters: filters.filter((id) => !preset.filters.includes(id)), dict });
                    }
                }}
                small
              />
              <div className="space-x-3">
                <button
                  className="hover:text-white"
                  title={dict.filters.deletePreset}
                  onClick={() => {
                    if (
                      confirm(dict.filters.confirmDelete)
                    ) {
                      presets.removePreset(preset.id);
                      setParams({ filters: filters.filter((id) => !preset.filters.includes(id)), dict });
                    }
                  }}
                >
              <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
							<path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
						</svg>
      
                </button>
              </div>
            </div>
            
          </article>
        );
      })}

<div className="flex justify-between col-span-2">
            <input
                className="bg-neutral-900 text-gray-200 text-sm px-2 py-1 w-full border border-gray-600 md:rounded-lg outline-none"
                type="text"
                placeholder={dict.filters.maskPresetName}
                title={dict.filters.promptPresetName}
                required
                autoFocus
                value={newPresetName}
                onChange={(event) => setnewPresetName(event.target.value)
                }
            />
        <button
          className="p-2 uppercase hover:text-white"
          title={dict.filters.addPreset}
          onClick={() => {
            presets.addPreset({id: nanoid(), filters: filters, name:newPresetName });
            setnewPresetName("")
          }}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
							<path d="M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"></path>
						</svg>
        </button>
        </div>
      </>
  );
}
