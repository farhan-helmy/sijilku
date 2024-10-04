import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import { TextElement } from "../_lib/types";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CertificateEditMenuProps {
  handleTemplateChange: (value: string) => void;
  addNewText: () => void;
  textElements: TextElement[];
  updateTextElement: (id: string, updates: Partial<TextElement>) => void;
  setSelectedTextId: (id: string | null) => void;
  deleteTextElement: (id: string) => void;
  selectedTextId: string | null;
}

const templates = [
  "/templates/gnb_modern_certficate.png",
  "/templates/gnca_classic.png",
  "/templates/pink_cute.png",
  "/templates/red_and_gold.png",
];

const fonts = [
  { name: "Old English Text MT", value: "'Old English Text MT', serif" },
  { name: "Edwardian Script ITC", value: "'Edwardian Script ITC', cursive" },
  { name: "Lucida Calligraphy", value: "'Lucida Calligraphy', cursive" },
  { name: "Copperplate Gothic", value: "'Copperplate Gothic', serif" },
  { name: "Baskerville", value: "Baskerville, serif" },
  { name: "Garamond", value: "Garamond, serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Arial", value: "Arial, sans-serif" },
];

export function CertificateEditMenu({
  handleTemplateChange,
  addNewText,
  textElements,
  updateTextElement,
  setSelectedTextId,
  deleteTextElement,
  selectedTextId,
}: CertificateEditMenuProps) {
  const selectedElement = textElements.find(el => el.id === selectedTextId);

  return (
    <Tabs defaultValue="edit">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="flex gap-2 flex-col max-h-[600px] overflow-auto">
        <Button onClick={addNewText} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add New Text
        </Button>

        <div className="space-y-2">
          {textElements.map((el) => (
            <Button
              key={el.id}
              onClick={() => setSelectedTextId(el.id)}
              variant={selectedTextId === el.id ? "secondary" : "outline"}
              className="w-full justify-start"
            >
              {el.text}
            </Button>
          ))}
        </div>

        {selectedElement && (
          <div className="space-y-2 border p-4 rounded-md">
            <Input
              value={selectedElement.text}
              onChange={(e) =>
                updateTextElement(selectedElement.id, { text: e.target.value })
              }
            />
            <div className="space-y-1">
              <Label>Font Size</Label>
              <Slider
                min={10}
                max={72}
                step={1}
                value={[selectedElement.fontSize]}
                onValueChange={(values) =>
                  updateTextElement(selectedElement.id, { fontSize: values[0] })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Font Family</Label>
              <Select
                value={selectedElement.fontFamily}
                onValueChange={(value) =>
                  updateTextElement(selectedElement.id, { fontFamily: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Color</Label>
              <Input
                type="color"
                value={selectedElement.color || "#000000"}
                onChange={(e) =>
                  updateTextElement(selectedElement.id, { color: e.target.value })
                }
              />
            </div>
            <Button
              onClick={() => {
                deleteTextElement(selectedElement.id);
                setSelectedTextId(null);
              }}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Text
            </Button>
          </div>
        )}
      </TabsContent>
      <TabsContent value="templates" className="h-[500px] overflow-auto">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template, index) => (
            <div
              key={index}
              className="rounded-md border border-black h-56 bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
              onClick={() => handleTemplateChange(template)}
            >
              <Image
                src={template}
                alt={template}
                className="max-w-full max-h-full object-contain"
                width={200}
                height={200}
              />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}