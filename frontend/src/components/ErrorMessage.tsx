import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  type?: string;
}

export const ErrorMessage = ({ message, type='error'}: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <div className={
      cn("bg-red-100 border border-red-400 px-4 py-3 rounded mb-4",
        type === 'error' ? 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4' : 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'
    )}>
      {message}
    </div>
  );
};