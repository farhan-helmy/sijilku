"use client";

import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { ImageDimensions, TextElement } from "../_lib/types";
import { CertificateEditMenu } from "./certificate-edit-menu";
import { Button } from "@/components/ui/button";
import { LottieLoading } from "./lottie-loading";
import { useLoading } from "@/hooks/use-loading";
import { saveTemplate } from "../_lib/actions";

export function GenerateCertificatePanel() {
  const [template, setTemplate] = useState<string>("");
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 700,
    height: 500,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const { isLoading, withLoading } = useLoading();

  const stageRef = useRef<Konva.Stage>(null);

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    const image = new window.Image();
    image.src = value;
    image.onload = () => {
      setImage(image);
      const maxWidth = 700;
      const scaleFactor = image.width > maxWidth ? maxWidth / image.width : 1;
      setImageDimensions({
        width: image.width * scaleFactor,
        height: image.height * scaleFactor,
      });
    };
  };

  const addNewText = () => {
    const newText: TextElement = {
      id: Date.now().toString(),
      text: "New Text",
      fontSize: 20,
      x: 300,
      y: 200,
    };
    setTextElements([...textElements, newText]);
    setSelectedTextId(newText.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteTextElement = (id: string) => {
    setTextElements(textElements.filter((el) => el.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    updateTextElement(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const generateCertificate = async () => {
    if (stageRef.current) {
      setIsGenerating(true);
      try {
        // Wrap the generation process in a Promise and use setTimeout
        // to ensure the loading state is reflected in the UI
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            const scaleFactor = 2;
            const exportStage = new Konva.Stage({
              width: imageDimensions.width * scaleFactor,
              height: imageDimensions.height * scaleFactor,
              container: document.createElement("div"),
            });

            const exportLayer = new Konva.Layer();
            exportStage.add(exportLayer);

            if (image) {
              const bgImage = new Konva.Image({
                image: image,
                width: imageDimensions.width * scaleFactor,
                height: imageDimensions.height * scaleFactor,
              });
              exportLayer.add(bgImage);
            }

            textElements.forEach((el) => {
              const text = new Konva.Text({
                x: el.x * scaleFactor,
                y: el.y * scaleFactor,
                text: el.text,
                fontSize: el.fontSize * scaleFactor,
                fontFamily: el.fontFamily,
                fill: el.color || "black",
              });
              exportLayer.add(text);
            });

            const dataURL = exportStage.toDataURL({ pixelRatio: scaleFactor });
            exportStage.destroy();

            const link = document.createElement("a");
            link.download = "high_quality_certificate.png";
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            resolve();
          }, 100); // Small delay to ensure loading state is shown
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const saveAsTemplate = withLoading(async () => {
    const res = await saveTemplate({
      name: "New Template",
      backgroundTemplate: template,
      textElements: JSON.stringify(textElements),
      imageDimensions: JSON.stringify(imageDimensions),
      userId: "1",
    });

    console.log(res);

    if (res.error) {
      alert("Failed to save template");
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex">
        {/* Options Panel */}
        <div className="w-1/3 p-4 space-y-4">
          <CertificateEditMenu
            handleTemplateChange={handleTemplateChange}
            selectedTextId={selectedTextId}
            addNewText={addNewText}
            textElements={textElements}
            updateTextElement={updateTextElement}
            setSelectedTextId={setSelectedTextId}
            deleteTextElement={deleteTextElement}
          />
        </div>

        {/* Certificate Preview */}
        <div className="w-2/3 py-24 flex items-center justify-center flex-col">
          <Stage
            width={imageDimensions.width}
            height={imageDimensions.height}
            ref={stageRef}
          >
            <Layer>
              {template && image ? (
                <KonvaImage
                  image={image}
                  src={template}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                />
              ) : (
                <Rect
                  width={650}
                  height={420}
                  fill="#f0f0f0"
                  stroke="black"
                  strokeWidth={2}
                />
              )}
              {textElements.map((el) => (
                <Text
                  key={el.id}
                  text={el.text}
                  fontSize={el.fontSize}
                  x={el.x}
                  y={el.y}
                  fontFamily={el.fontFamily}
                  fill={el.color || "black"}
                  draggable
                  onDragEnd={(e) => handleDragEnd(el.id, e)}
                  onClick={() => setSelectedTextId(el.id)}
                  onTap={() => setSelectedTextId(el.id)}
                />
              ))}
            </Layer>
          </Stage>
          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={generateCertificate}>Generate Certificate</Button>
            <Button onClick={saveAsTemplate} variant="secondary">
              Save As Template
            </Button>
          </div>
        </div>
      </div>
      {isGenerating || isLoading ? (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LottieLoading />
        </div>
      ) : null}
    </div>
  );
}
