import React from 'react';

import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  isImageDialogOpen: boolean;
  setIsImageDialogOpen: (isImageDialogOpen: boolean) => void;
  screenshot: string;
};

const ImageDialogue = (props: Props) => {
  return (
    <div>
      <Dialog
        open={props.isImageDialogOpen}
        onOpenChange={props.setIsImageDialogOpen}
      >
        <DialogContent className="min-w-full">
          <DialogHeader>
            <DialogTitle>Oooh, let&apos;s share this with someone</DialogTitle>
          </DialogHeader>
          <div>
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <Image
                alt="Product image"
                className="aspect-square rounded-md object-contain"
                fill={true}
                src={props.screenshot}
              />
            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageDialogue;
