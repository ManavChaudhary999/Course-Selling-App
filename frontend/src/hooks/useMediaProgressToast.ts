import { useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

interface ToastType {
    id: string;
    dismiss: ()=> void;
    update: (props: any) => void;
}

interface Props {
  title: string;
  description: string;
  isMediaUploading: boolean;
  progress: number;
}
export default function MediaProgressToast({ title, description , isMediaUploading, progress } : Props) {
  const [showProgress, setShowProgress] = useState(true);

  const toastId = useRef<ToastType| null>();

const {toast} = useToast();

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
    } else {
        const timer = setTimeout(() => {
            setShowProgress(false);
        }, 1000);

        // toastId.current?.dismiss();
        toastId.current = null;

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  if(!toastId.current) {
    toastId.current = toast({
        title: `${title}... (${progress}%)`,
        description,
        variant: "default"
    });
  }

  if(toastId.current && showProgress) {
    toastId.current.update({
        title: `${title}... (${progress}%)`,
        description,
        variant: "default"
    })
  }

  return toastId?.current;
}