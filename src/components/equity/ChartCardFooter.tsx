"use client";

import React, { useState, RefObject } from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";
import { toPng, toBlob } from 'html-to-image';

interface ChartCardFooterProps {
  cardTitle: string;
  chartName: string; // A slugified version of the title for the filename
  cardRef: RefObject<HTMLDivElement>; // Pass the ref to the Card element
}

export const ChartCardFooter: React.FC<ChartCardFooterProps> = ({ cardTitle, chartName, cardRef }) => {
  const [isSharing, setIsSharing] = useState(false);
  const commonImageOptions = {
    pixelRatio: 2, // Capture at double resolution for clarity
    backgroundColor: 'hsl(var(--card))', // Explicitly set background
    // quality: 0.98, // More relevant for JPEG, less so for PNG
  };

  const downloadImage = async (element: HTMLElement) => {
    const dataUrl = await toPng(element, commonImageOptions);
    const link = document.createElement('a');
    link.download = `${chartName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const handleShareClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const cardElement = cardRef.current;

    if (!cardElement) {
      console.error("Could not find the card element to share.");
      alert("Error: Could not find the card element to share. Please try again.");
      return;
    }

    setIsSharing(true);
    try {
      // Check for Web Share API support for files
      if (navigator.share && navigator.canShare) {
        const blob = await toBlob(cardElement, commonImageOptions);
        if (!blob) {
          throw new Error("Failed to generate image blob for sharing.");
        }
        const file = new File([blob], `${chartName}.png`, { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: cardTitle,
            text: `Check out this chart: ${cardTitle}`,
          });
        } else {
          // If navigator.canShare({ files: ... }) is false, fallback to download
          console.warn("Web Share API cannot share files on this browser, falling back to download.");
          await downloadImage(cardElement);
        }
      } else {
        // Fallback for desktop or browsers without Web Share API
        await downloadImage(cardElement);
      }
    } catch (error) {
      console.error('Failed to generate card image:', error);
      alert('Sorry, an error occurred while generating the image.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <CardFooter className="flex justify-between pt-6">
      <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto">
        <Newspaper className="mr-2 h-4 w-4" />
        MORE DETAILS
      </Button>
      <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto" onClick={handleShareClick} disabled={isSharing}>
        <Share2 className="mr-2 h-4 w-4" />
        {isSharing ? 'SHARING...' : 'SHARE'}
      </Button>
    </CardFooter>
  );
};